import { useQuery } from '@tanstack/react-query';
import { fetchApi, isMockMode } from '@/lib/fetch-api';
import type { InventoryItem, InventoryCoverage, CrossBomOpportunity } from '@/types/inventory';

const MOCK_INVENTORY: InventoryItem[] = [
  { mpn: 'STM32H743VIT6', description: '32-bit MCU, 480MHz, 2MB Flash', warehouse: 320, in_transit: 500, on_order: 1000, unit_cost_usd: 14.22, location: 'BIN-A12' },
  { mpn: 'EIP-10S048', description: '48V DC-DC converter, 10A', warehouse: 12, in_transit: 0, on_order: 0, unit_cost_usd: 38.90, location: 'BIN-C04' },
  { mpn: 'GRM188R61A106', description: '10µF 10V X5R 0603', warehouse: 15000, in_transit: 0, on_order: 0, unit_cost_usd: 0.02, location: 'BIN-D01' },
  { mpn: 'CP2102N', description: 'USB-UART Bridge IC', warehouse: 800, in_transit: 200, on_order: 500, unit_cost_usd: 2.15, location: 'BIN-A08' },
  { mpn: 'TPS54360B', description: '60V 3.5A Step-Down', warehouse: 450, in_transit: 0, on_order: 0, unit_cost_usd: 3.85, location: 'BIN-B02' },
];

export const useInventory = () =>
  useQuery({
    queryKey: ['inventory'],
    queryFn: async (): Promise<InventoryItem[]> => {
      if (isMockMode()) return MOCK_INVENTORY;
      const res = await fetchApi('/api/v1/inventory');
      return res.json();
    },
  });

const MOCK_COVERAGE: InventoryCoverage = {
  product: 'IoT Gateway v2',
  qty: 500,
  coverage_pct: 1.2,
  buildable_units: 6,
  ftf: false,
  missing: [
    { ref: 'U3', mpn: 'EIP-10S048', needed: 500, have: 12, delta: 488, alt_mpn: 'CUI-VSK-S48-12', alt_stock: 2200 },
    { ref: 'C12', mpn: 'GRM188R61A106', needed: 500, have: 0, delta: 500 },
  ],
};

export const useInventoryCoverage = (product: string, qty: number) =>
  useQuery({
    queryKey: ['inventory', 'coverage', product, qty],
    queryFn: async (): Promise<InventoryCoverage> => {
      if (isMockMode()) return MOCK_COVERAGE;
      const res = await fetchApi(`/api/v1/inventory/coverage/${encodeURIComponent(product)}?qty=${qty}`);
      return res.json();
    },
    enabled: !!product,
  });

const MOCK_CROSS_BOM: CrossBomOpportunity[] = [
  { mpn: 'STM32H743VIT6', surplus_from: 'Sensor Hub Pro', can_supply: 'IoT Gateway v2', qty_available: 120 },
  { mpn: 'TPS54360B', surplus_from: 'Motor Controller v3', can_supply: 'Power Distribution Unit', qty_available: 85 },
];

export const useCrossBom = () =>
  useQuery({
    queryKey: ['inventory', 'cross-bom'],
    queryFn: async (): Promise<CrossBomOpportunity[]> => {
      if (isMockMode()) return MOCK_CROSS_BOM;
      const res = await fetchApi('/api/v1/inventory/cross-bom');
      return res.json();
    },
  });
