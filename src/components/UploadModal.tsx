import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Sparkles, 
  FileCheck, 
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { SAMPLE_DRAWINGS } from '../data/sampleDrawings';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileUpload: (
    fileBase64: string,
    mimeType: string,
    fileName: string,
    customPrompt?: string,
    preferredModel?: string
  ) => void;
  onSelectSample: (sampleId: string) => void;
  isLoading: boolean;
  currentModelPreference?: string;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onFileUpload,
  onSelectSample,
  isLoading,
  currentModelPreference,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>(currentModelPreference || 'auto');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setErrorMessage(null);
    const validTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'image/svg+xml'
    ];

    if (!validTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('請上傳 PDF 文件或工程圖圖片檔案 (PNG, JPG, SVG, WEBP)。');
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      setErrorMessage('檔案大小超過 30MB 限制，請縮減檔案後再試。');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFileBase64(result);
    };
    reader.onerror = () => {
      setErrorMessage('讀取檔案失敗，請重新選取。');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleStartAnalysis = () => {
    if (!selectedFile || !fileBase64) {
      setErrorMessage('請先選擇或拖放工程圖檔案。');
      return;
    }

    const mime = selectedFile.type || (selectedFile.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/png');
    onFileUpload(fileBase64, mime, selectedFile.name, customPrompt.trim(), selectedModel);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Upload className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">上傳工程圖面分析 RFQ</h3>
              <p className="text-xs text-slate-400">支援線材加工客戶 PDF 圖面或高解析度圖片</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-blue-500 bg-blue-50/70 scale-[0.99]'
                : selectedFile
                ? 'border-emerald-400 bg-emerald-50/30'
                : 'border-slate-300 hover:border-blue-400 bg-slate-50/60 hover:bg-slate-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
              className="hidden"
              onChange={handleChange}
            />

            {selectedFile ? (
              <div className="flex items-center justify-center space-x-3 text-left">
                <div className="w-12 h-12 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    大小: {formatFileSize(selectedFile.size)} | 格式: {selectedFile.type || 'PDF'}
                  </p>
                  <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                    ✓ 檔案已就緒，點擊下方「開始分析」或點擊此處更換
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  拖曳 PDF 或圖片檔案至此，或點擊瀏覽選取
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  支援格式：PDF、PNG、JPG、JPEG、SVG、WEBP (單檔最大 30MB)
                </p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Optional Sales Focus / Custom Prompt */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>業務補充指示或關注重點 (選填)</span>
              <span className="text-slate-400 font-normal">例如：特別關注接頭公母座或長度公差</span>
            </label>
            <input
              type="text"
              placeholder="例如：請特別注意圖面附註第3條的鍍錫長度與 UL 規範..."
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Model Selection & Automatic Fallback Policy */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
                AI 模型配置與自動容錯策略
              </label>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ✓ 503 自動容錯已啟用
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2.5">
              當主要模型遇尖峰時段流量過載 (503 UNAVAILABLE / High Demand) 時，系統將自動無縫切換至備用模型，分析不中斷。
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedModel('auto')}
                className={`p-2 rounded-lg text-left border transition text-xs ${
                  selectedModel === 'auto'
                    ? 'border-blue-500 bg-blue-50/60 text-blue-900 font-semibold ring-1 ring-blue-400'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>自動容錯 (推薦)</span>
                  {selectedModel === 'auto' && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                </div>
                <div className="text-[10px] text-slate-400 font-normal mt-0.5">3.8 Flash ➔ 備用自動切換</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
                className={`p-2 rounded-lg text-left border transition text-xs ${
                  selectedModel === 'gemini-3.1-flash-lite'
                    ? 'border-indigo-500 bg-indigo-50/60 text-indigo-900 font-semibold ring-1 ring-indigo-400'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>備用模型 1</span>
                  {selectedModel === 'gemini-3.1-flash-lite' && <span className="w-2 h-2 rounded-full bg-indigo-600"></span>}
                </div>
                <div className="text-[10px] text-slate-400 font-normal mt-0.5">Gemini 3.1 Flash Lite</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedModel('gemini-flash-latest')}
                className={`p-2 rounded-lg text-left border transition text-xs ${
                  selectedModel === 'gemini-flash-latest'
                    ? 'border-indigo-500 bg-indigo-50/60 text-indigo-900 font-semibold ring-1 ring-indigo-400'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>備用模型 2</span>
                  {selectedModel === 'gemini-flash-latest' && <span className="w-2 h-2 rounded-full bg-indigo-600"></span>}
                </div>
                <div className="text-[10px] text-slate-400 font-normal mt-0.5">Gemini Flash Latest</div>
              </button>
            </div>
          </div>

          {/* Quick Sample Selector in Modal */}
          <div className="pt-3 border-t border-slate-200">
            <div className="text-xs font-bold text-slate-600 mb-2 flex items-center">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 mr-1" />
              沒有現成工程圖？點選下方內建線材加工圖面立即體驗：
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_DRAWINGS.map(sample => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => {
                    onSelectSample(sample.id);
                    onClose();
                  }}
                  className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-blue-50/30 text-left transition group"
                >
                  <div className="font-semibold text-xs text-slate-800 group-hover:text-blue-600 truncate">
                    {sample.name.split('：')[1] || sample.name}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                    {sample.subtitle}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 transition"
          >
            取消
          </button>

          <button
            type="button"
            onClick={handleStartAnalysis}
            disabled={!selectedFile || isLoading}
            className={`px-5 py-2 rounded-lg text-xs font-semibold shadow-md flex items-center space-x-1.5 transition ${
              !selectedFile || isLoading
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Gemini 智能解析中...' : '開始 AI 分析圖面'}</span>
            {!isLoading && <ArrowRight className="w-3.5 h-3.5 ml-1" />}
          </button>
        </div>
      </div>
    </div>
  );
};
