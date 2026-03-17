import { useQuery } from '@tanstack/react-query';
import { fetchApi, isMockMode } from '@/lib/fetch-api';
import type { Pipeline, PipelineMissing, PipelineSequence } from '@/types/pipeline';

const MOCK_PIPELINES: Pipeline[] = [
  {
    id: 'pipe-001',
    name: 'Q2 2026 Production Plan',
    created_at: '2026-03-01T00:00:00Z',
    runs: [
      { product: 'IoT Gateway v2', revision: 'B', planned_qty: 500, target_date: '2026-06-15', coverage_pct: 1.2, business_model: 'PTF', missing_count: 2 },
      { product: 'Motor Controller v3', revision: 'A', planned_qty: 200, target_date: '2026-05-30', coverage_pct: 78.0, business_model: 'PTF', missing_count: 1 },
      { product: 'Sensor Hub Pro', revision: 'C', planned_qty: 1000, target_date: '2026-07-01', coverage_pct: 95.0, business_model: 'BTS', missing_count: 0 },
    ],
  },
];

export const usePipelines = () =>
  useQuery({
    queryKey: ['pipelines'],
    queryFn: async (): Promise<Pipeline[]> => {
      if (isMockMode()) return MOCK_PIPELINES;
      const res = await fetchApi('/api/v1/pipeline');
      return res.json();
    },
    refetchInterval: 60000,
  });

const MOCK_MISSING: PipelineMissing[] = [
  { mpn: 'EIP-10S048', description: '48V DC-DC converter', total_needed: 1000, total_available: 12, delta: 988, affected_runs: ['IoT Gateway v2'] },
  { mpn: 'GRM188R61A106', description: '10µF 10V X5R', total_needed: 1500, total_available: 15000, delta: 0, affected_runs: [] },
];

export const usePipelineMissing = (id: string) =>
  useQuery({
    queryKey: ['pipeline', id, 'missing'],
    queryFn: async (): Promise<PipelineMissing[]> => {
      if (isMockMode()) return MOCK_MISSING;
      const res = await fetchApi(`/api/v1/pipeline/${id}/missing`);
      return res.json();
    },
    enabled: !!id,
  });

const MOCK_SEQUENCE: PipelineSequence[] = [
  { order: 1, product: 'Sensor Hub Pro', rationale: 'Highest coverage — can ship immediately from warehouse stock' },
  { order: 2, product: 'Motor Controller v3', rationale: '78% coverage — source 1 MPN while Sensor Hub ships' },
  { order: 3, product: 'IoT Gateway v2', rationale: 'Lowest coverage — needs 2 MPNs sourced, align with lead times' },
];

export const usePipelineSequence = (id: string) =>
  useQuery({
    queryKey: ['pipeline', id, 'sequence'],
    queryFn: async (): Promise<PipelineSequence[]> => {
      if (isMockMode()) return MOCK_SEQUENCE;
      const res = await fetchApi(`/api/v1/pipeline/${id}/sequence`);
      return res.json();
    },
    enabled: !!id,
  });
