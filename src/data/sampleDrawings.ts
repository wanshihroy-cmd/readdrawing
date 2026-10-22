import { SampleDrawing } from '../types/rfq';

// Generate an SVG blueprint for Sample 1: JST 4-Pin Power Harness
function createSample1Svg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 850" width="1200" height="850">
    <!-- Blueprint Background & Grid -->
    <rect width="1200" height="850" fill="#0d1b2a"/>
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1b2a4a" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="1200" height="850" fill="url(#grid)"/>

    <!-- Drawing Border -->
    <rect x="25" y="25" width="1150" height="800" fill="none" stroke="#415a77" stroke-width="2.5"/>
    <rect x="35" y="35" width="1130" height="780" fill="none" stroke="#778da9" stroke-width="1.2"/>

    <!-- Title Block (Bottom Right) -->
    <g transform="translate(720, 640)">
      <rect width="445" height="175" fill="#1b263b" stroke="#00b4d8" stroke-width="2"/>
      <line x1="0" y1="35" x2="445" y2="35" stroke="#415a77" stroke-width="1"/>
      <line x1="0" y1="70" x2="445" y2="70" stroke="#415a77" stroke-width="1"/>
      <line x1="0" y1="105" x2="445" y2="105" stroke="#415a77" stroke-width="1"/>
      <line x1="0" y1="140" x2="445" y2="140" stroke="#415a77" stroke-width="1"/>
      <line x1="140" y1="0" x2="140" y2="140" stroke="#415a77" stroke-width="1"/>
      <line x1="280" y1="70" x2="280" y2="140" stroke="#415a77" stroke-width="1"/>

      <text x="15" y="24" fill="#90e0ef" font-family="monospace" font-size="13">CUSTOMER 客戶:</text>
      <text x="150" y="24" fill="#ffffff" font-family="monospace" font-size="14" font-weight="bold">TECHTRONIC ROBOTICS INC.</text>

      <text x="15" y="58" fill="#90e0ef" font-family="monospace" font-size="13">TITLE 品名:</text>
      <text x="150" y="58" fill="#ffffff" font-family="monospace" font-size="14" font-weight="bold">4-PIN JST SENSOR CABLE ASSY</text>

      <text x="15" y="92" fill="#90e0ef" font-family="monospace" font-size="13">DWG NO. 圖號:</text>
      <text x="150" y="92" fill="#ffd166" font-family="monospace" font-size="14" font-weight="bold">TR-WH-2024-0418</text>
      <text x="290" y="92" fill="#90e0ef" font-family="monospace" font-size="13">REV: <tspan fill="#ffffff" font-weight="bold">B.1</tspan></text>

      <text x="15" y="126" fill="#90e0ef" font-family="monospace" font-size="13">QTY 數量:</text>
      <text x="150" y="126" fill="#ffffff" font-family="monospace" font-size="13">5,000 PCS / LOT</text>
      <text x="290" y="126" fill="#90e0ef" font-family="monospace" font-size="13">DATE: <tspan fill="#ffffff">2024-11-15</tspan></text>

      <text x="15" y="160" fill="#00b4d8" font-family="sans-serif" font-size="11">TOLERANCE: ±5mm | ALL UNITS IN MM</text>
    </g>

    <!-- General Notes (Top Left) -->
    <g transform="translate(55, 60)">
      <rect width="480" height="230" fill="#14213d" fill-opacity="0.9" stroke="#3a86ff" stroke-width="1.5" rx="4"/>
      <text x="20" y="30" fill="#00b4d8" font-family="sans-serif" font-size="16" font-weight="bold">ENGINEERING NOTES 技術要求說明</text>
      <text x="20" y="60" fill="#e0e1dd" font-family="monospace" font-size="13">1. CONNECTOR P1: JST PHR-4 (2.0mm Pitch, 4-Pin, White)</text>
      <text x="20" y="85" fill="#e0e1dd" font-family="monospace" font-size="13">2. TERMINAL: JST SPH-002T-P0.5S (Phosphor Bronze, Tin-plated)</text>
      <text x="20" y="110" fill="#e0e1dd" font-family="monospace" font-size="13">3. WIRE SPEC: UL1007, 24 AWG, 300V 80℃, PVC Insulated</text>
      <text x="20" y="135" fill="#e0e1dd" font-family="monospace" font-size="13">4. PROCESSING: Strip &amp; Tin 3.0±0.5mm on P2 end. Crimp P1.</text>
      <text x="20" y="160" fill="#e0e1dd" font-family="monospace" font-size="13">5. SPECIAL: 100% Continuity &amp; Hi-Pot Test 500V DC 1min.</text>
      <text x="20" y="185" fill="#e0e1dd" font-family="monospace" font-size="13">6. COMPLIANCE: RoHS 2.0 &amp; REACH compliant, UL94V-0 rated.</text>
      <text x="20" y="210" fill="#e0e1dd" font-family="monospace" font-size="13">7. WIRE LENGTH: L = 150mm ± 5mm (Overall Cut Length)</text>
    </g>

    <!-- Wire Harness Schematic Representation -->
    <g transform="translate(100, 360)">
      <!-- Dimension Line -->
      <line x1="80" y1="20" x2="880" y2="20" stroke="#00f5d4" stroke-width="2"/>
      <line x1="80" y1="10" x2="80" y2="30" stroke="#00f5d4" stroke-width="2"/>
      <line x1="880" y1="10" x2="880" y2="30" stroke="#00f5d4" stroke-width="2"/>
      <text x="440" y="12" fill="#00f5d4" font-family="monospace" font-size="18" font-weight="bold" text-anchor="middle">150 ± 5 mm</text>

      <!-- P1 Connector Housing -->
      <g transform="translate(20, 60)">
        <rect width="65" height="150" fill="#e2eafc" stroke="#333" stroke-width="2" rx="3"/>
        <text x="32" y="30" fill="#000" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">P1</text>
        <text x="32" y="50" fill="#000" font-family="sans-serif" font-size="9" text-anchor="middle">PHR-4</text>
        <!-- 4 Pins -->
        <rect x="5" y="65" width="55" height="15" fill="#cbd5e1" stroke="#475569"/>
        <text x="12" y="77" fill="#000" font-size="10">1</text>
        <rect x="5" y="85" width="55" height="15" fill="#cbd5e1" stroke="#475569"/>
        <text x="12" y="97" fill="#000" font-size="10">2</text>
        <rect x="5" y="105" width="55" height="15" fill="#cbd5e1" stroke="#475569"/>
        <text x="12" y="117" fill="#000" font-size="10">3</text>
        <rect x="5" y="125" width="55" height="15" fill="#cbd5e1" stroke="#475569"/>
        <text x="12" y="137" fill="#000" font-size="10">4</text>
      </g>

      <!-- 4 Colored Wires -->
      <!-- Wire 1: Red -->
      <line x1="85" y1="132" x2="880" y2="132" stroke="#e63946" stroke-width="7"/>
      <text x="500" y="125" fill="#ffb4a2" font-family="monospace" font-size="12">PIN 1: RED (VCC) - UL1007 24AWG</text>

      <!-- Wire 2: Black -->
      <line x1="85" y1="152" x2="880" y2="152" stroke="#212529" stroke-width="7"/>
      <line x1="85" y1="152" x2="880" y2="152" stroke="#495057" stroke-width="3"/>
      <text x="500" y="147" fill="#ced4da" font-family="monospace" font-size="12">PIN 2: BLACK (GND) - UL1007 24AWG</text>

      <!-- Wire 3: Yellow -->
      <line x1="85" y1="172" x2="880" y2="172" stroke="#ffb703" stroke-width="7"/>
      <text x="500" y="167" fill="#ffe6a7" font-family="monospace" font-size="12">PIN 3: YELLOW (TXD) - UL1007 24AWG</text>

      <!-- Wire 4: White -->
      <line x1="85" y1="192" x2="880" y2="192" stroke="#f8f9fa" stroke-width="7"/>
      <text x="500" y="187" fill="#ffffff" font-family="monospace" font-size="12">PIN 4: WHITE (RXD) - UL1007 24AWG</text>

      <!-- P2 End (Stripped & Tinned Wire Ends) -->
      <g transform="translate(880, 120)">
        <rect x="0" y="8" width="25" height="80" fill="#2b2d42" fill-opacity="0.8" stroke="#ced4da" stroke-dasharray="3,3"/>
        <line x1="0" y1="12" x2="20" y2="12" stroke="#b0c4de" stroke-width="4"/>
        <line x1="0" y1="32" x2="20" y2="32" stroke="#b0c4de" stroke-width="4"/>
        <line x1="0" y1="52" x2="20" y2="52" stroke="#b0c4de" stroke-width="4"/>
        <line x1="0" y1="72" x2="20" y2="72" stroke="#b0c4de" stroke-width="4"/>
        <text x="35" y="35" fill="#90e0ef" font-family="monospace" font-size="11">P2: Strip 3.0±0.5mm</text>
        <text x="35" y="55" fill="#90e0ef" font-family="monospace" font-size="11">Dip Tin (鍍錫)</text>
      </g>
    </g>

    <!-- Bill of Materials (BOM) Table (Bottom Left) -->
    <g transform="translate(55, 600)">
      <rect width="630" height="215" fill="#14213d" stroke="#48cae4" stroke-width="1.5" rx="3"/>
      <text x="15" y="24" fill="#48cae4" font-family="sans-serif" font-size="14" font-weight="bold">BILL OF MATERIALS (BOM 表)</text>
      <!-- Table Header -->
      <rect x="10" y="35" width="610" height="25" fill="#1f3a60"/>
      <text x="20" y="52" fill="#fff" font-family="monospace" font-size="11" font-weight="bold">NO</text>
      <text x="60" y="52" fill="#fff" font-family="monospace" font-size="11" font-weight="bold">DESCRIPTION 說明</text>
      <text x="260" y="52" fill="#fff" font-family="monospace" font-size="11" font-weight="bold">PART NUMBER / SPEC 料號規格</text>
      <text x="510" y="52" fill="#fff" font-family="monospace" font-size="11" font-weight="bold">QTY</text>
      <text x="560" y="52" fill="#fff" font-family="monospace" font-size="11" font-weight="bold">VENDOR</text>

      <!-- Row 1 -->
      <line x1="10" y1="60" x2="620" y2="60" stroke="#2b4c7e"/>
      <text x="20" y="78" fill="#e0e1dd" font-family="monospace" font-size="11">1</text>
      <text x="60" y="78" fill="#e0e1dd" font-family="monospace" font-size="11">Housing (連接器膠殼)</text>
      <text x="260" y="78" fill="#ffd166" font-family="monospace" font-size="11">PHR-4 (2.0mm Pitch, 4P)</text>
      <text x="510" y="78" fill="#e0e1dd" font-family="monospace" font-size="11">1 PC</text>
      <text x="560" y="78" fill="#e0e1dd" font-family="monospace" font-size="11">JST</text>

      <!-- Row 2 -->
      <line x1="10" y1="92" x2="620" y2="92" stroke="#2b4c7e"/>
      <text x="20" y="110" fill="#e0e1dd" font-family="monospace" font-size="11">2</text>
      <text x="60" y="110" fill="#e0e1dd" font-family="monospace" font-size="11">Terminal (壓著端子)</text>
      <text x="260" y="110" fill="#ffd166" font-family="monospace" font-size="11">SPH-002T-P0.5S (Phosphor Bronze)</text>
      <text x="510" y="110" fill="#e0e1dd" font-family="monospace" font-size="11">4 PCS</text>
      <text x="560" y="110" fill="#e0e1dd" font-family="monospace" font-size="11">JST</text>

      <!-- Row 3 -->
      <line x1="10" y1="124" x2="620" y2="124" stroke="#2b4c7e"/>
      <text x="20" y="142" fill="#e0e1dd" font-family="monospace" font-size="11">3</text>
      <text x="60" y="142" fill="#e0e1dd" font-family="monospace" font-size="11">Hook-up Wire (電子線材)</text>
      <text x="260" y="142" fill="#ffd166" font-family="monospace" font-size="11">UL1007, 24 AWG, 300V 80℃ PVC</text>
      <text x="510" y="142" fill="#e0e1dd" font-family="monospace" font-size="11">4 PCS</text>
      <text x="560" y="142" fill="#e0e1dd" font-family="monospace" font-size="11">STANDARD</text>

      <!-- Row 4 -->
      <line x1="10" y1="156" x2="620" y2="156" stroke="#2b4c7e"/>
      <text x="20" y="174" fill="#e0e1dd" font-family="monospace" font-size="11">4</text>
      <text x="60" y="174" fill="#e0e1dd" font-family="monospace" font-size="11">Solder (錫絲)</text>
      <text x="260" y="174" fill="#ffd166" font-family="monospace" font-size="11">Sn99.3/Cu0.7 Lead-Free RoHS</text>
      <text x="510" y="174" fill="#e0e1dd" font-family="monospace" font-size="11">A/R</text>
      <text x="560" y="174" fill="#e0e1dd" font-family="monospace" font-size="11">STANDARD</text>
    </g>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// Generate an SVG blueprint for Sample 2: Molex Micro-Fit 3.0 Dual-Ended Power Cable
function createSample2Svg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 850" width="1200" height="850">
    <rect width="1200" height="850" fill="#0f172a"/>
    <defs>
      <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="1200" height="850" fill="url(#grid2)"/>

    <rect x="25" y="25" width="1150" height="800" fill="none" stroke="#334155" stroke-width="2"/>
    <rect x="35" y="35" width="1130" height="780" fill="none" stroke="#475569" stroke-width="1"/>

    <!-- Title Block -->
    <g transform="translate(720, 640)">
      <rect width="445" height="175" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
      <text x="15" y="24" fill="#7dd3fc" font-family="monospace" font-size="13">CUSTOMER:</text>
      <text x="140" y="24" fill="#ffffff" font-family="monospace" font-size="14" font-weight="bold">DELTA POWER DYNAMICS</text>
      <text x="15" y="58" fill="#7dd3fc" font-family="monospace" font-size="13">PART NAME:</text>
      <text x="140" y="58" fill="#ffffff" font-family="monospace" font-size="14" font-weight="bold">MICRO-FIT 2-PIN DC CABLE</text>
      <text x="15" y="92" fill="#7dd3fc" font-family="monospace" font-size="13">DWG NO:</text>
      <text x="140" y="92" fill="#facc15" font-family="monospace" font-size="14" font-weight="bold">DPD-CBL-43025-002</text>
      <text x="320" y="92" fill="#7dd3fc" font-family="monospace" font-size="13">REV: A</text>
      <text x="15" y="126" fill="#7dd3fc" font-family="monospace" font-size="13">QUANTITY:</text>
      <text x="140" y="126" fill="#ffffff" font-family="monospace" font-size="13">10,000 SETS</text>
      <text x="15" y="160" fill="#38bdf8" font-family="sans-serif" font-size="11">TOTAL LENGTH: 300mm ± 10mm</text>
    </g>

    <!-- Notes -->
    <g transform="translate(55, 60)">
      <rect width="500" height="230" fill="#1e293b" stroke="#0ea5e9" stroke-width="1.5" rx="4"/>
      <text x="20" y="30" fill="#38bdf8" font-family="sans-serif" font-size="16" font-weight="bold">PROCESSING &amp; SPECIAL REQUIREMENTS</text>
      <text x="20" y="60" fill="#f1f5f9" font-family="monospace" font-size="13">1. CONNECTOR (P1 &amp; P2): MOLEX 43025-0200 (Micro-Fit 3.0, 2-Pin)</text>
      <text x="20" y="85" fill="#f1f5f9" font-family="monospace" font-size="13">2. TERMINAL: MOLEX 43030-0001 (Gold Plated, 20-24 AWG)</text>
      <text x="20" y="110" fill="#f1f5f9" font-family="monospace" font-size="13">3. WIRE: UL1061, 20 AWG, 300V 80℃ (1x Black, 1x Red)</text>
      <text x="20" y="135" fill="#f1f5f9" font-family="monospace" font-size="13">4. PROCESSING: Dual-end crimp, Heat Shrink Tube OD 4.0mm x 25mm</text>
      <text x="20" y="160" fill="#f1f5f9" font-family="monospace" font-size="13">5. WRAP: Black braided sleeving over center 200mm</text>
      <text x="20" y="185" fill="#f1f5f9" font-family="monospace" font-size="13">6. SPECIAL: 100% Pull force test &gt; 5.0 kgf, UL94V-0, RoHS 3</text>
      <text x="20" y="210" fill="#f1f5f9" font-family="monospace" font-size="13">7. WIRE LENGTH: 300mm ± 10mm</text>
    </g>

    <!-- Visual harness drawing -->
    <g transform="translate(100, 370)">
      <line x1="80" y1="20" x2="880" y2="20" stroke="#38bdf8" stroke-width="2"/>
      <text x="480" y="12" fill="#38bdf8" font-family="monospace" font-size="18" font-weight="bold" text-anchor="middle">300 ± 10 mm</text>

      <!-- P1 -->
      <rect x="20" y="50" width="70" height="90" fill="#334155" stroke="#fff" stroke-width="1.5" rx="3"/>
      <text x="55" y="75" fill="#fff" font-family="monospace" font-size="12" text-anchor="middle">P1</text>
      <text x="55" y="95" fill="#94a3b8" font-family="sans-serif" font-size="9" text-anchor="middle">43025-0200</text>

      <!-- P2 -->
      <rect x="880" y="50" width="70" height="90" fill="#334155" stroke="#fff" stroke-width="1.5" rx="3"/>
      <text x="915" y="75" fill="#fff" font-family="monospace" font-size="12" text-anchor="middle">P2</text>
      <text x="915" y="95" fill="#94a3b8" font-family="sans-serif" font-size="9" text-anchor="middle">43025-0200</text>

      <!-- Wires -->
      <line x1="90" y1="80" x2="880" y2="80" stroke="#ef4444" stroke-width="8"/>
      <text x="450" y="73" fill="#fca5a5" font-family="monospace" font-size="13">PIN 1: RED (UL1061 20AWG)</text>

      <line x1="90" y1="105" x2="880" y2="105" stroke="#000000" stroke-width="8"/>
      <line x1="90" y1="105" x2="880" y2="105" stroke="#64748b" stroke-width="2"/>
      <text x="450" y="125" fill="#cbd5e1" font-family="monospace" font-size="13">PIN 2: BLACK (UL1061 20AWG)</text>

      <!-- Braided sleeve overlay -->
      <rect x="250" y="70" width="460" height="50" fill="#1e293b" fill-opacity="0.85" stroke="#94a3b8" stroke-dasharray="4,4" rx="4"/>
      <text x="480" y="100" fill="#cbd5e1" font-family="sans-serif" font-size="11" text-anchor="middle">Black Braided Expandable Sleeving (編織網管 200mm)</text>
    </g>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// Generate an SVG blueprint for Sample 3: Incomplete/Unspecified drawing to test "未提供"
function createSample3Svg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 850" width="1200" height="850">
    <rect width="1200" height="850" fill="#18181b"/>
    <defs>
      <pattern id="grid3" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#27272a" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="1200" height="850" fill="url(#grid3)"/>

    <rect x="25" y="25" width="1150" height="800" fill="none" stroke="#3f3f46" stroke-width="2"/>

    <!-- Title Block with missing items -->
    <g transform="translate(720, 640)">
      <rect width="445" height="175" fill="#27272a" stroke="#f59e0b" stroke-width="2"/>
      <text x="15" y="24" fill="#fbbf24" font-family="monospace" font-size="13">CUSTOMER:</text>
      <text x="140" y="24" fill="#ffffff" font-family="monospace" font-size="14" font-weight="bold">UNKNOWN CLIENT / 未標註</text>
      <text x="15" y="58" fill="#fbbf24" font-family="monospace" font-size="13">TITLE:</text>
      <text x="140" y="58" fill="#ffffff" font-family="monospace" font-size="14" font-weight="bold">CUSTOM SENSOR LEAD WIRE</text>
      <text x="15" y="92" fill="#fbbf24" font-family="monospace" font-size="13">DWG NO:</text>
      <text x="140" y="92" fill="#ffffff" font-family="monospace" font-size="14">DRAFT-0992</text>
      <text x="15" y="126" fill="#fbbf24" font-family="monospace" font-size="13">QUANTITY:</text>
      <text x="140" y="126" fill="#f87171" font-family="monospace" font-size="13">[未標註數量 / 未提供]</text>
    </g>

    <!-- Notes with vague information -->
    <g transform="translate(55, 60)">
      <rect width="520" height="230" fill="#27272a" stroke="#f59e0b" stroke-width="1.5" rx="4"/>
      <text x="20" y="30" fill="#fbbf24" font-family="sans-serif" font-size="16" font-weight="bold">ROUGH DRAWING NOTES (草圖註記 - 多處未提供)</text>
      <text x="20" y="65" fill="#e4e4e7" font-family="monospace" font-size="13">1. CONNECTOR: DuPont 2.54mm 3-Pin Housing (型號未標註)</text>
      <text x="20" y="95" fill="#e4e4e7" font-family="monospace" font-size="13">2. TERMINAL: 端子型號未指定 (僅寫 Female Terminal)</text>
      <text x="20" y="125" fill="#e4e4e7" font-family="monospace" font-size="13">3. WIRE: 銅絞線 3C，但「未標註線規 AWG」及「未標註耐溫耐壓」</text>
      <text x="20" y="155" fill="#e4e4e7" font-family="monospace" font-size="13">4. LENGTH: 約 200mm (未標註公差 ±?mm)</text>
      <text x="20" y="185" fill="#e4e4e7" font-family="monospace" font-size="13">5. PROCESSING: 單端打端子，另端散線</text>
      <text x="20" y="215" fill="#f87171" font-family="monospace" font-size="13">6. SPECIAL REQUIREMENTS: 圖面未提供任何安規或測試規範！</text>
    </g>

    <!-- Drawing -->
    <g transform="translate(100, 390)">
      <line x1="80" y1="20" x2="880" y2="20" stroke="#f59e0b" stroke-width="2"/>
      <text x="480" y="12" fill="#fbbf24" font-family="monospace" font-size="18" font-weight="bold" text-anchor="middle">~200 mm (公差未提供)</text>

      <rect x="20" y="50" width="60" height="100" fill="#3f3f46" stroke="#fff" rx="2"/>
      <text x="50" y="80" fill="#fff" font-size="12" text-anchor="middle">DuPont</text>
      <text x="50" y="100" fill="#94a3b8" font-size="9" text-anchor="middle">3P</text>

      <line x1="80" y1="75" x2="880" y2="75" stroke="#ef4444" stroke-width="6"/>
      <line x1="80" y1="100" x2="880" y2="100" stroke="#3b82f6" stroke-width="6"/>
      <line x1="80" y1="125" x2="880" y2="125" stroke="#22c55e" stroke-width="6"/>

      <text x="900" y="105" fill="#f87171" font-family="monospace" font-size="12">未指定剝皮規格</text>
    </g>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

export const SAMPLE_DRAWINGS: SampleDrawing[] = [
  {
    id: 'sample-1',
    name: '範例 1：JST 4-Pin 工控感測線束工程圖',
    subtitle: '完整規格範例 (PHR-4 / SPH-002T / UL1007 24AWG)',
    description: '標準清晰的工控線束圖面，包含完整的連接器、端子、線規、線長公差、脫皮鍍錫加工要求與安規耐壓標準。',
    fileName: 'TR-WH-2024-0418_RevB1_JST_Harness.svg',
    mimeType: 'image/svg+xml',
    dataUrl: createSample1Svg(),
    defaultData: {
      drawingInfo: {
        drawingNumber: 'TR-WH-2024-0418',
        revision: 'B.1',
        customerName: 'Techtronic Robotics Inc.',
        productTitle: '4-Pin JST Sensor Cable Assembly',
        partNumber: 'TR-CBL-4P-150',
        totalQuantity: '5,000 PCS / Lot',
        overallLength: '150mm ± 5mm',
        drawingDate: '2024-11-15'
      },
      items: [
        {
          id: '1',
          connector: 'P1: JST PHR-4 (2.0mm Pitch, 4-Pin, White)',
          terminal: 'JST SPH-002T-P0.5S (磷青銅鍍錫)',
          wire: 'UL1007 PVC 電子線, 300V 80℃',
          wireGauge: '24 AWG',
          wireLength: '150mm ± 5mm',
          quantity: '1 PC (Pin 1)',
          processingRequirement: 'P1 端壓接 SPH-002T 端子插入膠殼；P2 端脫皮 3.0±0.5mm 浸鍍錫',
          specialRequirement: '導通阻抗 < 1.0Ω, 耐壓測試 500V DC 1分鐘, RoHS 2.0, UL94V-0',
          wireColor: '紅色 (Red - VCC)',
          pinout: 'P1-1 to P2 Strip/Tin',
          notes: '見工程註記 1, 2, 4'
        },
        {
          id: '2',
          connector: 'P1: JST PHR-4 (2.0mm Pitch, 4-Pin, White)',
          terminal: 'JST SPH-002T-P0.5S (磷青銅鍍錫)',
          wire: 'UL1007 PVC 電子線, 300V 80℃',
          wireGauge: '24 AWG',
          wireLength: '150mm ± 5mm',
          quantity: '1 PC (Pin 2)',
          processingRequirement: 'P1 端壓接 SPH-002T 端子插入膠殼；P2 端脫皮 3.0±0.5mm 浸鍍錫',
          specialRequirement: '導通阻抗 < 1.0Ω, 耐壓測試 500V DC 1分鐘, RoHS 2.0, UL94V-0',
          wireColor: '黑色 (Black - GND)',
          pinout: 'P1-2 to P2 Strip/Tin',
          notes: '見工程註記 1, 2, 4'
        },
        {
          id: '3',
          connector: 'P1: JST PHR-4 (2.0mm Pitch, 4-Pin, White)',
          terminal: 'JST SPH-002T-P0.5S (磷青銅鍍錫)',
          wire: 'UL1007 PVC 電子線, 300V 80℃',
          wireGauge: '24 AWG',
          wireLength: '150mm ± 5mm',
          quantity: '1 PC (Pin 3)',
          processingRequirement: 'P1 端壓接 SPH-002T 端子插入膠殼；P2 端脫皮 3.0±0.5mm 浸鍍錫',
          specialRequirement: '導通阻抗 < 1.0Ω, 耐壓測試 500V DC 1分鐘, RoHS 2.0, UL94V-0',
          wireColor: '黃色 (Yellow - TXD)',
          pinout: 'P1-3 to P2 Strip/Tin',
          notes: '見工程註記 1, 2, 4'
        },
        {
          id: '4',
          connector: 'P1: JST PHR-4 (2.0mm Pitch, 4-Pin, White)',
          terminal: 'JST SPH-002T-P0.5S (磷青銅鍍錫)',
          wire: 'UL1007 PVC 電子線, 300V 80℃',
          wireGauge: '24 AWG',
          wireLength: '150mm ± 5mm',
          quantity: '1 PC (Pin 4)',
          processingRequirement: 'P1 端壓接 SPH-002T 端子插入膠殼；P2 端脫皮 3.0±0.5mm 浸鍍錫',
          specialRequirement: '導通阻抗 < 1.0Ω, 耐壓測試 500V DC 1分鐘, RoHS 2.0, UL94V-0',
          wireColor: '白色 (White - RXD)',
          pinout: 'P1-4 to P2 Strip/Tin',
          notes: '見工程註記 1, 2, 4'
        }
      ],
      overallProcessingRequirement: '線材總長度 150±5mm。P1 端壓著端子插入 PHR-4 膠殼並確保卡扣定位到位；P2 端剝線 3.0±0.5mm 並浸鍍環保無鉛錫 (Sn99.3/Cu0.7)。每 100 條成捆包裝。',
      overallSpecialRequirement: '100% 進行電氣導通測試與短路檢測；耐壓測試 500V DC / 1 分鐘漏電流 < 0.5mA；端子拉拔力需 ≥ 1.5 kgf；符合 RoHS 2.0、REACH 與 UL94V-0 阻燃等級。',
      clarificationChecklist: [
        '目前圖面規格完整，建議業務與客戶確認 P2 端鍍錫之浸錫深度是否有特殊公差要求。',
        '確認 5,000 PCS 之交期排程與每箱裝箱數量規格。'
      ],
      analysisSummary: '本工程圖面資訊十分完備，BOM 表與技術要求標示清晰無缺漏，可直接進行工時分析與成本核價。'
    }
  },
  {
    id: 'sample-2',
    name: '範例 2：Molex 雙端壓接電源線 (含熱縮管/編織網)',
    subtitle: '雙端壓接加工 (Molex 43025-0200 / 43030-0001 / UL1061 20AWG)',
    description: '展示雙端連接器組裝、高規拉力測試、外覆編織網管及熱縮套管加工規格之完整解析。',
    fileName: 'DPD-CBL-43025-002_RevA_Molex.svg',
    mimeType: 'image/svg+xml',
    dataUrl: createSample2Svg(),
    defaultData: {
      drawingInfo: {
        drawingNumber: 'DPD-CBL-43025-002',
        revision: 'A',
        customerName: 'Delta Power Dynamics',
        productTitle: 'Micro-Fit 3.0 2-Pin DC Power Cable Assembly',
        partNumber: '未提供',
        totalQuantity: '10,000 Sets',
        overallLength: '300mm ± 10mm',
        drawingDate: '未提供'
      },
      items: [
        {
          id: '1',
          connector: 'P1 & P2: Molex 43025-0200 (Micro-Fit 3.0, 2-Pin, Black)',
          terminal: 'Molex 43030-0001 (鍍金端子, 20-24 AWG)',
          wire: 'UL1061 半硬質 PVC 電子線, 300V 80℃',
          wireGauge: '20 AWG',
          wireLength: '300mm ± 10mm',
          quantity: '1 PC (Pin 1)',
          processingRequirement: '雙端壓接 Molex 43030 端子並插殼；線身中段套黑色擴充編織網管 200mm；兩端套熱縮套管 OD 4.0mm x 25mm 收縮固定',
          specialRequirement: '端子保持力拉拔測試 > 5.0 kgf, UL94V-0, RoHS 3.0 合規',
          wireColor: '紅色 (Red - DC+)',
          pinout: 'P1-1 to P2-1 直通',
          notes: '見註記 1, 2, 4, 5'
        },
        {
          id: '2',
          connector: 'P1 & P2: Molex 43025-0200 (Micro-Fit 3.0, 2-Pin, Black)',
          terminal: 'Molex 43030-0001 (鍍金端子, 20-24 AWG)',
          wire: 'UL1061 半硬質 PVC 電子線, 300V 80℃',
          wireGauge: '20 AWG',
          wireLength: '300mm ± 10mm',
          quantity: '1 PC (Pin 2)',
          processingRequirement: '雙端壓接 Molex 43030 端子並插殼；線身中段套黑色擴充編織網管 200mm；兩端套熱縮套管 OD 4.0mm x 25mm 收縮固定',
          specialRequirement: '端子保持力拉拔測試 > 5.0 kgf, UL94V-0, RoHS 3.0 合規',
          wireColor: '黑色 (Black - DC-)',
          pinout: 'P1-2 to P2-2 直通',
          notes: '見註記 1, 2, 4, 5'
        }
      ],
      overallProcessingRequirement: '雙端連接器對插線束。雙端均壓接 Molex 鍍金端子並組裝入 43025-0200 膠殼。中段套 200mm 黑色阻燃編織網管，兩端以 25mm 黑色熱縮套管加熱收縮固定防鬆脫。',
      overallSpecialRequirement: '端子壓接拉拔力須大於 5.0 kgf；耐電壓測試 1000V AC / 1 分鐘；絕緣阻抗 > 100MΩ；UL94V-0 阻燃等級；符合 RoHS 3.0 規範。',
      clarificationChecklist: [
        '客戶料號欄位顯示為「未提供」，建議詢問客戶內部料號以便報價單對應。',
        '圖面繪圖日期「未提供」，建議確認是否為最新核准發行版本。'
      ],
      analysisSummary: '線材與加工工藝定義明確（含編織網管與雙端熱縮套管工序），加工難度中等，端子為鍍金件成本較高，需注意模具刀片適配度。'
    }
  },
  {
    id: 'sample-3',
    name: '範例 3：工業感測傳輸線 (多處標註「未提供」示範)',
    subtitle: '草圖範例 (線規、公差、數量、特殊要求均未提供)',
    description: '此範例特別設計用來展示「如果資料無法從圖面確認，顯示『未提供』，不要自行推測」的嚴格防呆審查功能。',
    fileName: 'DRAFT-0992_Sensor_Wire_Incomplete.svg',
    mimeType: 'image/svg+xml',
    dataUrl: createSample3Svg(),
    defaultData: {
      drawingInfo: {
        drawingNumber: 'DRAFT-0992',
        revision: '未提供',
        customerName: '未提供',
        productTitle: 'Custom Sensor Lead Wire',
        partNumber: '未提供',
        totalQuantity: '未提供',
        overallLength: '約 200mm (未標註公差)',
        drawingDate: '未提供'
      },
      items: [
        {
          id: '1',
          connector: 'DuPont 2.54mm 3-Pin (未註明原廠或相容料號)',
          terminal: '未提供',
          wire: '銅絞線 (未註明 UL 規範或外被材質)',
          wireGauge: '未提供',
          wireLength: '約 200mm (未提供公差)',
          quantity: '未提供',
          processingRequirement: '單端插杜邦膠殼，另一端散線未標剝皮規格',
          specialRequirement: '未提供',
          wireColor: '紅色',
          pinout: 'Pin 1',
          notes: '圖面僅有草圖簡述'
        },
        {
          id: '2',
          connector: 'DuPont 2.54mm 3-Pin (未註明原廠或相容料號)',
          terminal: '未提供',
          wire: '銅絞線 (未註明 UL 規範或外被材質)',
          wireGauge: '未提供',
          wireLength: '約 200mm (未提供公差)',
          quantity: '未提供',
          processingRequirement: '單端插杜邦膠殼，另一端散線未標剝皮規格',
          specialRequirement: '未提供',
          wireColor: '藍色',
          pinout: 'Pin 2',
          notes: '圖面僅有草圖簡述'
        },
        {
          id: '3',
          connector: 'DuPont 2.54mm 3-Pin (未註明原廠或相容料號)',
          terminal: '未提供',
          wire: '銅絞線 (未註明 UL 規範或外被材質)',
          wireGauge: '未提供',
          wireLength: '約 200mm (未提供公差)',
          quantity: '未提供',
          processingRequirement: '單端插杜邦膠殼，另一端散線未標剝皮規格',
          specialRequirement: '未提供',
          wireColor: '綠色',
          pinout: 'Pin 3',
          notes: '圖面僅有草圖簡述'
        }
      ],
      overallProcessingRequirement: '單端壓接杜邦端子並裝配至 3P 膠殼；另一端為散線開口，但圖面未標註開線/脫皮/鍍錫長度規格。',
      overallSpecialRequirement: '未提供',
      clarificationChecklist: [
        '【關鍵缺失】線規 (Wire Gauge)：圖面完全未標註 AWG 數值（建議業務向客戶確認需使用 22 AWG, 24 AWG 或 26 AWG）。',
        '【關鍵缺失】端子料號 (Terminal)：圖面僅註明 Female Terminal，未指定具體廠牌型號或鍍金/鍍錫規格。',
        '【關鍵缺失】線長公差 (Tolerance)：圖面僅寫約 200mm，需確認加工公差（如 ±5mm 或 ±10mm）。',
        '【關鍵缺失】散線端加工規格：圖面未提供脫皮長度 (Strip length) 以及是否需要鍍錫 (Tinning)。',
        '【商業缺失】採購批量 (Quantity)：圖面未提供訂單數量，無法估算材料批量採購折扣與攤提模具工時。',
        '【品質標準】特殊要求與認證：圖面未提供任何安規、阻燃等級 (UL94) 或環保證明 (RoHS) 要求。'
      ],
      analysisSummary: '⚠️ 本張圖面嚴重欠缺核心規格！系統已將所有未明之處如實標記為「未提供」，業務人員應在報價前直接將「待確認清單」發送予客戶進行規格澄清。'
    }
  }
];
