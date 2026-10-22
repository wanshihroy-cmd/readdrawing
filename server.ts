import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Increase payload limit to support high-resolution engineering drawings & PDFs
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Initialize Gemini SDK with User-Agent header for telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// RFQ Drawing Analysis Endpoint
app.post('/api/analyze-rfq', async (req, res) => {
  try {
    const { fileBase64, mimeType, fileName, customPrompt } = req.body;

    if (!fileBase64 || !mimeType) {
      return res.status(400).json({
        error: '請提供工程圖檔案 (base64) 與檔案格式 (mimeType)。',
      });
    }

    // Clean base64 string if data URL prefix was passed
    const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, '');

    const promptText = `
你是一位擁有20年經驗的專業「線材加工 / 線束組裝 (Wire Harness & Cable Assembly) 資深業務與製造工程師」。
請仔細閱讀並嚴格分析所上傳的客戶工程圖面（PDF / 圖片），為業務報價 (RFQ) 進行精確規格擷取。

【極其重要規則 - 嚴禁推測】：
對於任何在工程圖面中「未明確標註」、「無法辨識」或「無法確認」的欄位項目，必須一律填入「未提供」！
絕對不要自行推測、猜測或捏造任何料號、尺寸、線規或加工方式。
業務人員需要明確知道哪些資訊客戶沒有提供，以便向客戶進行 RFQ 規格澄清與詢問。

請擷取以下核心項目（以多行或表格條目呈現，若圖面有多種不同線材/線芯/回路或連接器，請拆解為各別明細項目）：
1. Connector (連接器型號、品牌、Pin數、公母座)
2. Terminal (端子型號、規格、公母端)
3. Wire (線材規格，例如 UL1007, UL1061, 耐溫耐壓, 材質/外被)
4. Wire Gauge (線規，例如 24 AWG, 22 AWG, 0.5mm²)
5. Wire Length (線長，包含長度與公差，例如 150mm ± 5mm)
6. Quantity (數量，單條用量或批量訂單數量)
7. Processing Requirement (加工要求，例如 兩端脫皮長度、壓接、鍍錫、熱縮套管、雙絞、外被剝除、貼標籤、超音波焊接等)
8. Special Requirement (特殊要求，例如 UL94V-0阻燃、耐溫105℃、RoHS/REACH、耐壓測試、導通阻抗測試、拉力測試、防水等級等)

另外，請同時擷取圖面總體資訊（圖號、客戶名稱、品名、版本、總長度）以及業務核價提醒清單（針對「未提供」的關鍵規格列出需向客戶確認的澄清點）。

${customPrompt ? `【使用者補充指示/重點關注】：${customPrompt}` : ''}
`;

    const filePart = {
      inlineData: {
        mimeType: mimeType,
        data: cleanBase64,
      },
    };

    const textPart = {
      text: promptText,
    };

    // Candidate models order: Primary -> Backup 1 -> Backup 2
    const MODEL_PIPELINE = [
      { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash (主要模型)' },
      { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite (備用模型 1)' },
      { id: 'gemini-flash-latest', name: 'Gemini Flash Latest (備用模型 2)' },
    ];

    const generateConfig = {
      systemInstruction:
        '你是線材加工與線束製造 (Wire Harness) 的專業 RFQ 規格分析系統。務必遵守規則：圖面上找不到的資訊一律填寫「未提供」，不得臆測。輸出嚴格遵循 JSON Schema。',
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          drawingInfo: {
            type: Type.OBJECT,
            properties: {
              drawingNumber: {
                type: Type.STRING,
                description: '圖面編號 / 圖號，若無則寫「未提供」',
              },
              partNumber: {
                type: Type.STRING,
                description: '客戶料號 / 零件編號，若無則寫「未提供」',
              },
              revision: {
                type: Type.STRING,
                description: '圖面版本 (Rev/Ver)，若無則寫「未提供」',
              },
              customerName: {
                type: Type.STRING,
                description: '客戶名稱，若無則寫「未提供」',
              },
              productTitle: {
                type: Type.STRING,
                description: '線束品名 / 描述，若無則寫「未提供」',
              },
              totalQuantity: {
                type: Type.STRING,
                description: '訂單批量需求 / RFQ 數量，若無則寫「未提供」',
              },
              overallLength: {
                type: Type.STRING,
                description: '總長度及公差，若無則寫「未提供」',
              },
              drawingDate: {
                type: Type.STRING,
                description: '繪圖/審核日期，若無則寫「未提供」',
              },
            },
            required: [
              'drawingNumber',
              'revision',
              'customerName',
              'productTitle',
              'totalQuantity',
              'overallLength',
            ],
          },
          items: {
            type: Type.ARRAY,
            description: '圖面所包含的各條線材/回路/BOM加工規格清單',
            items: {
              type: Type.OBJECT,
              properties: {
                id: {
                  type: Type.STRING,
                  description: '項目編號，例如 1, 2, W1, P1',
                },
                connector: {
                  type: Type.STRING,
                  description: 'Connector 連接器型號/規格。若無則寫「未提供」',
                },
                terminal: {
                  type: Type.STRING,
                  description: 'Terminal 端子型號/規格。若無則寫「未提供」',
                },
                wire: {
                  type: Type.STRING,
                  description: 'Wire 線材規格/型號/材質。若無則寫「未提供」',
                },
                wireGauge: {
                  type: Type.STRING,
                  description: 'Wire Gauge 線規 (AWG/mm²)。若無則寫「未提供」',
                },
                wireLength: {
                  type: Type.STRING,
                  description: 'Wire Length 線長與公差。若無則寫「未提供」',
                },
                quantity: {
                  type: Type.STRING,
                  description: 'Quantity 數量/用量。若無則寫「未提供」',
                },
                processingRequirement: {
                  type: Type.STRING,
                  description: 'Processing Requirement 加工要求。若無則寫「未提供」',
                },
                specialRequirement: {
                  type: Type.STRING,
                  description: 'Special Requirement 特殊要求。若無則寫「未提供」',
                },
                wireColor: {
                  type: Type.STRING,
                  description: '線色 (如: 紅/黑/藍) 或色碼。若無則寫「未提供」',
                },
                pinout: {
                  type: Type.STRING,
                  description: '接腳定義 (Pinout / 對位)。若無則寫「未提供」',
                },
                notes: {
                  type: Type.STRING,
                  description: '圖面註記位置或說明。若無則寫「未提供」',
                },
              },
              required: [
                'connector',
                'terminal',
                'wire',
                'wireGauge',
                'wireLength',
                'quantity',
                'processingRequirement',
                'specialRequirement',
              ],
            },
          },
          overallProcessingRequirement: {
            type: Type.STRING,
            description: '全圖綜合加工工藝要求摘要。若無則寫「未提供」',
          },
          overallSpecialRequirement: {
            type: Type.STRING,
            description: '全圖綜合特殊規範、安規測試、環境規範。若無則寫「未提供」',
          },
          clarificationChecklist: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '針對圖面中標記為「未提供」或不明確之處，業務向客戶提問確認的清單',
          },
          analysisSummary: {
            type: Type.STRING,
            description: '整體分析概述與評估建議',
          },
        },
        required: [
          'drawingInfo',
          'items',
          'overallProcessingRequirement',
          'overallSpecialRequirement',
          'clarificationChecklist',
        ],
      },
    };

    let successfulResponse: any = null;
    let successfulModel = '';
    let fallbackTriggered = false;
    let fallbackHistory: { model: string; error: string }[] = [];

    // Prioritize user's requested model if provided, followed by the rest
    const requestedModel = req.body.requestedModel;
    let modelsToTry = MODEL_PIPELINE.map(m => m.id);
    if (requestedModel && modelsToTry.includes(requestedModel)) {
      modelsToTry = [requestedModel, ...modelsToTry.filter(m => m !== requestedModel)];
    }

    // Try primary model, auto-fallback to backup models upon 503 UNAVAILABLE or high demand
    for (let i = 0; i < modelsToTry.length; i++) {
      const currentModel = modelsToTry[i];
      const modelMeta = MODEL_PIPELINE.find(m => m.id === currentModel);
      console.log(`[RFQ Analysis] 正在使用模型: ${currentModel} (${modelMeta?.name})...`);

      try {
        const response = await ai.models.generateContent({
          model: currentModel,
          contents: {
            parts: [filePart, textPart],
          },
          config: generateConfig,
        });

        if (response && response.text) {
          successfulResponse = response;
          successfulModel = currentModel;
          if (i > 0) {
            fallbackTriggered = true;
          }
          console.log(`[RFQ Analysis] 模型 ${currentModel} 分析成功！`);
          break; // Succeeded!
        } else {
          throw new Error(`模型 ${currentModel} 未回傳有效文字。`);
        }
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        const errStatus = err?.status || err?.code || '';
        console.warn(`[RFQ Analysis] 模型 ${currentModel} 遭遇錯誤: [${errStatus}] ${errMsg}`);

        fallbackHistory.push({
          model: currentModel,
          error: errMsg,
        });

        // If there are more fallback models available, log and continue to next
        if (i < modelsToTry.length - 1) {
          const nextModel = modelsToTry[i + 1];
          const nextMeta = MODEL_PIPELINE.find(m => m.id === nextModel);
          console.log(
            `[RFQ Analysis 容錯轉移] 由於 ${currentModel} 暫時無法使用 (${errStatus || '503/負載過高'})，正在無縫切換至備用模型: ${nextModel} (${nextMeta?.name})...`
          );
          // Small pause before retrying with fallback model
          await new Promise(resolve => setTimeout(resolve, 400));
        }
      }
    }

    if (!successfulResponse || !successfulResponse.text) {
      const failureDetails = fallbackHistory
        .map(f => `${f.model}: ${f.error.slice(0, 120)}`)
        .join(' | ');
      throw new Error(
        `主要模型與備用模型皆暫時無法服務 (503 / High Demand)。嘗試紀錄: [${failureDetails}]。請稍候數秒後重試。`
      );
    }

    const responseText = successfulResponse.text;
    const parsedData = JSON.parse(responseText);

    const modelNameDisplay =
      MODEL_PIPELINE.find(m => m.id === successfulModel)?.name || successfulModel;

    res.json({
      success: true,
      data: parsedData,
      analyzedAt: new Date().toISOString(),
      fileName: fileName || '工程圖面',
      modelUsed: successfulModel,
      modelDisplayName: modelNameDisplay,
      isBackupUsed: fallbackTriggered,
      fallbackMessage: fallbackTriggered
        ? `主要模型暫時負載過高 (503 UNAVAILABLE)，系統已自動容錯切換至備用模型【${modelNameDisplay}】順利完成分析！`
        : null,
      fallbackHistory,
    });
  } catch (error: any) {
    console.error('RFQ Analysis Error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || '分析工程圖時發生錯誤，請稍後再試。',
    });
  }
});

// Setup Vite middleware for development or serve static files for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RFQ Analysis Tool Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
