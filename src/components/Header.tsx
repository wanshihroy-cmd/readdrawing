import React from 'react';
import { 
  Cable, 
  RotateCw, 
  Trash2, 
  Download, 
  Copy, 
  Printer, 
  FileSpreadsheet, 
  Columns, 
  Maximize2, 
  Sparkles,
  HelpCircle,
  Upload
} from 'lucide-react';
import { RfqAnalysisResult } from '../types/rfq';
import { exportToExcelCsv, copyTableToClipboard, exportToJson } from '../utils/exportUtils';

interface HeaderProps {
  data: RfqAnalysisResult | null;
  hasFile: boolean;
  isLoading: boolean;
  viewMode: 'split' | 'table-only' | 'drawing-only';
  setViewMode: (mode: 'split' | 'table-only' | 'drawing-only') => void;
  onReanalyze: () => void;
  onClear: () => void;
  onOpenUpload: () => void;
  onOpenPrintModal: () => void;
  missingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  data,
  hasFile,
  isLoading,
  viewMode,
  setViewMode,
  onReanalyze,
  onClear,
  onOpenUpload,
  onOpenPrintModal,
  missingCount,
}) => {
  const [copySuccess, setCopySuccess] = React.useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = React.useState(false);

  const handleCopy = async () => {
    if (!data) return;
    const ok = await copyTableToClipboard(data.items);
    if (ok) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleExportCsv = () => {
    if (!data) return;
    exportToExcelCsv(data);
    setExportDropdownOpen(false);
  };

  const handleExportJson = () => {
    if (!data) return;
    exportToJson(data);
    setExportDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & System Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
              <Cable className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">
                  線材加工 RFQ 分析工具
                </span>
                {data?.isBackupUsed ? (
                  <span 
                    className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs"
                    title={`主要模型遇 503 高負載，已自動容錯切換至備用模型完成：${data.modelDisplayName || data.modelUsed}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 animate-ping"></span>
                    ⚡ 備用模型生效中: {data.modelDisplayName?.split(' ')[1] || '3.1 Flash Lite'}
                  </span>
                ) : (
                  <span 
                    className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    title="主要模型: Gemini 3.8 Flash (具備 503 自動備用容錯轉移機制)"
                  >
                    <Sparkles className="w-3 h-3 mr-1 text-cyan-400" />
                    Gemini 3.8 Flash (含備用容錯)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Wire Harness &amp; Cable Assembly RFQ Spec Extraction System
              </p>
            </div>
          </div>

          {/* Missing Specs Alert Badge (If any) */}
          {data && missingCount > 0 && (
            <div className="hidden lg:flex items-center px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium animate-pulse">
              <HelpCircle className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              偵測到 {missingCount} 處「未提供」欄位（需與客戶確認）
            </div>
          )}

          {/* Action Buttons: 重新分析, 清除, 匯出 */}
          <div className="flex items-center space-x-2">

            {/* View Mode Switcher */}
            {hasFile && data && (
              <div className="hidden md:flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700 mr-1 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('split')}
                  className={`px-2.5 py-1.5 rounded-md flex items-center space-x-1 transition-all ${
                    viewMode === 'split' 
                      ? 'bg-blue-600 text-white font-medium shadow' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="圖面與表格左右對照"
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>對照模式</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table-only')}
                  className={`px-2.5 py-1.5 rounded-md flex items-center space-x-1 transition-all ${
                    viewMode === 'table-only' 
                      ? 'bg-blue-600 text-white font-medium shadow' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="展開寬螢幕表格"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>純表格</span>
                </button>
              </div>
            )}

            {/* Upload Drawing Button */}
            <button
              type="button"
              onClick={onOpenUpload}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="上傳新的工程圖 (PDF/PNG/JPG)"
            >
              <Upload className="w-4 h-4 mr-1.5 text-cyan-400" />
              <span className="hidden sm:inline">上傳圖面</span>
              <span className="sm:hidden">上傳</span>
            </button>

            {/* Re-analyze Button (重新分析) */}
            <button
              type="button"
              onClick={onReanalyze}
              disabled={!hasFile || isLoading}
              className={`inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium shadow transition ${
                !hasFile || isLoading
                  ? 'bg-slate-800 text-slate-500 border border-slate-800 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
              title="使用 Gemini 重新分析當前圖面"
            >
              <RotateCw className={`w-4 h-4 mr-1.5 ${isLoading ? 'animate-spin text-cyan-300' : ''}`} />
              <span>{isLoading ? '分析中...' : '重新分析'}</span>
            </button>

            {/* Clear Button (清除) */}
            <button
              type="button"
              onClick={onClear}
              disabled={!hasFile && !data}
              className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
                !hasFile && !data
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20'
              }`}
              title="清除所有圖面與分析結果"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              <span>清除</span>
            </button>

            {/* Export Dropdown / Button (匯出) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                disabled={!data || data.items.length === 0}
                className={`inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
                  !data || data.items.length === 0
                    ? 'bg-slate-800 text-slate-500 border border-slate-800 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 shadow'
                }`}
              >
                <Download className="w-4 h-4 mr-1.5" />
                <span>匯出</span>
              </button>

              {/* Dropdown Menu */}
              {exportDropdownOpen && data && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 text-xs sm:text-sm"
                  onMouseLeave={() => setExportDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-700/60 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                    匯出 RFQ 報價資料
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="w-full text-left px-3 py-2.5 hover:bg-slate-700/70 text-slate-200 flex items-center space-x-2.5 transition"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-medium">匯出 Excel (CSV)</div>
                      <div className="text-[11px] text-slate-400">含 BOM、8大欄位與未提供清單</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onOpenPrintModal();
                      setExportDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-slate-700/70 text-slate-200 flex items-center space-x-2.5 transition"
                  >
                    <Printer className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="font-medium">列印 / 存為 PDF 規格單</div>
                      <div className="text-[11px] text-slate-400">企業級標準 RFQ 規格表與報價單</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleCopy();
                      setExportDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-slate-700/70 text-slate-200 flex items-center space-x-2.5 transition"
                  >
                    <Copy className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="font-medium">複製表格 (貼上 Excel / ERP)</div>
                      <div className="text-[11px] text-slate-400">Tab 分隔文字直接貼至表格</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="w-full text-left px-3 py-2.5 hover:bg-slate-700/70 text-slate-200 flex items-center space-x-2.5 transition"
                  >
                    <Download className="w-4 h-4 text-indigo-400" />
                    <div>
                      <div className="font-medium">下載 JSON 數據檔案</div>
                      <div className="text-[11px] text-slate-400">供 ERP/MES 系統介接</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Copy Toast */}
      {copySuccess && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center space-x-2 text-sm font-medium animate-bounce">
          <Copy className="w-4 h-4" />
          <span>已成功複製表格文字至剪貼簿！可直接貼上 Excel 或 ERP</span>
        </div>
      )}
    </header>
  );
};
