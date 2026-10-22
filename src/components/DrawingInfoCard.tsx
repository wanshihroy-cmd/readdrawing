import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  Hash, 
  GitBranch, 
  Ruler, 
  Boxes, 
  Calendar, 
  Edit3, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { DrawingInfo } from '../types/rfq';

interface DrawingInfoCardProps {
  info: DrawingInfo;
  onUpdate: (updatedInfo: DrawingInfo) => void;
}

export const DrawingInfoCard: React.FC<DrawingInfoCardProps> = ({ info, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<DrawingInfo>(info);

  // Sync state if info changes externally
  React.useEffect(() => {
    setForm(info);
  }, [info]);

  const handleSave = () => {
    onUpdate(form);
    setIsEditing(false);
  };

  const isMissing = (val: string | undefined) => !val || val === '未提供';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs mb-4">
      {/* Title bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              工程圖基本資訊 (Drawing Title Block)
            </h3>
            <p className="text-[11px] text-slate-500">
              從圖面標題欄及工程註記自動辨識之核心專案資料
            </p>
          </div>
        </div>

        <div>
          {isEditing ? (
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition"
            >
              <Check className="w-3.5 h-3.5 mr-1" />
              儲存資訊
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-2.5 py-1 rounded-md text-slate-600 hover:text-blue-600 hover:bg-blue-50 text-xs font-medium border border-slate-200 transition"
            >
              <Edit3 className="w-3.5 h-3.5 mr-1" />
              修改資料
            </button>
          )}
        </div>
      </div>

      {/* Grid of details */}
      {isEditing ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-500 font-medium mb-1">圖面編號 (DWG NO.)</label>
            <input
              type="text"
              value={form.drawingNumber}
              onChange={e => setForm({ ...form, drawingNumber: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-500 font-medium mb-1">客戶名稱 (Customer)</label>
            <input
              type="text"
              value={form.customerName}
              onChange={e => setForm({ ...form, customerName: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-500 font-medium mb-1">線束品名 (Product Title)</label>
            <input
              type="text"
              value={form.productTitle}
              onChange={e => setForm({ ...form, productTitle: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-500 font-medium mb-1">圖面版本 (Revision)</label>
            <input
              type="text"
              value={form.revision}
              onChange={e => setForm({ ...form, revision: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-500 font-medium mb-1">總長度及公差 (Total Length)</label>
            <input
              type="text"
              value={form.overallLength}
              onChange={e => setForm({ ...form, overallLength: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-500 font-medium mb-1">訂單批量需求 (Quantity)</label>
            <input
              type="text"
              value={form.totalQuantity}
              onChange={e => setForm({ ...form, totalQuantity: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-500 font-medium mb-1">客戶料號 (Part Number)</label>
            <input
              type="text"
              value={form.partNumber || ''}
              onChange={e => setForm({ ...form, partNumber: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="未提供"
            />
          </div>
          <div>
            <label className="block text-slate-500 font-medium mb-1">圖面日期 (Drawing Date)</label>
            <input
              type="text"
              value={form.drawingDate || ''}
              onChange={e => setForm({ ...form, drawingDate: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="未提供"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs">
          
          {/* DWG No */}
          <div className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
            <div className="flex items-center text-slate-400 mb-1">
              <Hash className="w-3.5 h-3.5 mr-1 text-blue-500" />
              <span>圖面編號 (DWG NO)</span>
            </div>
            <div className={`font-semibold font-mono text-xs ${
              isMissing(info.drawingNumber) ? 'text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded inline-block' : 'text-slate-900'
            }`}>
              {info.drawingNumber || '未提供'}
            </div>
          </div>

          {/* Customer */}
          <div className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
            <div className="flex items-center text-slate-400 mb-1">
              <Building2 className="w-3.5 h-3.5 mr-1 text-indigo-500" />
              <span>客戶名稱 (Customer)</span>
            </div>
            <div className={`font-semibold text-xs ${
              isMissing(info.customerName) ? 'text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded inline-block' : 'text-slate-900'
            }`}>
              {info.customerName || '未提供'}
            </div>
          </div>

          {/* Product Title */}
          <div className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
            <div className="flex items-center text-slate-400 mb-1">
              <FileText className="w-3.5 h-3.5 mr-1 text-cyan-500" />
              <span>線束品名 (Title)</span>
            </div>
            <div className={`font-semibold text-xs truncate ${
              isMissing(info.productTitle) ? 'text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded inline-block' : 'text-slate-900'
            }`} title={info.productTitle}>
              {info.productTitle || '未提供'}
            </div>
          </div>

          {/* Revision */}
          <div className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
            <div className="flex items-center text-slate-400 mb-1">
              <GitBranch className="w-3.5 h-3.5 mr-1 text-emerald-500" />
              <span>圖面版本 (Revision)</span>
            </div>
            <div className={`font-semibold font-mono text-xs ${
              isMissing(info.revision) ? 'text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded inline-block' : 'text-slate-900'
            }`}>
              {info.revision || '未提供'}
            </div>
          </div>

          {/* Overall Length */}
          <div className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
            <div className="flex items-center text-slate-400 mb-1">
              <Ruler className="w-3.5 h-3.5 mr-1 text-rose-500" />
              <span>總長度及公差</span>
            </div>
            <div className={`font-semibold font-mono text-xs ${
              isMissing(info.overallLength) ? 'text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded inline-block' : 'text-slate-900'
            }`}>
              {info.overallLength || '未提供'}
            </div>
          </div>

          {/* Total Quantity */}
          <div className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
            <div className="flex items-center text-slate-400 mb-1">
              <Boxes className="w-3.5 h-3.5 mr-1 text-purple-500" />
              <span>訂單批量需求</span>
            </div>
            <div className={`font-semibold text-xs ${
              isMissing(info.totalQuantity) ? 'text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded inline-block' : 'text-slate-900'
            }`}>
              {info.totalQuantity || '未提供'}
            </div>
          </div>

          {/* Part Number */}
          <div className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
            <div className="flex items-center text-slate-400 mb-1">
              <Hash className="w-3.5 h-3.5 mr-1 text-slate-400" />
              <span>客戶料號 (Part No.)</span>
            </div>
            <div className={`font-medium text-xs ${
              isMissing(info.partNumber) ? 'text-amber-600' : 'text-slate-700 font-mono'
            }`}>
              {info.partNumber || '未提供'}
            </div>
          </div>

          {/* Drawing Date */}
          <div className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
            <div className="flex items-center text-slate-400 mb-1">
              <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
              <span>繪圖日期 (Date)</span>
            </div>
            <div className={`font-medium text-xs ${
              isMissing(info.drawingDate) ? 'text-amber-600' : 'text-slate-700 font-mono'
            }`}>
              {info.drawingDate || '未提供'}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
