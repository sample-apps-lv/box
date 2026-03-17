export type EcoType = 'SUBSTITUTION' | 'COMPONENT_UPGRADE' | 'DESIGN_FIX' | 'COMPLIANCE_FIX';
export type EcoStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'APPLIED' | 'REJECTED';

export interface Eco {
  id: string;
  eco_number: string;
  type: EcoType;
  product: string;
  status: EcoStatus;
  original_mpn: string;
  replacement_mpn: string;
  reason: string;
  created_at: string;
  validation_summary?: string;
}

export interface BomVersion {
  product: string;
  revision: string;
  date: string;
  eco_refs: string[];
  status: 'released' | 'pending';
}
