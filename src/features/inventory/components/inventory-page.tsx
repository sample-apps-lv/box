import { motion } from 'framer-motion';
import { HudCard } from '@/components/ui/hud-card';
import { HudKpi } from '@/components/ui/hud-kpi';
import { useInventory, useInventoryCoverage, useCrossBom } from '@/features/inventory/api/use-inventory';
import { Warehouse } from 'lucide-react';

const InventoryPage = () => {
  const { data: inventory } = useInventory();
  const { data: coverage } = useInventoryCoverage('IoT Gateway v2', 500);
  const { data: crossBom } = useCrossBom();

  const totalValue = inventory?.reduce((sum, i) => sum + i.warehouse * i.unit_cost_usd, 0) || 0;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Warehouse className="w-5 h-5 text-primary" />
        <h1 className="font-mono text-hud-header text-primary">VIRTUAL_INVENTORY</h1>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <HudKpi value={inventory?.length || 0} label="DISTINCT MPNS" />
        <HudKpi value={`$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} label="TOTAL VALUE" />
        <HudKpi value="6" label="PRODUCTS IN PIPELINE" />
        <HudKpi value={crossBom?.length || 0} label="CROSS-BOM OPPORTUNITIES" />
      </div>

      <div className="grid grid-cols-[1fr_380px] gap-6">
        <div className="flex flex-col gap-6">
          {/* Inventory Table */}
          <HudCard title="INVENTORY_TABLE">
            <div className="overflow-auto scrollbar-hud">
              <table className="w-full font-mono text-hud-data">
                <thead>
                  <tr className="text-muted-foreground text-hud-label border-b border-primary/10">
                    <th className="text-left py-1.5 px-2">MPN</th>
                    <th className="text-left py-1.5 px-2">DESCRIPTION</th>
                    <th className="text-right py-1.5 px-2">WAREHOUSE</th>
                    <th className="text-right py-1.5 px-2">IN-TRANSIT</th>
                    <th className="text-right py-1.5 px-2">ON-ORDER</th>
                    <th className="text-right py-1.5 px-2">UNIT COST</th>
                    <th className="text-left py-1.5 px-2">LOCATION</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory?.map((item) => (
                    <tr key={item.mpn} className="border-b border-primary/5 hover:bg-primary/5">
                      <td className="py-1.5 px-2 text-primary">{item.mpn}</td>
                      <td className="py-1.5 px-2 text-foreground/70">{item.description}</td>
                      <td className="py-1.5 px-2 text-right">{item.warehouse.toLocaleString()}</td>
                      <td className="py-1.5 px-2 text-right text-foreground/60">{item.in_transit.toLocaleString()}</td>
                      <td className="py-1.5 px-2 text-right text-foreground/60">{item.on_order.toLocaleString()}</td>
                      <td className="py-1.5 px-2 text-right">${item.unit_cost_usd.toFixed(2)}</td>
                      <td className="py-1.5 px-2 text-foreground/60">{item.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </HudCard>

          {/* Coverage */}
          {coverage && (
            <HudCard title={`COVERAGE: ${coverage.product}`} status={coverage.coverage_pct < 10 ? 'critical' : 'nominal'}>
              <div className="flex items-center gap-4 mb-4">
                <div>
                  <div className="font-mono text-hud-xl font-bold text-hud-red">{coverage.coverage_pct}%</div>
                  <div className="font-mono text-hud-label text-muted-foreground">COVERAGE</div>
                </div>
                <div className="flex-1 h-3 bg-muted relative">
                  <motion.div
                    className="h-full bg-hud-red"
                    initial={{ width: 0 }}
                    animate={{ width: `${coverage.coverage_pct}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="font-mono text-hud-data text-foreground/60">
                  {coverage.buildable_units} / {coverage.qty} UNITS
                </div>
                <div className={`font-mono text-hud-label px-2 py-0.5 ${coverage.ftf ? 'bg-hud-green/20 text-hud-green' : 'bg-hud-red/20 text-hud-red'}`}>
                  FTF? {coverage.ftf ? 'YES' : 'NO'}
                </div>
              </div>

              {coverage.missing.length > 0 && (
                <div>
                  <div className="font-mono text-hud-label text-hud-red mb-2">MISSING COMPONENTS ({coverage.missing.length})</div>
                  {coverage.missing.map((m) => (
                    <div key={m.ref} className="flex items-center gap-3 font-mono text-hud-data py-1 border-b border-primary/5">
                      <span className="text-primary">{m.ref}</span>
                      <span className="text-foreground/70">{m.mpn}</span>
                      <span className="text-muted-foreground ml-auto">need {m.needed}</span>
                      <span className="text-foreground/60">have {m.have}</span>
                      <span className="text-hud-red">Δ {m.delta}</span>
                      {m.alt_mpn && <span className="text-hud-green text-hud-label">ALT: {m.alt_mpn} ({m.alt_stock})</span>}
                    </div>
                  ))}
                </div>
              )}
            </HudCard>
          )}
        </div>

        {/* Cross-BOM */}
        <div>
          {crossBom && crossBom.length > 0 && (
            <HudCard title="CROSS-BOM_OPPORTUNITIES">
              <div className="space-y-3">
                {crossBom.map((opp, i) => (
                  <div key={i} className="hud-glass border-l-2 border-l-hud-green/30 p-3">
                    <div className="font-mono text-hud-data text-primary mb-1">{opp.mpn}</div>
                    <div className="font-mono text-hud-label text-foreground/60">
                      {opp.surplus_from} → {opp.can_supply}
                    </div>
                    <div className="font-mono text-hud-label text-hud-green mt-1">
                      {opp.qty_available} UNITS AVAILABLE
                    </div>
                  </div>
                ))}
              </div>
            </HudCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
