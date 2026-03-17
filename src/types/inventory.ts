export interface InventoryItem {
  mpn: string;
  description: string;
  warehouse: number;
  in_transit: number;
  on_order: number;
  unit_cost_usd: number;
  location: string;
}

export interface InventoryCoverage {
  product: string;
  qty: number;
  coverage_pct: number;
  buildable_units: number;
  ftf: boolean;
  missing: MissingComponent[];
}

export interface MissingComponent {
  ref: string;
  mpn: string;
  needed: number;
  have: number;
  delta: number;
  alt_mpn?: string;
  alt_stock?: number;
}

export interface CrossBomOpportunity {
  mpn: string;
  surplus_from: string;
  can_supply: string;
  qty_available: number;
}
