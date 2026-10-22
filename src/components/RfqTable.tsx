import React, { useState } from 'react';
import { 
  RfqItem 
} from '../types/rfq';
import { 
  Edit2, 
  Trash2, 
  Plus, 
  Copy, 
  Check, 
  X, 
  HelpCircle, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle,
  SlidersHorizontal,
  Eye,
  FileSpreadsheet
} from 'lucide-react';

interface RfqTableProps {
  items: RfqItem[];
  onUpdateItems: (newItems: RfqItem[]) => void;
}

export const RfqTable: React.FC<RfqTableProps> = ({ items, onUpdateItems }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<RfqItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyShowMissing, setOnlyShowMissing] = useState(false);
  const [showSecondaryCols, setShowSecondaryCols] = useState(false);

  // Checks if a text is marked as "未提供"
  const isMissing = (val: string | undefined): boolean => {
    if (!val) return true;
    const trimmed = val.trim();
    return trimmed === '未提供' || trimmed === '未標明' || trimmed.includes('未提供');
  };

  // Check if an entire item has any field that is "未提供"
  const itemHasMissingField = (item: RfqItem): boolean => {
    return (
      isMissing(item.connector) ||
      isMissing(item.terminal) ||
      isMissing(item.wire) ||
      isMissing(item.wireGauge) ||
      isMissing(item.wireLength) ||
      isMissing(item.quantity) ||
      isMissing(item.processingRequirement) ||
      isMissing(item.specialRequirement)
    );
  };

  // Filter items based on search and missing toggle
  const filteredItems = items.filter(item => {
    if (onlyShowMissing && !itemHasMissingField(item)) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.connector.toLowerCase().includes(q) ||
      item.terminal.toLowerCase().includes(q) ||
      item.wire.toLowerCase().includes(q) ||
      item.wireGauge.toLowerCase().includes(q) ||
      item.wireLength.toLowerCase().includes(q) ||
      item.processingRequirement.toLowerCase().includes(q) ||
      item.specialRequirement.toLowerCase().includes(q) ||
      (item.wireColor && item.wireColor.toLowerCase().includes(q))
    );
  });

  // Start editing a row
  const startEdit = (item: RfqItem) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  // Save edited row
  const saveEdit = () => {
    if (!editForm) return;
    const updated = items.map(it => (it.id === editForm.id ? editForm : it));
    onUpdateItems(updated);
    setEditingId(null);
    setEditForm(null);
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  // Delete row
  const handleDelete = (id: string) => {
    if (items.length <= 1) {
      if (!confirm('這是最後一筆項目，確定要刪除嗎？')) return;
    }
    const updated = items.filter(it => it.id !== id);
    onUpdateItems(updated);
  };

  // Duplicate row
  const handleDuplicate = (item: RfqItem) => {
    const newItem: RfqItem = {
      ...item,
      id: `${Date.now()}`,
      quantity: item.quantity,
    };
    const index = items.findIndex(it => it.id === item.id);
    const updated = [...items];
    updated.splice(index + 1, 0, newItem);
    onUpdateItems(updated);
  };

  // Add new empty row
  const handleAddNewRow = () => {
    const newItem: RfqItem = {
      id: `${Date.now()}`,
      connector: '未提供',
      terminal: '未提供',
      wire: '未提供',
      wireGauge: '未提供',
      wireLength: '未提供',
      quantity: '1',
      processingRequirement: '未提供',
      specialRequirement: '未提供',
      wireColor: '未提供',
      pinout: '未提供',
      notes: '手動新增',
    };
    const updated = [...items, newItem];
    onUpdateItems(updated);
    startEdit(newItem);
  };

  // Render cell content with distinctive "未提供" badge
  const renderCellContent = (value: string | undefined, isHighlightable = true) => {
    if (!value || isMissing(value)) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/90 shadow-2xs">
          <HelpCircle className="w-3 h-3 mr-1 text-amber-500 shrink-0" />
          未提供
        </span>
      );
    }
    return <span className="text-slate-800 text-xs font-medium leading-relaxed">{value}</span>;
  };

  // Calculate missing stats
  const totalMissingCells = items.reduce((acc, it) => {
    let count = 0;
    if (isMissing(it.connector)) count++;
    if (isMissing(it.terminal)) count++;
    if (isMissing(it.wire)) count++;
    if (isMissing(it.wireGauge)) count++;
    if (isMissing(it.wireLength)) count++;
    if (isMissing(it.quantity)) count++;
    if (isMissing(it.processingRequirement)) count++;
    if (isMissing(it.specialRequirement)) count++;
    return acc + count;
  }, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
      {/* Table Header Controls */}
      <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left: Summary Title & Stats */}
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-600 text-white shadow-xs">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm text-slate-900">
                線束規格與加工要求明細表 (RFQ Spec BOM)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                共 {items.length} 項
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              雙擊任一欄位或點擊編輯按鈕即可直接修改 AI 辨識數值
            </p>
          </div>
        </div>

        {/* Right: Search, Filter, Add button */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜尋規格/料號/線規..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-36 sm:w-44 shadow-2xs"
            />
          </div>

          {/* Missing Filter Toggle */}
          <button
            type="button"
            onClick={() => setOnlyShowMissing(!onlyShowMissing)}
            className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
              onlyShowMissing
                ? 'bg-amber-50 text-amber-700 border-amber-300 ring-1 ring-amber-400'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="僅過濾出包含『未提供』缺失項目的行"
          >
            <AlertTriangle className={`w-3.5 h-3.5 mr-1 ${onlyShowMissing ? 'text-amber-600' : 'text-slate-400'}`} />
            <span>缺失項 ({totalMissingCells})</span>
          </button>

          {/* Toggle Secondary Columns (線色 / Pin腳位 / 備註) */}
          <button
            type="button"
            onClick={() => setShowSecondaryCols(!showSecondaryCols)}
            className="inline-flex items-center px-2 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition"
            title="顯示或隱藏輔助欄位 (線色、Pin腳位、備註)"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1 text-slate-400" />
            <span>{showSecondaryCols ? '隱藏副欄' : '更多欄位'}</span>
          </button>

          {/* Add Row Button */}
          <button
            type="button"
            onClick={handleAddNewRow}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>新增項目</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-slate-100/90 border-b border-slate-200 text-[11px] font-bold text-slate-600 tracking-wider uppercase">
              <th className="py-2.5 px-3 w-12 text-center">#</th>
              <th className="py-2.5 px-3 min-w-[130px]">Connector<br/><span className="text-[10px] font-normal text-slate-500">(連接器)</span></th>
              <th className="py-2.5 px-3 min-w-[130px]">Terminal<br/><span className="text-[10px] font-normal text-slate-500">(端子)</span></th>
              <th className="py-2.5 px-3 min-w-[140px]">Wire<br/><span className="text-[10px] font-normal text-slate-500">(線材規格)</span></th>
              <th className="py-2.5 px-3 min-w-[90px]">Wire Gauge<br/><span className="text-[10px] font-normal text-slate-500">(線規)</span></th>
              <th className="py-2.5 px-3 min-w-[100px]">Wire Length<br/><span className="text-[10px] font-normal text-slate-500">(線長及公差)</span></th>
              <th className="py-2.5 px-3 min-w-[80px]">Quantity<br/><span className="text-[10px] font-normal text-slate-500">(數量/用量)</span></th>
              <th className="py-2.5 px-3 min-w-[180px]">Processing Requirement<br/><span className="text-[10px] font-normal text-slate-500">(加工要求)</span></th>
              <th className="py-2.5 px-3 min-w-[160px]">Special Requirement<br/><span className="text-[10px] font-normal text-slate-500">(特殊要求)</span></th>

              {showSecondaryCols && (
                <>
                  <th className="py-2.5 px-3 min-w-[80px]">線色</th>
                  <th className="py-2.5 px-3 min-w-[90px]">Pin腳位</th>
                  <th className="py-2.5 px-3 min-w-[100px]">圖面備註</th>
                </>
              )}

              <th className="py-2.5 px-3 w-24 text-right sticky right-0 bg-slate-100/90 shadow-xs">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={showSecondaryCols ? 13 : 10} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center">
                    <Filter className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="text-sm font-medium text-slate-500">無符合條件的項目</p>
                    {onlyShowMissing && (
                      <p className="text-xs text-emerald-600 mt-1">太棒了！所有欄位皆已具備具體數值，無標註為「未提供」的項目。</p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredItems.map((item, index) => {
                const isEditingThisRow = editingId === item.id;
                const hasMissing = itemHasMissingField(item);

                if (isEditingThisRow && editForm) {
                  // EDIT MODE ROW
                  return (
                    <tr key={item.id} className="bg-blue-50/70 border-2 border-blue-400">
                      <td className="py-3 px-2 text-center font-mono text-xs font-bold text-blue-800">
                        {item.id || index + 1}
                      </td>

                      {/* Connector */}
                      <td className="p-2">
                        <textarea
                          rows={2}
                          value={editForm.connector}
                          onChange={e => setEditForm({ ...editForm, connector: e.target.value })}
                          className="w-full text-xs p-1.5 border border-blue-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="例如: JST PHR-4 或 未提供"
                        />
                      </td>

                      {/* Terminal */}
                      <td className="p-2">
                        <textarea
                          rows={2}
                          value={editForm.terminal}
                          onChange={e => setEditForm({ ...editForm, terminal: e.target.value })}
                          className="w-full text-xs p-1.5 border border-blue-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="例如: SPH-002T 或 未提供"
                        />
                      </td>

                      {/* Wire */}
                      <td className="p-2">
                        <textarea
                          rows={2}
                          value={editForm.wire}
                          onChange={e => setEditForm({ ...editForm, wire: e.target.value })}
                          className="w-full text-xs p-1.5 border border-blue-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="例如: UL1007, 300V 80℃ PVC 或 未提供"
                        />
                      </td>

                      {/* Wire Gauge */}
                      <td className="p-2">
                        <input
                          type="text"
                          value={editForm.wireGauge}
                          onChange={e => setEditForm({ ...editForm, wireGauge: e.target.value })}
                          className="w-full text-xs p-1.5 border border-blue-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="例如: 24 AWG 或 未提供"
                        />
                      </td>

                      {/* Wire Length */}
                      <td className="p-2">
                        <input
                          type="text"
                          value={editForm.wireLength}
                          onChange={e => setEditForm({ ...editForm, wireLength: e.target.value })}
                          className="w-full text-xs p-1.5 border border-blue-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="例如: 150mm ± 5mm 或 未提供"
                        />
                      </td>

                      {/* Quantity */}
                      <td className="p-2">
                        <input
                          type="text"
                          value={editForm.quantity}
                          onChange={e => setEditForm({ ...editForm, quantity: e.target.value })}
                          className="w-full text-xs p-1.5 border border-blue-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="例如: 1 PC 或 未提供"
                        />
                      </td>

                      {/* Processing Requirement */}
                      <td className="p-2">
                        <textarea
                          rows={3}
                          value={editForm.processingRequirement}
                          onChange={e => setEditForm({ ...editForm, processingRequirement: e.target.value })}
                          className="w-full text-xs p-1.5 border border-blue-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="加工要求: 剝皮、壓接、鍍錫、熱縮套管... 或 未提供"
                        />
                      </td>

                      {/* Special Requirement */}
                      <td className="p-2">
                        <textarea
                          rows={3}
                          value={editForm.specialRequirement}
                          onChange={e => setEditForm({ ...editForm, specialRequirement: e.target.value })}
                          className="w-full text-xs p-1.5 border border-blue-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="特殊要求: 耐溫、UL94阻燃、耐壓測試... 或 未提供"
                        />
                      </td>

                      {/* Secondary Columns in Edit */}
                      {showSecondaryCols && (
                        <>
                          <td className="p-2">
                            <input
                              type="text"
                              value={editForm.wireColor || ''}
                              onChange={e => setEditForm({ ...editForm, wireColor: e.target.value })}
                              className="w-full text-xs p-1.5 border border-blue-300 rounded bg-white"
                              placeholder="線色"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={editForm.pinout || ''}
                              onChange={e => setEditForm({ ...editForm, pinout: e.target.value })}
                              className="w-full text-xs p-1.5 border border-blue-300 rounded bg-white"
                              placeholder="Pin 定義"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={editForm.notes || ''}
                              onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                              className="w-full text-xs p-1.5 border border-blue-300 rounded bg-white"
                              placeholder="備註"
                            />
                          </td>
                        </>
                      )}

                      {/* Actions in Edit */}
                      <td className="py-2 px-2 text-right sticky right-0 bg-blue-50/90">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            type="button"
                            onClick={saveEdit}
                            className="p-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition"
                            title="儲存修改"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="p-1.5 rounded bg-slate-300 hover:bg-slate-400 text-slate-800 transition"
                            title="取消"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                // NORMAL DISPLAY ROW
                return (
                  <tr 
                    key={item.id} 
                    onDoubleClick={() => startEdit(item)}
                    className={`hover:bg-slate-50/90 transition-colors group ${
                      hasMissing ? 'bg-amber-50/15' : ''
                    }`}
                  >
                    {/* Index */}
                    <td className="py-3 px-3 text-center font-mono text-xs text-slate-500">
                      {item.id || index + 1}
                    </td>

                    {/* Connector */}
                    <td className="py-3 px-3">
                      {renderCellContent(item.connector)}
                    </td>

                    {/* Terminal */}
                    <td className="py-3 px-3">
                      {renderCellContent(item.terminal)}
                    </td>

                    {/* Wire */}
                    <td className="py-3 px-3">
                      {renderCellContent(item.wire)}
                    </td>

                    {/* Wire Gauge */}
                    <td className="py-3 px-3 font-mono">
                      {renderCellContent(item.wireGauge)}
                    </td>

                    {/* Wire Length */}
                    <td className="py-3 px-3 font-mono">
                      {renderCellContent(item.wireLength)}
                    </td>

                    {/* Quantity */}
                    <td className="py-3 px-3">
                      {renderCellContent(item.quantity)}
                    </td>

                    {/* Processing Requirement */}
                    <td className="py-3 px-3">
                      {renderCellContent(item.processingRequirement)}
                    </td>

                    {/* Special Requirement */}
                    <td className="py-3 px-3">
                      {renderCellContent(item.specialRequirement)}
                    </td>

                    {/* Secondary columns */}
                    {showSecondaryCols && (
                      <>
                        <td className="py-3 px-3 text-xs text-slate-600">
                          {renderCellContent(item.wireColor)}
                        </td>
                        <td className="py-3 px-3 text-xs font-mono text-slate-600">
                          {renderCellContent(item.pinout)}
                        </td>
                        <td className="py-3 px-3 text-xs text-slate-500">
                          {renderCellContent(item.notes)}
                        </td>
                      </>
                    )}

                    {/* Action buttons */}
                    <td className="py-3 px-3 text-right sticky right-0 bg-white/95 group-hover:bg-slate-50/95 transition-colors">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="修改此筆資料"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(item)}
                          className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                          title="複製為新的一筆"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="刪除"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Missing Alert Summary */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>已確認規格欄位: {items.length * 8 - totalMissingCells} 個</span>
          </div>
          {totalMissingCells > 0 ? (
            <div className="flex items-center space-x-1.5 text-amber-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>待確認「未提供」欄位: {totalMissingCells} 個</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>所有 8 大欄位規格皆已齊全！</span>
            </div>
          )}
        </div>
        <div className="text-[11px] text-slate-400">
          提示：若向客戶確認後取得新規格，點擊修改圖示即可直接補齊資料
        </div>
      </div>
    </div>
  );
};
