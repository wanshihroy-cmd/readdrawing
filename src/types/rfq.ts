export interface RfqItem {
  id: string;
  connector: string;             // Connector 連接器
  terminal: string;              // Terminal 端子
  wire: string;                  // Wire 線材規格
  wireGauge: string;             // Wire Gauge 線規
  wireLength: string;            // Wire Length 線長
  quantity: string;              // Quantity 數量
  processingRequirement: string; // Processing Requirement 加工要求
  specialRequirement: string;    // Special Requirement 特殊要求
  wireColor?: string;            // 線色 (輔助)
  pinout?: string;               // 接腳定義 (輔助)
  notes?: string;                // 圖面註記 (輔助)
}

export interface DrawingInfo {
  drawingNumber: string;         // 圖號
  partNumber?: string;           // 客戶料號
  revision: string;              // 版本
  customerName: string;          // 客戶名稱
  productTitle: string;          // 線束品名
  totalQuantity: string;         // 批量需求
  overallLength: string;         // 總長度與公差
  drawingDate?: string;          // 圖面日期
}

export interface RfqAnalysisResult {
  drawingInfo: DrawingInfo;
  items: RfqItem[];
  overallProcessingRequirement: string;
  overallSpecialRequirement: string;
  clarificationChecklist: string[];
  analysisSummary?: string;
  analyzedAt?: string;
  fileName?: string;
  modelUsed?: string;
  modelDisplayName?: string;
  isBackupUsed?: boolean;
  fallbackMessage?: string | null;
  fallbackHistory?: { model: string; error: string }[];
}

export interface SampleDrawing {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  dataUrl: string;
  mimeType: string;
  fileName: string;
  defaultData: RfqAnalysisResult;
}
