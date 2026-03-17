import { useState } from 'react';
import { motion } from 'framer-motion';
import { HudCard } from '@/components/ui/hud-card';
import { useEcos, useBomVersions } from '@/features/engineering/api/use-engineering';
import type { EcoStatus, EcoType } from '@/types/engineering';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STATUS_COLORS: Record<EcoStatus, string> = {
  DRAFT: 'text-muted-foreground bg-muted/30',
  PENDING: 'text-hud-amber bg-hud-amber/10',
  APPROVED: 'text-hud-green bg-hud-green/10',
  APPLIED: 'text-primary bg-primary/10',
  REJECTED: 'text-hud-red bg-hud-red/10',
};

const EngineeringPage = () => {
  const [filterProduct, setFilterProduct] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [expandedEco, setExpandedEco] = useState<string | null>(null);

  const { data: ecos } = useEcos({
    product: filterProduct || undefined,
    type: filterType || undefined,
    status: filterStatus || undefined,
  });
  const { data: bomVersions } = useBomVersions('IoT Gateway v2');

  const types: EcoType[] = ['SUBSTITUTION', 'COMPONENT_UPGRADE', 'DESIGN_FIX', 'COMPLIANCE_FIX'];
  const statuses: EcoStatus[] = ['DRAFT', 'PENDING', 'APPROVED', 'APPLIED', 'REJECTED'];

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-5 h-5 text-primary" />
        <h1 className="font-mono text-hud-header text-primary">ENGINEERING_ECO_LOG</h1>
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-6">
        <div className="flex flex-col gap-6">
          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-muted/30 border border-primary/20 text-foreground font-mono text-hud-label px-2 py-1 outline-none"
            >
              <option value="">ALL TYPES</option>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-muted/30 border border-primary/20 text-foreground font-mono text-hud-label px-2 py-1 outline-none"
            >
              <option value="">ALL STATUSES</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* ECO Table */}
          <HudCard title="ECO_LIST">
            <div className="space-y-1">
              {ecos?.map((eco) => (
                <div key={eco.id}>
                  <div
                    onClick={() => setExpandedEco(expandedEco === eco.id ? null : eco.id)}
                    className="flex items-center gap-3 font-mono text-hud-data py-2 px-2 hover:bg-primary/5 cursor-pointer border-b border-primary/5"
                  >
                    <span className="text-primary font-bold w-28">{eco.eco_number}</span>
                    <span className="text-hud-label text-foreground/60 w-36">{eco.type}</span>
                    <span className="text-foreground/70 flex-1">{eco.product}</span>
                    <span className={`text-hud-label px-1.5 py-0.5 ${STATUS_COLORS[eco.status]}`}>{eco.status}</span>
                    {expandedEco === eco.id ? <ChevronUp className="w-3 h-3 text-primary" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />}
                  </div>

                  {expandedEco === eco.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-primary/5 p-4 border-b border-primary/10"
                    >
                      {eco.original_mpn && (
                        <div className="flex items-center gap-3 mb-2 font-mono text-hud-data">
                          <span className="text-muted-foreground">{eco.original_mpn}</span>
                          <span className="text-primary">➜</span>
                          <span className="text-hud-green">{eco.replacement_mpn}</span>
                        </div>
                      )}
                      <div className="font-mono text-hud-data text-foreground/70 mb-2">{eco.reason}</div>
                      {eco.validation_summary && (
                        <div className="font-mono text-hud-label text-primary/70 mb-3">{eco.validation_summary}</div>
                      )}
                      {(eco.status === 'PENDING' || eco.status === 'DRAFT') && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="font-mono text-hud-label border-hud-green/30 text-hud-green hover:bg-hud-green/10">APPROVE</Button>
                          <Button size="sm" variant="outline" className="font-mono text-hud-label border-hud-red/30 text-hud-red hover:bg-hud-red/10">REJECT</Button>
                          {eco.status === 'PENDING' && (
                            <Button size="sm" variant="outline" className="font-mono text-hud-label border-primary/30 text-primary hover:bg-primary/10">APPLY</Button>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </HudCard>
        </div>

        {/* BOM Versions */}
        <div>
          <HudCard title="BOM_VERSIONS">
            <div className="font-mono text-hud-data text-primary mb-3">IOT GATEWAY V2</div>
            <div className="space-y-2">
              {bomVersions?.map((v) => (
                <div key={v.revision} className="border-l-2 border-l-primary/20 pl-3">
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-bold">{v.revision}</span>
                    <span className="text-foreground/60 text-hud-label">{v.date || 'pending'}</span>
                    {v.status === 'pending' && <span className="text-hud-amber text-hud-label">PENDING</span>}
                  </div>
                  {v.eco_refs.length > 0 && (
                    <div className="text-hud-label text-muted-foreground mt-0.5">
                      {v.eco_refs.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </HudCard>
        </div>
      </div>
    </div>
  );
};

export default EngineeringPage;
