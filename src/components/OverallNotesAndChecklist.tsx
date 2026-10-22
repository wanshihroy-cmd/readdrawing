import React, { useState } from 'react';
import { 
  Wrench, 
  ShieldCheck, 
  HelpCircle, 
  Edit3, 
  Check, 
  MessageSquare, 
  CheckSquare, 
  Plus, 
  Trash2,
  Sparkles,
  ClipboardList
} from 'lucide-react';

interface OverallNotesProps {
  processingRequirement: string;
  specialRequirement: string;
  clarificationChecklist: string[];
  analysisSummary?: string;
  onUpdate: (
    processing: string,
    special: string,
    checklist: string[]
  ) => void;
}

export const OverallNotesAndChecklist: React.FC<OverallNotesProps> = ({
  processingRequirement,
  specialRequirement,
  clarificationChecklist,
  analysisSummary,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [procText, setProcText] = useState(processingRequirement);
  const [specText, setSpecText] = useState(specialRequirement);
  const [checklist, setChecklist] = useState<string[]>(clarificationChecklist || []);
  const [newChecklistItem, setNewChecklistItem] = useState('');

  // Sync with prop updates
  React.useEffect(() => {
    setProcText(processingRequirement);
    setSpecText(specialRequirement);
    setChecklist(clarificationChecklist || []);
  }, [processingRequirement, specialRequirement, clarificationChecklist]);

  const handleSave = () => {
    onUpdate(procText, specText, checklist);
    setIsEditing(false);
  };

  const handleAddChecklist = () => {
    if (!newChecklistItem.trim()) return;
    setChecklist([...checklist, newChecklistItem.trim()]);
    setNewChecklistItem('');
  };

  const handleRemoveChecklist = (index: number) => {
    setChecklist(checklist.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Box 1: Overall Processing Requirement */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-md bg-blue-50 text-blue-600">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">
                綜合加工工藝要求 (Processing Summary)
              </h4>
              <p className="text-[10px] text-slate-400">脫皮、壓接、鍍錫、熱縮套管、包裝方式</p>
            </div>
          </div>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-slate-400 hover:text-blue-600 transition"
              title="修改加工工藝說明"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {isEditing ? (
          <textarea
            rows={4}
            value={procText}
            onChange={e => setProcText(e.target.value)}
            className="w-full text-xs p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <div className="flex-1 text-xs text-slate-700 leading-relaxed bg-slate-50/60 p-2.5 rounded-lg border border-slate-100">
            {processingRequirement || '未提供'}
          </div>
        )}
      </div>

      {/* Box 2: Overall Special Requirement */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">
                綜合特殊規範與測試 (Special Requirements)
              </h4>
              <p className="text-[10px] text-slate-400">耐壓測試、導通阻抗、UL94阻燃、RoHS/REACH</p>
            </div>
          </div>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-slate-400 hover:text-indigo-600 transition"
              title="修改特殊要求說明"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {isEditing ? (
          <textarea
            rows={4}
            value={specText}
            onChange={e => setSpecText(e.target.value)}
            className="w-full text-xs p-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        ) : (
          <div className="flex-1 text-xs text-slate-700 leading-relaxed bg-slate-50/60 p-2.5 rounded-lg border border-slate-100">
            {specialRequirement || '未提供'}
          </div>
        )}
      </div>

      {/* Box 3: Sales Clarification Checklist (業務向客戶提問清單) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-md bg-amber-50 text-amber-600">
              <ClipboardList className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 flex items-center">
                業務向客戶確認清單 (RFQ Clarification)
                <span className="ml-1.5 px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] rounded-full font-bold">
                  {checklist.length} 條
                </span>
              </h4>
              <p className="text-[10px] text-slate-400">
                針對圖面標註「未提供」之項目提問，避免報價失誤
              </p>
            </div>
          </div>
          {isEditing && (
            <button
              type="button"
              onClick={handleSave}
              className="px-2.5 py-1 rounded bg-emerald-600 text-white text-[11px] font-semibold flex items-center shadow-xs"
            >
              <Check className="w-3 h-3 mr-1" />
              儲存
            </button>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {checklist.length === 0 ? (
              <div className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-lg">
                所有核心規格皆已齊全，無待確認項目。
              </div>
            ) : (
              checklist.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between p-2 rounded-lg bg-amber-50/50 border border-amber-200/60 text-xs text-slate-700 leading-snug group"
                >
                  <div className="flex items-start space-x-2">
                    <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-slate-800">{item}</span>
                  </div>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleRemoveChecklist(idx)}
                      className="text-slate-400 hover:text-rose-600 transition ml-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Add item in checklist */}
          {isEditing && (
            <div className="mt-3 flex items-center space-x-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                placeholder="新增業務確認問題..."
                value={newChecklistItem}
                onChange={e => setNewChecklistItem(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddChecklist()}
                className="flex-1 px-2.5 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddChecklist}
                className="px-2.5 py-1 rounded bg-slate-800 text-white text-xs hover:bg-slate-700 font-medium"
              >
                新增
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
