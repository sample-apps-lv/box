import { useQuery } from '@tanstack/react-query';
import { fetchApi, isMockMode } from '@/lib/fetch-api';
import type { BOXReport } from '@/types/analysis';

const MOCK_REPORT: BOXReport = {
  report_id: '3f8a2b1c-4d5e-6f7a-8b9c-0d1e2f3a4b5c',
  product: 'IoT Gateway v2',
  revision: 'B',
  target_quantity: 500,
  generated_at: '2026-03-17T10:22:00Z',
  recommended_business_model: 'BTO',
  go_no_go: false,
  risk_score: 74,
  estimated_bom_cost_usd: 184.50,
  strategic_reasoning: 'Two components show extended lead times exceeding the 12-week threshold. U3 (EIP-10S048) has only 40 units available against a 500-unit requirement. The IPC Class 3 validation reveals an annular ring violation that blocks certification.',
  rationale: 'Two components (U3, C12) show lead times >14 weeks. IPC Class 3 violation on annular ring. Recommend BTO with validated alternatives.',
  action_items: [
    'Validate EIP-10S048 alternative CUI VSK-S48-12 before committing to BTO',
    'Request buffer stock quote from Arrow for STM32H743VIT6',
    'Fix annular ring violation — increase pad diameter by 0.02mm',
    'Get REACH declarations for C4, C8, C11',
  ],
  components: [
    {
      ref: 'U1', mpn: 'STM32H743VIT6', manufacturer: 'STMicroelectronics', description: '32-bit MCU, 480MHz, 2MB Flash',
      status: 'green', stock_available: 12400, unit_price_usd: 14.22, lead_time_weeks: 4,
      issues: [], alternatives: [], recommendation: 'Adequate stock. No action needed.', sources: ['https://www.digikey.com/stm32h743'],
    },
    {
      ref: 'U3', mpn: 'EIP-10S048', manufacturer: 'Bel Fuse', description: '48V DC-DC converter, 10A',
      status: 'red', stock_available: 40, unit_price_usd: 38.90, lead_time_weeks: 18,
      issues: ['Stock insufficient for 500-unit run (need 500, found 40)', 'Lead time 18 weeks exceeds 12-week threshold'],
      alternatives: [{
        mpn: 'CUI-VSK-S48-12', manufacturer: 'CUI Inc.', description: '48V DC-DC, 12A, same footprint',
        stock_available: 2200, lead_time_weeks: 3, unit_price_usd: 36.10, compatibility_confidence: 0.97,
        reason: 'Same footprint, 20% higher current headroom, thermally validated',
        validation: {
          electrical: { voltage_in_compatible: true, current_rating_ok: true, derating_note: '12A vs 10A — positive headroom' },
          mechanical: { footprint_match: 'exact', height_delta_mm: 0.2, height_clearance_ok: true, ipc7351_land_pattern_tier: 'Level A' },
          thermal: { thermal_headroom_c: 43, thermal_ok: true },
          ipc_impact: { land_pattern_change: false, ipc_violations_introduced: [], ipc_violations_resolved: [] },
          reliability: { mtbf_hours: 100000, field_failure_rate_ppm: 120 },
        },
        ipc_compliant: true,
      }],
      recommendation: 'Switch to CUI-VSK-S48-12. Validate thermally before commit.',
      sources: ['https://www.digikey.com/eip10s048', 'https://www.mouser.com/belfuse'],
    },
    {
      ref: 'C1', mpn: 'GRM188R61A106', manufacturer: 'Murata', description: '10µF 10V X5R 0603',
      status: 'green', stock_available: 85000, unit_price_usd: 0.02, lead_time_weeks: 2,
      issues: [], alternatives: [], recommendation: 'Commodity part. Ample stock.', sources: [],
    },
    {
      ref: 'U5', mpn: 'CP2102N', manufacturer: 'Silicon Labs', description: 'USB-UART Bridge IC',
      status: 'yellow', stock_available: 8500, unit_price_usd: 2.15, lead_time_weeks: 6,
      issues: ['EOL notice published — successor available'],
      alternatives: [], recommendation: 'Plan migration to CP2102N-A02.', sources: [],
    },
    {
      ref: 'U2', mpn: 'TPS54360B', manufacturer: 'Texas Instruments', description: '60V 3.5A Step-Down Converter',
      status: 'green', stock_available: 4500, unit_price_usd: 3.85, lead_time_weeks: 3,
      issues: [], alternatives: [], recommendation: 'No issues detected.', sources: [],
    },
    {
      ref: 'R1', mpn: 'RC0603FR-0710KL', manufacturer: 'Yageo', description: '10kΩ 0603 1%',
      status: 'green', stock_available: 500000, unit_price_usd: 0.001, lead_time_weeks: 1,
      issues: [], alternatives: [], recommendation: 'Commodity part.', sources: [],
    },
    {
      ref: 'Y1', mpn: 'ABM8-25.000MHZ', manufacturer: 'Abracon', description: '25MHz Crystal',
      status: 'green', stock_available: 12000, unit_price_usd: 0.45, lead_time_weeks: 4,
      issues: [], alternatives: [], recommendation: 'Adequate stock.', sources: [],
    },
    {
      ref: 'J1', mpn: 'USB4105-GF-A', manufacturer: 'GCT', description: 'USB-C Connector',
      status: 'green', stock_available: 28000, unit_price_usd: 0.68, lead_time_weeks: 3,
      issues: [], alternatives: [], recommendation: 'Adequate stock.', sources: [],
    },
  ],
  ipc: {
    ipc_class_requested: 3,
    ipc_class_achieved: 2,
    ipc_compliance_score: 71,
    overall_verdict: 'FAIL',
    violation_count: { FAIL: 1, WARN: 1, PASS: 18 },
    fabrication_note: 'GENERAL FABRICATION NOTES (IPC CLASS 3):\n1. Board material: FR-4 TG170 minimum\n2. Surface finish: ENIG (3-5µin Au, 100-200µin Ni)\n3. Copper weight: 1oz inner, 1oz outer\n4. Impedance tolerance: ±10%\n5. Solder mask: LPI, both sides\n6. Silkscreen: White, non-conductive, both sides\n7. Minimum annular ring: 0.05mm (Class 3 requirement)\n8. E-test: 100% net continuity required',
    conformance_package_checklist: ['Microsection Report', 'Certificate of Conformance', 'Solderability Report', 'Ionic Contamination Test', 'E-Test Report'],
    rules: [
      { rule_id: 'IPC-6012-3.1', category: 'Drill & Via', description: 'Annular ring below Class 3 minimum', severity: 'FAIL', value_found: '0.04mm', limit: '0.05mm', remediation: 'Increase pad diameter by 0.02mm or reduce drill size' },
      { rule_id: 'IPC-2221-6.1', category: 'Trace & Space', description: '90° bend on NET_CLK_100', severity: 'WARN', value_found: '90°', limit: '45°', remediation: 'Reroute with 45° miters or curved traces' },
      { rule_id: 'IPC-2221-6.2', category: 'Trace & Space', description: 'Trace width minimum', severity: 'PASS', value_found: '0.15mm', limit: '0.10mm', remediation: '' },
      { rule_id: 'IPC-2221-6.3', category: 'Trace & Space', description: 'Clearance minimum', severity: 'PASS', value_found: '0.15mm', limit: '0.10mm', remediation: '' },
      { rule_id: 'IPC-6012-4.1', category: 'Drill & Via', description: 'Via aspect ratio', severity: 'PASS', value_found: '8:1', limit: '10:1', remediation: '' },
      { rule_id: 'IPC-6012-4.2', category: 'Drill & Via', description: 'Minimum drill diameter', severity: 'PASS', value_found: '0.20mm', limit: '0.15mm', remediation: '' },
      { rule_id: 'IPC-2221-7.1', category: 'Surface & Finish', description: 'Solder mask expansion', severity: 'PASS', value_found: '0.05mm', limit: '0.05mm', remediation: '' },
      { rule_id: 'IPC-2221-7.2', category: 'Surface & Finish', description: 'Surface finish compatibility', severity: 'PASS', value_found: 'ENIG', limit: 'ENIG/HASL/OSP', remediation: '' },
      { rule_id: 'IPC-6012-5.1', category: 'Board Structure', description: 'Stackup symmetry', severity: 'PASS', value_found: 'symmetric', limit: 'symmetric', remediation: '' },
      { rule_id: 'IPC-6012-5.2', category: 'Board Structure', description: 'Board thickness tolerance', severity: 'PASS', value_found: '1.6mm', limit: '1.6±0.16mm', remediation: '' },
      { rule_id: 'IPC-6012-5.3', category: 'Board Structure', description: 'Copper balance', severity: 'PASS', value_found: '48/52%', limit: '<60/40%', remediation: '' },
      { rule_id: 'IPC-A-610-1.1', category: 'Assembly', description: 'Fiducial markers present', severity: 'PASS', value_found: 'yes', limit: 'required', remediation: '' },
      { rule_id: 'IPC-A-610-1.2', category: 'Assembly', description: 'Teardrops on vias', severity: 'PASS', value_found: 'yes', limit: 'recommended', remediation: '' },
      { rule_id: 'IPC-2221-8.1', category: 'Thermal', description: 'Via in pad', severity: 'PASS', value_found: 'no', limit: 'no (unless capped)', remediation: '' },
      { rule_id: 'IPC-2221-8.2', category: 'Thermal', description: 'Thermal relief pattern', severity: 'PASS', value_found: 'present', limit: 'required', remediation: '' },
      { rule_id: 'IPC-6012-6.1', category: 'Electrical', description: 'Impedance control', severity: 'PASS', value_found: '±8%', limit: '±10%', remediation: '' },
      { rule_id: 'IPC-6012-6.2', category: 'Electrical', description: 'Dielectric spacing', severity: 'PASS', value_found: '0.10mm', limit: '0.08mm', remediation: '' },
      { rule_id: 'IPC-6012-7.1', category: 'Reliability', description: 'Plating thickness in barrel', severity: 'PASS', value_found: '25µm', limit: '25µm', remediation: '' },
      { rule_id: 'IPC-6012-7.2', category: 'Reliability', description: 'Copper plating voiding', severity: 'PASS', value_found: '0%', limit: '<5%', remediation: '' },
      { rule_id: 'IPC-6012-7.3', category: 'Reliability', description: 'Ionic contamination', severity: 'PASS', value_found: '0.8µg/cm²', limit: '<1.56µg/cm²', remediation: '' },
    ],
  },
  upgrade: {
    suggested_revision: 'Rev C',
    upgrade_summary: '3 of 8 components upgraded. Rev C cuts BOM cost 8.4% and lead time from 18 to 4 weeks.',
    bom_cost_usd_before: 184.50,
    bom_cost_usd_after: 169.05,
    max_lead_time_before_weeks: 18,
    max_lead_time_after_weeks: 4,
    upgrades: [
      { ref: 'U1', original_mpn: 'STM32H743VIT6', upgraded_mpn: 'STM32H7S3L8H6', reason: 'H7S3 series: pin-compatible successor, 2x Flash, 35% lower power', stock_available: 25000, lead_time_weeks: 2, unit_price_delta_usd: 1.50, performance_gain: '35% lower power, built-in crypto accelerator' },
      { ref: 'U3', original_mpn: 'EIP-10S048', upgraded_mpn: 'CUI-VSK-S48-12', reason: 'Stock-validated alternative, 20% higher current headroom', stock_available: 2200, lead_time_weeks: 3, unit_price_delta_usd: -2.80, performance_gain: '20% current headroom, same footprint' },
      { ref: 'U5', original_mpn: 'CP2102N', upgraded_mpn: 'CP2102N-A02', reason: 'Direct successor, same footprint, extended lifecycle', stock_available: 15000, lead_time_weeks: 4, unit_price_delta_usd: 0.10, performance_gain: 'Extended manufacturer support' },
    ],
  },
  health: {
    health_score: 54,
    limitations_count: 2,
    compliance_gaps: 1,
    design_issues_count: 2,
    recommendations_count: 4,
    limitations: [
      { severity: 'HIGH', type: 'single_source', description: 'Single-source: U3 (EIP-10S048) — only Bel Fuse manufactures this part', affected_components: ['EIP-10S048'], remediation: 'Qualify CUI-VSK-S48-12 as second source via ECO-2026-003' },
      { severity: 'MEDIUM', type: 'eol_risk', description: 'EOL risk: U5 (CP2102N) — end-of-life notice published by Silicon Labs', affected_components: ['CP2102N'], remediation: 'Migrate to CP2102N-A02 successor' },
    ],
    compliance_restrictions: [
      { standard: 'RoHS 3', status: 'COMPLIANT', detail: 'All components RoHS 3 compliant', action: '' },
      { standard: 'REACH SVHC', status: 'UNKNOWN', detail: '3 components (C4, C8, C11) have no REACH declaration on file', action: 'Request SVHC declarations from suppliers' },
      { standard: 'CE EMC', status: 'GAP', detail: 'No EMC test report on file for current revision', action: 'Schedule EMC pre-compliance test' },
      { standard: 'UL 62368-1', status: 'COMPLIANT', detail: 'Product safety certification current', action: '' },
      { standard: 'IPC-A-610 Class 3', status: 'NON_COMPLIANT', detail: 'Annular ring violation blocks Class 3 certification', action: 'Fix annular ring per ECO recommendation' },
    ],
    design_issues: [
      { source: 'ipc', severity: 'FAIL', description: 'Annular ring 0.04mm below Class 3 minimum 0.05mm', remediation: 'Increase pad diameter by 0.02mm' },
      { source: 'ipc', severity: 'WARN', description: '90° bend on NET_CLK_100 — signal integrity risk at >100MHz', remediation: 'Reroute with 45° miters' },
    ],
    recommendations: [
      { priority: 1, category: 'design_fix', effort: 'low', description: 'Fix annular ring (IPC Class 3 blocker)', eco_ref: undefined },
      { priority: 2, category: 'component_upgrade', effort: 'medium', description: 'Migrate U1 → STM32H7S3 (lifecycle improvement)', eco_ref: 'ECO-2026-004' },
      { priority: 3, category: 'compliance', effort: 'low', description: 'Get REACH declarations for C4, C8, C11', eco_ref: 'ECO-2026-005' },
      { priority: 4, category: 'architecture', effort: 'medium', description: 'Dual-source U3 via ECO-2026-003', eco_ref: 'ECO-2026-003' },
    ],
  },
};

export const useReport = (reportId: string) =>
  useQuery({
    queryKey: ['report', reportId],
    queryFn: async (): Promise<BOXReport> => {
      if (isMockMode()) return MOCK_REPORT;

      // Check localStorage cache first (populated by SSE stream)
      const cached = localStorage.getItem(`box_report_${reportId}`);
      if (cached) {
        try {
          return JSON.parse(cached) as BOXReport;
        } catch { /* fall through to API */ }
      }

      const res = await fetchApi(`/api/v1/report/${reportId}`);
      if (!res.ok) throw new Error(`Report fetch failed: ${res.status}`);
      return res.json();
    },
    enabled: !!reportId,
  });

export const getMockReport = () => MOCK_REPORT;
