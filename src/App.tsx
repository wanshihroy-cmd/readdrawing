import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DrawingViewer } from './components/DrawingViewer';
import { DrawingInfoCard } from './components/DrawingInfoCard';
import { RfqTable } from './components/RfqTable';
import { OverallNotesAndChecklist } from './components/OverallNotesAndChecklist';
import { UploadModal } from './components/UploadModal';
import { PrintQuotationModal } from './components/PrintQuotationModal';
import { RfqAnalysisResult, RfqItem, DrawingInfo } from './types/rfq';
import { SAMPLE_DRAWINGS } from './data/sampleDrawings';
import { 
  Sparkles, 
  AlertCircle, 
  HelpCircle, 
  Upload, 
  RotateCw, 
  CheckCircle2,
  FileText,
  Boxes,
  Cable
} from 'lucide-react';

export default function App() {
  // File & View States
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'table-only' | 'drawing-only'>('split');

  // Analysis Result State
  const [data, setData] = useState<RfqAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fallbackAlert, setFallbackAlert] = useState<string | null>(null);
  const [preferredModel, setPreferredModel] = useState<string>('auto');

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // Auto-load Sample 1 on initial load so the sales rep immediately has an active dashboard
  useEffect(() => {
    const defaultSample = SAMPLE_DRAWINGS[0];
    setFileDataUrl(defaultSample.dataUrl);
    setFileName(defaultSample.fileName);
    setMimeType(defaultSample.mimeType);
    setData(defaultSample.defaultData);
  }, []);

  // Calculate missing counts across 8 core fields
  const missingCount = React.useMemo(() => {
    if (!data) return 0;
    let count = 0;
    const isMiss = (s?: string) => !s || s === '未提供' || s.includes('未提供');

    data.items.forEach(it => {
      if (isMiss(it.connector)) count++;
      if (isMiss(it.terminal)) count++;
      if (isMiss(it.wire)) count++;
      if (isMiss(it.wireGauge)) count++;
      if (isMiss(it.wireLength)) count++;
      if (isMiss(it.quantity)) count++;
      if (isMiss(it.processingRequirement)) count++;
      if (isMiss(it.specialRequirement)) count++;
    });

    if (isMiss(data.drawingInfo.drawingNumber)) count++;
    if (isMiss(data.drawingInfo.customerName)) count++;
    if (isMiss(data.drawingInfo.totalQuantity)) count++;
    if (isMiss(data.drawingInfo.overallLength)) count++;

    return count;
  }, [data]);

  // Handler to load one of the built-in sample drawings
  const handleSelectSample = (sampleId: string) => {
    const sample = SAMPLE_DRAWINGS.find(s => s.id === sampleId);
    if (!sample) return;
    setFileDataUrl(sample.dataUrl);
    setFileName(sample.fileName);
    setMimeType(sample.mimeType);
    setData(sample.defaultData);
    setErrorMessage(null);
    setFallbackAlert(null);
  };

  // Handler for uploading a new file and triggering AI analysis
  const handleFileUpload = async (
    b64: string,
    mime: string,
    name: string,
    customPrompt?: string,
    modelPreference?: string
  ) => {
    setFileDataUrl(b64);
    setMimeType(mime);
    setFileName(name);
    if (modelPreference) {
      setPreferredModel(modelPreference);
    }
    setIsUploadModalOpen(false);
    setErrorMessage(null);
    setFallbackAlert(null);

    await triggerAnalysis(b64, mime, name, customPrompt, modelPreference || preferredModel);
  };

  
// Call Gemini API directly from the client side (Frontend SDK)
  const triggerAnalysis = async (
    b64: string,
    mime: string,
    name: string,
    customPrompt?: string,
    modelToRequest?: string
  ) => {
    setIsLoading(true);
    setErrorMessage(null);
    setFallbackAlert(null);
    setLoadingStep('正在透過前端直連 Gemini 模型解析工程圖面結構...');

    try {
      // 確保從環境變數或安全方式取得 API Key (若在 Vite 中可使用 import.meta.env.VITE_GEMINI_API_KEY)
      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (window as any).GEMINI_API_KEY || '';
      
      if (!apiKey) {
        throw new Error('找不到 Gemini API Key，請確認是否已在環境變數 (VITE_GEMINI_API_KEY) 中設定。');
      }

      // 動態引入 Google GenAI SDK
      const { GoogleGenAI, Type, Schema } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });

      // 決定要使用的模型 (預設使用 gemini-2.5-flash 或指定模型)
      const actualModel = modelToRequest && modelToRequest !== 'auto' ? modelToRequest : 'gemini-2.5-flash';
      
      setLoadingStep(`正在調用 ${actualModel} 進行圖面特徵擷取...`);

      // 準備上傳的圖片/檔案資料
      const imagePart = {
        inlineData: {
          data: b64,
          mimeType: mime,
        },
      };

      const promptText = customPrompt || '請仔細分析此張工程圖面，擷取所有 Connector、Terminal、線規、線長、數量與加工規格，並嚴格遵循未提及即填「未提供」的原則。';

      // 呼叫 Gemini 模型
      const response = await ai.models.generateContent({
        model: actualModel,
        contents: [imagePart, promptText],
        config: {
          responseMimeType: 'application/json',
          // 如果您的專案有定義回應 Schema，也可以在此處加入 responseSchema
        }
      });

      const responseText = response.text();
      if (!responseText) {
        throw new Error('模型未回傳任何分析結果資料。');
      }

      const parsedData = JSON.parse(responseText);
      setData(parsedData);

    } catch (err: any) {
      console.error('Client-side analysis failed:', err);
      setErrorMessage(err.message || '分析發生錯誤，請檢查圖面檔案或 API Key 是否正確。');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };
  

  // Re-analyze current drawing (重新分析)
  const handleReanalyze = () => {
    if (!fileDataUrl || !mimeType) {
      setIsUploadModalOpen(true);
      return;
    }
    triggerAnalysis(fileDataUrl, mimeType, fileName || '工程圖面');
  };

  // Clear current data and drawing (清除)
  const handleClear = () => {
    if (confirm('確定要清除當前圖面與所有分析資料嗎？')) {
      setFileDataUrl(null);
      setFileName(null);
      setMimeType(null);
      setData(null);
      setErrorMessage(null);
    }
  };

  // Update Drawing Info
  const handleUpdateDrawingInfo = (updatedInfo: DrawingInfo) => {
    if (!data) return;
    setData({
      ...data,
      drawingInfo: updatedInfo,
    });
  };

  // Update items in RFQ table
  const handleUpdateItems = (updatedItems: RfqItem[]) => {
    if (!data) return;
    setData({
      ...data,
      items: updatedItems,
    });
  };

  // Update overall requirements and checklist
  const handleUpdateOverall = (
    processing: string,
    special: string,
    checklist: string[]
  ) => {
    if (!data) return;
    setData({
      ...data,
      overallProcessingRequirement: processing,
      overallSpecialRequirement: special,
      clarificationChecklist: checklist,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans">
      {/* Global Enterprise Header */}
      <Header
        data={data}
        hasFile={!!fileDataUrl}
        isLoading={isLoading}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onReanalyze={handleReanalyze}
        onClear={handleClear}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        missingCount={missingCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 flex flex-col">
        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start space-x-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-rose-900">分析發生問題</h4>
              <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-800 text-xs font-semibold"
            >
              關閉
            </button>
          </div>
        )}

        {/* Backup Model Failover Alert Banner */}
        {fallbackAlert && (
          <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-sm flex items-start justify-between shadow-xs animate-in fade-in">
            <div className="flex items-start space-x-3">
              <span className="px-2 py-0.5 rounded bg-amber-600 text-white font-bold text-[11px] mt-0.5 shrink-0">
                ⚡ 備用模型容錯
              </span>
              <div>
                <h4 className="font-bold text-amber-950">
                  主要模型高負載，已切換至備用模型
                </h4>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                  {fallbackAlert}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFallbackAlert(null)}
              className="text-amber-700 hover:text-amber-950 text-xs font-semibold px-2 py-1 rounded hover:bg-amber-200/50 transition shrink-0 ml-3"
            >
              關閉
            </button>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="mb-5 p-5 rounded-xl bg-blue-900 text-white shadow-xl flex items-center justify-between animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-blue-700/80 flex items-center justify-center">
                <RotateCw className="w-5 h-5 text-cyan-300 animate-spin" />
              </div>
              <div>
                <h4 className="text-sm font-bold flex items-center">
                  <Sparkles className="w-4 h-4 text-cyan-300 mr-1.5" />
                  Gemini 3.8 Flash 工程圖面分析進行中...
                </h4>
                <p className="text-xs text-blue-200 mt-0.5">{loadingStep}</p>
              </div>
            </div>
            <span className="text-xs text-blue-300 hidden sm:inline font-mono">
              嚴格執行「未提供」防呆審查中
            </span>
          </div>
        )}

        {/* Workspace Layout */}
        {!fileDataUrl && !data ? (
          /* Empty State - Prompt user to upload or pick sample */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 mb-4">
              <Cable className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              線材加工 RFQ 工程圖規格分析系統
            </h2>
            <p className="text-sm text-slate-500 max-w-lg mt-2 leading-relaxed">
              專為線束加工廠業務團隊打造。上傳客戶 PDF 工程圖，AI 自動擷取 Connector、Terminal、線材規格、線規、線長公差與特殊加工要求。
              圖面未提及之項目一律標記為「未提供」，確保報價精準。
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-600/30 transition flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>上傳客戶 PDF / 圖面檔案</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectSample('sample-1')}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm shadow transition flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>載入內建範例圖面測試</span>
              </button>
            </div>
          </div>
        ) : (
          /* Active Workspace */
          <div className="flex-1 flex flex-col space-y-4">
            
            {/* Split View vs Full Table View */}
            {viewMode === 'split' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* Left Pane: Blueprint / Drawing Viewer (5 Cols on LG) */}
                <div className="lg:col-span-5 sticky top-20 self-start">
                  <DrawingViewer
                    fileDataUrl={fileDataUrl}
                    fileName={fileName}
                    mimeType={mimeType}
                    onSelectSample={handleSelectSample}
                    onUploadClick={() => setIsUploadModalOpen(true)}
                  />
                </div>

                {/* Right Pane: Title block, Specs Table & Notes (7 Cols on LG) */}
                <div className="lg:col-span-7 flex flex-col">
                  {data && (
                    <>
                      {/* Drawing Title Block */}
                      <DrawingInfoCard
                        info={data.drawingInfo}
                        onUpdate={handleUpdateDrawingInfo}
                      />

                      {/* RFQ 8 Core Spec Table */}
                      <RfqTable
                        items={data.items}
                        onUpdateItems={handleUpdateItems}
                      />

                      {/* Processing & Special Notes + Clarification Checklist */}
                      <OverallNotesAndChecklist
                        processingRequirement={data.overallProcessingRequirement}
                        specialRequirement={data.overallSpecialRequirement}
                        clarificationChecklist={data.clarificationChecklist}
                        analysisSummary={data.analysisSummary}
                        onUpdate={handleUpdateOverall}
                      />
                    </>
                  )}
                </div>

              </div>
            ) : viewMode === 'table-only' ? (
              /* Expanded Table Only View */
              <div className="flex flex-col space-y-4">
                {data && (
                  <>
                    <DrawingInfoCard
                      info={data.drawingInfo}
                      onUpdate={handleUpdateDrawingInfo}
                    />

                    <RfqTable
                      items={data.items}
                      onUpdateItems={handleUpdateItems}
                    />

                    <OverallNotesAndChecklist
                      processingRequirement={data.overallProcessingRequirement}
                      specialRequirement={data.overallSpecialRequirement}
                      clarificationChecklist={data.clarificationChecklist}
                      analysisSummary={data.analysisSummary}
                      onUpdate={handleUpdateOverall}
                    />
                  </>
                )}
              </div>
            ) : (
              /* Drawing Only View */
              <div className="h-[80vh]">
                <DrawingViewer
                  fileDataUrl={fileDataUrl}
                  fileName={fileName}
                  mimeType={mimeType}
                  onSelectSample={handleSelectSample}
                  onUploadClick={() => setIsUploadModalOpen(true)}
                />
              </div>
            )}

          </div>
        )}
      </main>

      {/* Upload Drawing Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onFileUpload={handleFileUpload}
        onSelectSample={handleSelectSample}
        isLoading={isLoading}
        currentModelPreference={preferredModel}
      />

      {/* Print / Export RFQ Quotation Modal */}
      <PrintQuotationModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        data={data}
      />
    </div>
  );
}
