export interface Pipeline {
  id: string;
  name: string;
  created_at: string;
  runs: PipelineRun[];
}

export interface PipelineRun {
  product: string;
  revision: string;
  planned_qty: number;
  target_date: string;
  coverage_pct: number;
  business_model: string;
  missing_count: number;
}

export interface PipelineMissing {
  mpn: string;
  description: string;
  total_needed: number;
  total_available: number;
  delta: number;
  affected_runs: string[];
}

export interface PipelineSequence {
  order: number;
  product: string;
  rationale: string;
}
