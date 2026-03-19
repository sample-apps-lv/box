export interface ComponentInput {
  ref: string;
  mpn: string;
  manufacturer: string;
  description: string;
  quantity: number;
  category: string;
  approved_alternatives?: string[];
}

export interface DesignParams {
  ipc_class: number;
  board_thickness_mm: number;
  layer_count: number;
  min_trace_width_mm: number;
  min_clearance_mm: number;
  min_drill_dia_mm: number;
  min_annular_ring_mm: number;
  via_in_pad: boolean;
  has_90deg_bends: boolean;
  has_teardrops: boolean;
  has_fiducials: boolean;
  solder_mask_expansion_mm: number;
  surface_finish: string;
  stackup_symmetric: boolean;
  copper_balance_pct: { top: number; bottom: number };
}

export interface AnalysisRequest {
  product: string;
  revision: string;
  target_quantity: number;
  components: ComponentInput[];
  design_params?: DesignParams;
}

export interface TechnicalData {
  max_voltage_v: number;
  package_type: string;
  max_junction_temp_c: number;
  is_active_product: boolean;
  eol_signal: boolean;
  lifecycle_note: string;
}

export interface AlternativeValidation {
  electrical: { voltage_in_compatible: boolean; current_rating_ok: boolean; derating_note: string };
  mechanical: { footprint_match: 'exact' | 'compatible' | 'rework_required'; package_type: string; height_delta_mm: number; height_clearance_ok: boolean; ipc7351_land_pattern_tier: string };
  thermal: { thermal_headroom_c: number; thermal_ok: boolean };
  ipc_impact: { land_pattern_change: boolean; ipc_violations_introduced: string[]; ipc_violations_resolved: string[] };
  reliability: { mtbf_hours: number; field_failure_rate_ppm: number; data_source: string };
}

export interface AlternativePart {
  mpn: string;
  manufacturer: string;
  description: string;
  stock_available: number;
  lead_time_weeks: number;
  unit_price_usd: number;
  compatibility_confidence: number;
  reason: string;
  validation: AlternativeValidation;
  ipc_compliant: boolean;
}

export type ComponentStatus = 'green' | 'yellow' | 'red' | 'unknown' | 'searching';

export interface ComponentAnalysis {
  ref: string;
  mpn: string;
  manufacturer?: string;
  description?: string;
  quantity?: number;
  category?: string;
  status: ComponentStatus;
  stock_available: number;
  unit_price_usd: number;
  lead_time_weeks: number;
  issues: string[];
  alternatives: AlternativePart[];
  recommendation: string;
  sources: string[];
  technical_data?: TechnicalData;
}

export interface IpcRuleResult {
  rule_id: string;
  category: string;
  description: string;
  severity: 'PASS' | 'WARN' | 'FAIL';
  value_found: string;
  limit: string;
  remediation: string;
}

export interface IpcCheckResult {
  ipc_class_requested: number;
  ipc_class_achieved: number;
  ipc_compliance_score: number;
  overall_verdict: string;
  violation_count: { FAIL: number; WARN: number; PASS: number };
  fabrication_note: string;
  conformance_package_checklist: string[];
  rules: IpcRuleResult[];
}

export interface UpgradeComponent {
  ref: string;
  original_mpn: string;
  upgraded_mpn: string;
  manufacturer?: string;
  reason: string;
  stock_available: number;
  lead_time_weeks: number;
  unit_price_delta_usd: number;
  performance_gain: string;
}

export interface UpgradeResult {
  suggested_revision: string;
  upgrade_summary: string;
  bom_cost_usd_before: number;
  bom_cost_usd_after: number;
  max_lead_time_before_weeks: number;
  max_lead_time_after_weeks: number;
  upgraded_components: UpgradeComponent[];
}

export interface HealthCheckResult {
  health_score: number;
  limitations_count: number;
  compliance_gaps: number;
  design_issues_count: number;
  recommendations_count: number;
  limitations: HealthLimitation[];
  compliance_restrictions: ComplianceRestriction[];
  design_issues: DesignIssue[];
  future_recommendations: HealthRecommendation[];
}

export interface HealthLimitation {
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  type: string;
  description: string;
  affected_components: string[];
  remediation: string;
}

export interface ComplianceRestriction {
  standard: string;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'GAP' | 'UNKNOWN';
  detail: string;
  affected_components?: string[];
  recommendation: string;
}

export interface DesignIssue {
  source: 'ipc' | 'technical';
  rule_id?: string;
  severity: 'PASS' | 'WARN' | 'FAIL';
  description: string;
  remediation: string;
}

export interface HealthRecommendation {
  priority: number;
  category: 'design_fix' | 'component_upgrade' | 'compliance' | 'architecture';
  title: string;
  detail: string;
  effort: 'none' | 'low' | 'medium' | 'high';
  eco_reference?: string | null;
}

export interface ProposedEco {
  eco_id: string;
  eco_number: string;
  type: 'SUBSTITUTION' | 'COMPONENT_UPGRADE' | 'DESIGN_FIX' | 'COMPLIANCE_FIX';
  product: string;
  bom_ref: string;
  original_mpn: string;
  replacement_mpn: string;
  reason: string;
  status: string;
}

export type BusinessModel = 'FTF' | 'PTF' | 'BTS' | 'CTO' | 'BTO' | 'ETO' | 'PTS';

export interface BOXReport {
  report_id: string;
  product: string;
  revision: string;
  target_quantity: number;
  generated_at: string;
  recommended_business_model: BusinessModel;
  go_no_go: boolean;
  risk_score: number;
  estimated_bom_cost_usd: number;
  strategic_reasoning: string;
  rationale: string;
  action_items: string[];
  components: ComponentAnalysis[];
  ipc_report?: IpcCheckResult | null;
  version_upgrade?: UpgradeResult | null;
  product_health?: HealthCheckResult | null;
  proposed_ecos?: ProposedEco[];
}
