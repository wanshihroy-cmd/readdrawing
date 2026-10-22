import { RfqAnalysisResult, RfqItem } from '../types/rfq';

/**
 * Escapes CSV field value properly.
 */
function escapeCsv(value: string | undefined): string {
  if (value === undefined || value === null) return '""';
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Exports RFQ Analysis Result as CSV with UTF-8 BOM for Microsoft Excel.
 */
export function exportToExcelCsv(data: RfqAnalysisResult, filename?: string) {
  const lines: string[] = [];

  // UTF-8 BOM
  const BOM = '\uFEFF';

  // Section 1: Header / Drawing Info
  lines.push('【線材加工 RFQ 規格分析表】');
  lines.push('');
  lines.push('圖面資訊,值,圖面資訊,值');
  lines.push(`圖面編號,${escapeCsv(data.drawingInfo.drawingNumber)},客戶名稱,${escapeCsv(data.drawingInfo.customerName)}`);
  lines.push(`品名描述,${escapeCsv(data.drawingInfo.productTitle)},圖面版本,${escapeCsv(data.drawingInfo.revision)}`);
  lines.push(`客戶料號,${escapeCsv(data.drawingInfo.partNumber || '未提供')},總長度公差,${escapeCsv(data.drawingInfo.overallLength)}`);
  lines.push(`訂單批量,${escapeCsv(data.drawingInfo.totalQuantity)},繪圖日期,${escapeCsv(data.drawingInfo.drawingDate || '未提供')}`);
  lines.push('');

  // Section 2: Items Table (Required 8 Core Fields + Secondary Fields)
  lines.push('【線束組件與加工規格明細表】');
  const headers = [
    '項目',
    'Connector (連接器)',
    'Terminal (端子)',
    'Wire (線材規格)',
    'Wire Gauge (線規)',
    'Wire Length (線長)',
    'Quantity (用量/數量)',
    'Processing Requirement (加工要求)',
    'Special Requirement (特殊要求)',
    '線色',
    'Pin腳位',
    '備註'
  ];
  lines.push(headers.map(escapeCsv).join(','));

  data.items.forEach((item, index) => {
    const row = [
      item.id || String(index + 1),
      item.connector,
      item.terminal,
      item.wire,
      item.wireGauge,
      item.wireLength,
      item.quantity,
      item.processingRequirement,
      item.specialRequirement,
      item.wireColor || '未提供',
      item.pinout || '未提供',
      item.notes || '未提供'
    ];
    lines.push(row.map(escapeCsv).join(','));
  });

  // Section 3: Overall Notes & Clarification
  lines.push('');
  lines.push('【綜合要求與業務確認提醒】');
  lines.push(`綜合加工要求,${escapeCsv(data.overallProcessingRequirement)}`);
  lines.push(`綜合特殊要求,${escapeCsv(data.overallSpecialRequirement)}`);
  
  if (data.clarificationChecklist && data.clarificationChecklist.length > 0) {
    lines.push('');
    lines.push('【待與客戶確認清單 (標記為未提供項目)】');
    data.clarificationChecklist.forEach((item, i) => {
      lines.push(`${i + 1},${escapeCsv(item)}`);
    });
  }

  const csvContent = BOM + lines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  const actualFilename = filename || `RFQ_分析表_${data.drawingInfo.drawingNumber || 'Drawing'}_${new Date().toISOString().slice(0, 10)}.csv`;
  link.setAttribute('href', url);
  link.setAttribute('download', actualFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copies the RFQ item table to clipboard in Tab-Separated Values (TSV) format.
 * Directly pastable into Excel or ERP tables.
 */
export async function copyTableToClipboard(items: RfqItem[]): Promise<boolean> {
  const headers = [
    '項目',
    'Connector',
    'Terminal',
    'Wire',
    'Wire Gauge',
    'Wire Length',
    'Quantity',
    'Processing Requirement',
    'Special Requirement'
  ];

  const rows = items.map((item, idx) => [
    item.id || String(idx + 1),
    item.connector,
    item.terminal,
    item.wire,
    item.wireGauge,
    item.wireLength,
    item.quantity,
    item.processingRequirement,
    item.specialRequirement
  ]);

  const tsv = [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
  try {
    await navigator.clipboard.writeText(tsv);
    return true;
  } catch (err) {
    console.error('Clipboard copy failed', err);
    return false;
  }
}

/**
 * Downloads full JSON specification.
 */
export function exportToJson(data: RfqAnalysisResult, filename?: string) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const actualFilename = filename || `RFQ_Data_${data.drawingInfo.drawingNumber || 'Drawing'}.json`;
  link.setAttribute('href', url);
  link.setAttribute('download', actualFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
