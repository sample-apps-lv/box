import { useQuery } from '@tanstack/react-query';
import { fetchApi, isMockMode } from '@/lib/fetch-api';
import type { Eco, BomVersion } from '@/types/engineering';

const MOCK_ECOS: Eco[] = [
  { id: 'eco-001', eco_number: 'ECO-2026-001', type: 'SUBSTITUTION', product: 'IoT Gateway v2', status: 'APPLIED', original_mpn: 'LM2596', replacement_mpn: 'TPS54360B', reason: 'LM2596 EOL — TPS54360B pin-compatible successor with better efficiency', created_at: '2026-01-15T00:00:00Z', validation_summary: 'All checks pass' },
  { id: 'eco-002', eco_number: 'ECO-2026-002', type: 'DESIGN_FIX', product: 'IoT Gateway v2', status: 'APPLIED', original_mpn: '', replacement_mpn: '', reason: 'Fixed 90° bend on NET_CLK_100 — rerouted with 45° miters', created_at: '2026-02-10T00:00:00Z' },
  { id: 'eco-003', eco_number: 'ECO-2026-003', type: 'SUBSTITUTION', product: 'IoT Gateway v2', status: 'PENDING', original_mpn: 'EIP-10S048', replacement_mpn: 'CUI-VSK-S48-12', reason: 'Stock insufficient — CUI validated as drop-in replacement', created_at: '2026-03-17T00:00:00Z', validation_summary: 'Electrical ✔ Mechanical ✔ Thermal ✔ IPC ✔' },
  { id: 'eco-004', eco_number: 'ECO-2026-004', type: 'COMPONENT_UPGRADE', product: 'IoT Gateway v2', status: 'DRAFT', original_mpn: 'STM32H743VIT6', replacement_mpn: 'STM32H7S3L8H6', reason: 'H7S3 series — pin-compatible, 2x Flash, 35% lower power', created_at: '2026-03-17T00:00:00Z', validation_summary: 'Pending review' },
  { id: 'eco-005', eco_number: 'ECO-2026-005', type: 'COMPLIANCE_FIX', product: 'Motor Controller v3', status: 'PENDING', original_mpn: '', replacement_mpn: '', reason: 'Add REACH declarations for C4, C8, C11 capacitors', created_at: '2026-03-16T00:00:00Z' },
];

export const useEcos = (filters?: { product?: string; type?: string; status?: string }) =>
  useQuery({
    queryKey: ['ecos', filters],
    queryFn: async (): Promise<Eco[]> => {
      if (isMockMode()) {
        let result = MOCK_ECOS;
        if (filters?.product) result = result.filter(e => e.product === filters.product);
        if (filters?.type) result = result.filter(e => e.type === filters.type);
        if (filters?.status) result = result.filter(e => e.status === filters.status);
        return result;
      }
      const params = new URLSearchParams();
      if (filters?.product) params.set('product', filters.product);
      if (filters?.type) params.set('type', filters.type);
      if (filters?.status) params.set('status', filters.status);
      const res = await fetchApi(`/api/v1/engineering/eco?${params}`);
      return res.json();
    },
  });

const MOCK_BOM_VERSIONS: BomVersion[] = [
  { product: 'IoT Gateway v2', revision: 'A', date: '2026-01-10', eco_refs: [], status: 'released' },
  { product: 'IoT Gateway v2', revision: 'B', date: '2026-02-15', eco_refs: ['ECO-2026-001', 'ECO-2026-002'], status: 'released' },
  { product: 'IoT Gateway v2', revision: 'C', date: '', eco_refs: ['ECO-2026-003', 'ECO-2026-004'], status: 'pending' },
];

export const useBomVersions = (product: string) =>
  useQuery({
    queryKey: ['bom-versions', product],
    queryFn: async (): Promise<BomVersion[]> => {
      if (isMockMode()) return MOCK_BOM_VERSIONS.filter(v => v.product === product);
      const res = await fetchApi(`/api/v1/engineering/bom-versions/${encodeURIComponent(product)}`);
      return res.json();
    },
    enabled: !!product,
  });
