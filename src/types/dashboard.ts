export interface DashboardSummary {
  total_products: number;
  total_reports: number;
  active_alerts: number;
  avg_risk_score: number;
}

export interface DashboardAlert {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  mpn: string;
  message: string;
  affected_products: string[];
  created_at: string;
}

export interface DashboardProject {
  product: string;
  revision: string;
  last_analysed: string;
  risk_score: number;
  go_no_go: boolean;
  ipc_class_achieved: number;
  health_score: number;
  report_id: string;
}

export interface WatchlistItem {
  mpn: string;
  description: string;
  stock_available: number;
  unit_price_usd: number;
  lead_time_weeks: number;
  trend: number[];
}

export interface IpcSummaryItem {
  product: string;
  pass_rate: number;
  fail_count: number;
}
