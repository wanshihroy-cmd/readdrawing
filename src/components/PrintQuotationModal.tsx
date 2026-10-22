import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Copy, 
  Download, 
  Check, 
  FileSpreadsheet, 
  Cable,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { RfqAnalysisResult } from '../types/rfq';
import { exportToExcelCsv } from '../utils/exportUtils';

interface PrintQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: RfqAnalysisResult | null;
}

export const PrintQuotationModal: React.FC<PrintQuotationModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    if (!data) return;
    let summaryText = `【線材加工 RFQ 報價規格分析單】\n`;
    summaryText += `圖面編號: ${data.drawingInfo.drawingNumber}\n`;
    summaryText += `客戶名稱: ${data.drawingInfo.customerName}\n`;
    summaryText += `品名描述: ${data.drawingInfo.productTitle}\n`;
    summaryText += `圖面版本: ${data.drawingInfo.revision}\n`;
    summaryText += `總長度公差: ${data.drawingInfo.overallLength}\n`;
    summaryText += `批量需求: ${data.drawingInfo.totalQuantity}\n\n`;
    summaryText += `【規格明細表】\n`;

    data.items.forEach((it, idx) => {
      summaryText += `項目 ${idx + 1}:\n`;
      summaryText += `  Connector (連接器): ${it.connector}\n`;
      summaryText += `  Terminal (端子): ${it.terminal}\n`;
      summaryText += `  Wire (線材規格): ${it.wire}\n`;
      summaryText += `  Wire Gauge (線規): ${it.wireGauge}\n`;
      summaryText += `  Wire Length (線長): ${it.wireLength}\n`;
      summaryText += `  Quantity (用量): ${it.quantity}\n`;
      summaryText += `  Processing (加工要求): ${it.processingRequirement}\n`;
      summaryText += `  Special (特殊要求): ${it.specialRequirement}\n`;
      summaryText += `--------------------------------------\n`;
    });

    if (data.clarificationChecklist && data.clarificationChecklist.length > 0) {
      summaryText += `\n【待與客戶確認清單 (標記為未提供)】:\n`;
      data.clarificationChecklist.forEach((c, i) => {
        summaryText += `${i + 1}. ${c}\n`;
      });
    }

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isMissing = (val: string | undefined) => !val || val === '未提供' || val.includes('未提供');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white border border-slate-300 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[95vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden during actual print) */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-2">
            <Printer className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm">RFQ 規格書與報價核算表預覽</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已複製' : '複製文字'}</span>
            </button>
            <button
              type="button"
              onClick={() => exportToExcelCsv(data)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white transition flex items-center space-x-1"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>匯出 Excel</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow transition flex items-center space-x-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>列印 / 存為 PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div 
          ref={printAreaRef}
          className="p-8 overflow-y-auto bg-white text-slate-900 space-y-6 font-sans print:p-0 print:overflow-visible"
        >
          {/* Company & Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <Cable className="w-6 h-6 text-blue-700" />
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  線材加工 RFQ 規格分析與報價核算單
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                WIRE HARNESS &amp; CABLE ASSEMBLY QUOTATION SPECIFICATION SHEET
              </p>
            </div>
            <div className="text-right text-xs text-slate-600">
              <div>報價單編號: <span className="font-mono font-bold text-slate-900">RFQ-{new Date().toISOString().slice(0, 10).replace(/-/g, '')}-01</span></div>
              <div>產出日期: <span className="font-mono">{new Date().toLocaleDateString('zh-TW')}</span></div>
              <div className="text-[11px] text-slate-400">系統分析版本: Gemini 3.8 Flash</div>
            </div>
          </div>

          {/* Title Block Grid */}
          <div className="bg-slate-50 border border-slate-300 rounded-lg p-3.5 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-slate-500 block">圖面編號 (DWG NO.):</span>
              <span className="font-bold font-mono text-slate-900">{data.drawingInfo.drawingNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 block">客戶名稱 (Customer):</span>
              <span className="font-bold text-slate-900">{data.drawingInfo.customerName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">線束品名 (Product Title):</span>
              <span className="font-bold text-slate-900">{data.drawingInfo.productTitle}</span>
            </div>
            <div>
              <span className="text-slate-500 block">版本 (Revision):</span>
              <span className="font-bold font-mono text-slate-900">{data.drawingInfo.revision}</span>
            </div>
            <div>
              <span className="text-slate-500 block">總長度及公差:</span>
              <span className="font-semibold font-mono text-slate-900">{data.drawingInfo.overallLength}</span>
            </div>
            <div>
              <span className="text-slate-500 block">訂單批量需求:</span>
              <span className="font-semibold text-slate-900">{data.drawingInfo.totalQuantity}</span>
            </div>
            <div>
              <span className="text-slate-500 block">客戶料號 (Part No.):</span>
              <span className="font-mono text-slate-900">{data.drawingInfo.partNumber || '未提供'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">繪圖日期 (Date):</span>
              <span className="font-mono text-slate-900">{data.drawingInfo.drawingDate || '未提供'}</span>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              一、線材規格與加工明細表 (8大核心項目)
            </h3>
            <table className="w-full text-left border-collapse text-xs border border-slate-300">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-[11px] font-bold text-slate-700">
                  <th className="p-2 border-r border-slate-300 w-8 text-center">#</th>
                  <th className="p-2 border-r border-slate-300">Connector (連接器)</th>
                  <th className="p-2 border-r border-slate-300">Terminal (端子)</th>
                  <th className="p-2 border-r border-slate-300">Wire (線材規格)</th>
                  <th className="p-2 border-r border-slate-300">Wire Gauge (線規)</th>
                  <th className="p-2 border-r border-slate-300">Wire Length (線長)</th>
                  <th className="p-2 border-r border-slate-300">Quantity (用量)</th>
                  <th className="p-2 border-r border-slate-300">Processing Requirement (加工要求)</th>
                  <th className="p-2">Special Requirement (特殊要求)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {data.items.map((it, idx) => (
                  <tr key={idx} className="align-top">
                    <td className="p-2 border-r border-slate-300 text-center font-mono text-slate-500">
                      {it.id || idx + 1}
                    </td>
                    <td className="p-2 border-r border-slate-300">
                      {isMissing(it.connector) ? <span className="text-amber-700 font-bold bg-amber-50 px-1 rounded">未提供</span> : it.connector}
                    </td>
                    <td className="p-2 border-r border-slate-300">
                      {isMissing(it.terminal) ? <span className="text-amber-700 font-bold bg-amber-50 px-1 rounded">未提供</span> : it.terminal}
                    </td>
                    <td className="p-2 border-r border-slate-300">
                      {isMissing(it.wire) ? <span className="text-amber-700 font-bold bg-amber-50 px-1 rounded">未提供</span> : it.wire}
                    </td>
                    <td className="p-2 border-r border-slate-300 font-mono">
                      {isMissing(it.wireGauge) ? <span className="text-amber-700 font-bold bg-amber-50 px-1 rounded">未提供</span> : it.wireGauge}
                    </td>
                    <td className="p-2 border-r border-slate-300 font-mono">
                      {isMissing(it.wireLength) ? <span className="text-amber-700 font-bold bg-amber-50 px-1 rounded">未提供</span> : it.wireLength}
                    </td>
                    <td className="p-2 border-r border-slate-300">
                      {isMissing(it.quantity) ? <span className="text-amber-700 font-bold bg-amber-50 px-1 rounded">未提供</span> : it.quantity}
                    </td>
                    <td className="p-2 border-r border-slate-300 text-[11px] leading-relaxed">
                      {isMissing(it.processingRequirement) ? <span className="text-amber-700 font-bold bg-amber-50 px-1 rounded">未提供</span> : it.processingRequirement}
                    </td>
                    <td className="p-2 text-[11px] leading-relaxed">
                      {isMissing(it.specialRequirement) ? <span className="text-amber-700 font-bold bg-amber-50 px-1 rounded">未提供</span> : it.specialRequirement}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 2: Overall notes */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="border border-slate-300 rounded-lg p-3 bg-slate-50/50">
              <div className="font-bold text-slate-800 mb-1">二、綜合加工工藝要求 (Processing Notes)</div>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                {data.overallProcessingRequirement || '未提供'}
              </p>
            </div>
            <div className="border border-slate-300 rounded-lg p-3 bg-slate-50/50">
              <div className="font-bold text-slate-800 mb-1">三、綜合特殊規範與測試 (Special / Test Standards)</div>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                {data.overallSpecialRequirement || '未提供'}
              </p>
            </div>
          </div>

          {/* Section 3: Clarification Notice (Missing items to verify with customer) */}
          {data.clarificationChecklist && data.clarificationChecklist.length > 0 && (
            <div className="border-2 border-amber-300 rounded-lg p-3.5 bg-amber-50/50 text-xs">
              <div className="font-bold text-amber-900 mb-1.5 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1 text-amber-600" />
                四、業務向客戶待確認事項清單 (圖面標記「未提供」之關鍵規格)
              </div>
              <div className="space-y-1">
                {data.clarificationChecklist.map((c, i) => (
                  <div key={i} className="text-slate-800 flex items-start text-[11px]">
                    <span className="font-bold text-amber-800 mr-1.5">{i + 1}.</span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Signature Block for Sales & Engineering */}
          <div className="pt-6 border-t border-slate-300 grid grid-cols-3 gap-6 text-xs text-slate-600 text-center">
            <div>
              <div className="h-10 border-b border-slate-400"></div>
              <span className="mt-1 block">業務承辦人 (Sales Rep)</span>
            </div>
            <div>
              <div className="h-10 border-b border-slate-400"></div>
              <span className="mt-1 block">工程審核 (Engineering Review)</span>
            </div>
            <div>
              <div className="h-10 border-b border-slate-400"></div>
              <span className="mt-1 block">主管核准 (Approval)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
