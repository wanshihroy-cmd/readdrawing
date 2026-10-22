import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Maximize2, 
  Minimize2, 
  FileText, 
  Upload, 
  FileCheck, 
  Download, 
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { SAMPLE_DRAWINGS } from '../data/sampleDrawings';

interface DrawingViewerProps {
  fileDataUrl: string | null;
  fileName: string | null;
  mimeType: string | null;
  onSelectSample: (sampleId: string) => void;
  onUploadClick: () => void;
}

export const DrawingViewer: React.FC<DrawingViewerProps> = ({
  fileDataUrl,
  fileName,
  mimeType,
  onSelectSample,
  onUploadClick,
}) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 300));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleResetZoom = () => {
    setZoom(100);
    setRotation(0);
  };
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const isPdf = mimeType === 'application/pdf' || (fileName && fileName.toLowerCase().endsWith('.pdf'));

  return (
    <div className={`flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm transition-all ${
      isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'h-full min-h-[500px]'
    }`}>
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-800/90 border-b border-slate-700/80 text-slate-300 text-xs">
        {/* Drawing Name & Status */}
        <div className="flex items-center space-x-2 truncate pr-2">
          <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="font-semibold text-slate-100 truncate">
            {fileName || '未載入圖面'}
          </span>
          {mimeType && (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-700 text-slate-300 font-mono uppercase">
              {isPdf ? 'PDF' : mimeType.includes('svg') ? 'SVG' : 'IMG'}
            </span>
          )}
        </div>

        {/* Viewer Tools */}
        {fileDataUrl && (
          <div className="flex items-center space-x-1 shrink-0">
            {!isPdf && (
              <>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoom <= 50}
                  className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition disabled:opacity-40"
                  title="縮小 (-25%)"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="px-2 py-1 rounded hover:bg-slate-700 text-slate-300 font-mono text-[11px] hover:text-white transition"
                  title="重設大小"
                >
                  {zoom}%
                </button>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoom >= 300}
                  className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition disabled:opacity-40"
                  title="放大 (+25%)"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleRotate}
                  className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  title="向右旋轉 90°"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition ml-1"
              title={isFullscreen ? '退出全螢幕' : '全螢幕檢視'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={onUploadClick}
              className="ml-2 px-2.5 py-1 rounded bg-blue-600/80 hover:bg-blue-600 text-white font-medium text-[11px] transition flex items-center space-x-1"
            >
              <Upload className="w-3 h-3" />
              <span>更換</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Drawing Area */}
      <div className="flex-1 bg-slate-950/80 relative overflow-auto flex items-center justify-center p-3 select-none">
        {fileDataUrl ? (
          isPdf ? (
            /* PDF Display */
            <div className="w-full h-full min-h-[460px] flex flex-col items-center justify-center">
              <object
                data={fileDataUrl}
                type="application/pdf"
                className="w-full h-full min-h-[460px] rounded border border-slate-800"
              >
                <div className="text-center p-6 text-slate-400">
                  <FileText className="w-12 h-12 mx-auto text-blue-400 mb-2" />
                  <p className="text-sm font-medium text-slate-200">PDF 工程圖已準備就緒</p>
                  <p className="text-xs text-slate-400 mt-1">若瀏覽器未直接內嵌顯示，您可以另開視窗查閱：</p>
                  <a
                    href={fileDataUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center px-3 py-1.5 mt-3 rounded bg-blue-600 text-white text-xs font-medium hover:bg-blue-500 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1" />
                    在新分頁開啟 PDF 圖面
                  </a>
                </div>
              </object>
            </div>
          ) : (
            /* Image / SVG Display with zoom & rotate */
            <div 
              className="transition-transform duration-150 ease-out origin-center flex items-center justify-center"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              }}
            >
              <img
                src={fileDataUrl}
                alt={fileName || '工程圖面'}
                className="max-w-full max-h-full object-contain rounded shadow-lg border border-slate-800"
              />
            </div>
          )
        ) : (
          /* Empty State - Prompt & Sample Loaders */
          <div className="w-full max-w-md mx-auto p-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 shadow-inner">
              <Upload className="w-8 h-8" />
            </div>

            <h3 className="text-base font-semibold text-slate-100">
              請上傳客戶 PDF 或工程圖面
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              支援線材加工工程圖 (PDF、PNG、JPG)，系統將精確辨識 Connector、Terminal、線規、線長、加工要求等規格。
            </p>

            <button
              type="button"
              onClick={onUploadClick}
              className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition inline-flex items-center space-x-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>點擊上傳圖面檔案</span>
            </button>

            {/* Quick Sample Selector */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 text-left">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center">
                  <Sparkles className="w-3 h-3 text-cyan-400 mr-1" />
                  或點擊載入內建範例圖面進行測試
                </span>
              </div>

              <div className="space-y-2">
                {SAMPLE_DRAWINGS.map(sample => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => onSelectSample(sample.id)}
                    className="w-full text-left p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-blue-500/50 transition group flex items-start space-x-2.5"
                  >
                    <div className="p-1.5 rounded bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition mt-0.5">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-blue-300 truncate">
                        {sample.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {sample.subtitle}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer bar with quick sample switch if file already loaded */}
      {fileDataUrl && (
        <div className="px-3 py-2 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">切換範例測試:</span>
            {SAMPLE_DRAWINGS.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectSample(s.id)}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              >
                {s.id === 'sample-1' ? '範例1(完整)' : s.id === 'sample-2' ? '範例2(雙端)' : '範例3(未提供示範)'}
              </button>
            ))}
          </div>
          <span className="text-slate-500 hidden sm:inline">雙擊表格單元格可直接修改 AI 數據</span>
        </div>
      )}
    </div>
  );
};
