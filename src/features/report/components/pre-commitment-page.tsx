import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HudCard } from '@/components/ui/hud-card';
import { HudKpi } from '@/components/ui/hud-kpi';
import { StatusBadge, SeverityBadge } from '@/components/ui/status-badge';
import { ScoreGauge } from '@/components/ui/score-gauge';
import { useReport } from '@/features/analyse/api/use-report';
import { Button } from '@/components/ui/button';
import { Copy, Download, FileText, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import type { BusinessModel, ComponentAnalysis } from '@/types/analysis';
import { toast } from 'sonner';

const MODEL_LABELS: Record<BusinessModel, { label: string; desc: string }> = {
  FTF: { label: 'FULFILL TO FLOOR', desc: 'Full run covered by warehouse stock' },
  PTF: { label: 'PARTIAL TO FLOOR', desc: 'Some units ready from warehouse' },
  BTS: { label: 'BUILD TO STOCK', desc: 'All parts available from distributors' },
  CTO: { label: 'CONFIGURE TO ORDER', desc: 'Build on customer configuration' },
  BTO: { label: 'BUILD TO ORDER', desc: 'Source on demand per order' },
  ETO: { label: 'ENGINEER TO ORDER', desc: 'Design change required' },
  PTS: { label: 'PICK TO SHIP', desc: 'Pre-built stock ready' },
};

const PreCommitmentPage = () => {
  const { reportId } = useParams();
  const { data: report, isLoading } = useReport(reportId || '');
  const [activeTab, setActiveTab] = useState(0);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  if (isLoading || !report) {
    return (
      <div className="flex items-center justify-center h-64 font-mono text-primary animate-hud-pulse">
        LOADING_REPORT...
      </div>
    );
  }

  const tabs = ['COMPONENTS', 'IPC_COMPLIANCE', 'VERSION_UPGRADE', 'PRODUCT_HEALTH'];

  return (
    <div className="p-6">
      {/* Verdict Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="hud-glass border-l-2 border-l-primary/50 p-4 mb-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-mono text-hud-header text-primary mb-1">
              {report.product} · Rev {report.revision} · {report.target_quantity} UNITS
            </h1>
            <div className="flex items-center gap-6 mt-3">
              {/* Business Model Badge */}
              <div className="px-3 py-1.5 bg-primary/10 border border-primary/30">
                <div className="font-mono text-hud-label text-muted-foreground">RECOMMENDED MODEL</div>
                <div className="font-mono text-hud-data text-primary font-bold">{report.recommended_business_model}</div>
                <div className="font-mono text-[9px] text-muted-foreground mt-0.5">
                  {MODEL_LABELS[report.recommended_business_model]?.desc}
                </div>
              </div>
              {/* Decision */}
              <div className={`px-3 py-1.5 border ${report.go_no_go ? 'bg-hud-green/10 border-hud-green/30' : 'bg-hud-red/10 border-hud-red/30'}`}>
                <div className="font-mono text-hud-label text-muted-foreground">DECISION</div>
                <div className={`font-mono text-hud-data font-bold ${report.go_no_go ? 'text-hud-green' : 'text-hud-red'}`}>
                  {report.go_no_go ? '✔ GO' : '⚠ NO-GO'}
                </div>
                {!report.go_no_go && report.ipc && (
                  <div className="font-mono text-[9px] text-hud-red mt-0.5">IPC CLASS 3 VIOLATION</div>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <ScoreGauge score={report.risk_score} label="RISK" />
            {report.ipc && <ScoreGauge score={report.ipc.ipc_compliance_score} label="IPC" />}
            {report.health && <ScoreGauge score={report.health.health_score} label="HEALTH" />}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          <HudKpi value={`$${report.estimated_bom_cost_usd.toFixed(2)}`} label="BOM COST / UNIT" />
          <HudKpi
            value={`$${(report.estimated_bom_cost_usd * report.target_quantity).toLocaleString()}`}
            label="TOTAL COST"
          />
          <HudKpi
            value={report.ipc ? `Class ${report.ipc.ipc_class_achieved}` : '—'}
            label="IPC ACHIEVED"
            status={report.ipc?.overall_verdict === 'FAIL' ? 'critical' : 'nominal'}
          />
          <HudKpi value={report.components.filter(c => c.status === 'red').length} label="CRITICAL PARTS" status={report.components.some(c => c.status === 'red') ? 'critical' : 'nominal'} />
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-0.5 mb-4">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 font-mono text-hud-label uppercase tracking-[0.15em] transition-colors ${
              activeTab === i
                ? 'text-primary bg-primary/10 border-b-2 border-primary/50'
                : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 0 && <ComponentsTab components={report.components} expandedRow={expandedRow} setExpandedRow={setExpandedRow} />}
      {activeTab === 1 && report.ipc && <IpcTab ipc={report.ipc} />}
      {activeTab === 2 && report.upgrade && <UpgradeTab upgrade={report.upgrade} />}
      {activeTab === 3 && report.health && <HealthTab health={report.health} />}

      {/* Action Items */}
      <HudCard title="ACTION_ITEMS" className="mt-6">
        <div className="space-y-2">
          {report.action_items.map((item, i) => (
            <div key={i} className="flex items-start gap-3 font-mono text-hud-data">
              <span className="text-primary font-bold">{i + 1}.</span>
              <span className="text-foreground/80">{item}</span>
            </div>
          ))}
        </div>
      </HudCard>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <Link to={`/report/${reportId}/export`}>
          <Button variant="outline" className="font-mono text-hud-label uppercase tracking-[0.15em] border-primary/30 text-primary hover:bg-primary/10 gap-2">
            <Download className="w-3 h-3" /> EXPORT REPORT
          </Button>
        </Link>
        <Link to="/analyse">
          <Button variant="outline" className="font-mono text-hud-label uppercase tracking-[0.15em] border-primary/30 text-primary hover:bg-primary/10 gap-2">
            RE-ANALYSE
          </Button>
        </Link>
        <Button
          variant="outline"
          className="font-mono text-hud-label uppercase tracking-[0.15em] border-primary/30 text-primary hover:bg-primary/10 gap-2"
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/report/${reportId}`);
            toast.success('Link copied to clipboard');
          }}
        >
          <Copy className="w-3 h-3" /> SHARE
        </Button>
      </div>
    </div>
  );
};

const ComponentsTab = ({ components, expandedRow, setExpandedRow }: { components: ComponentAnalysis[]; expandedRow: string | null; setExpandedRow: (r: string | null) => void }) => (
  <HudCard title="COMPONENT_ANALYSIS">
    <table className="w-full font-mono text-hud-data">
      <thead>
        <tr className="text-muted-foreground text-hud-label border-b border-primary/10">
          <th className="text-left py-1.5 px-2">REF</th>
          <th className="text-left py-1.5 px-2">MPN</th>
          <th className="text-left py-1.5 px-2">STATUS</th>
          <th className="text-right py-1.5 px-2">STOCK</th>
          <th className="text-right py-1.5 px-2">LT(WK)</th>
          <th className="text-right py-1.5 px-2">PRICE</th>
          <th className="w-6"></th>
        </tr>
      </thead>
      <tbody>
        {components.map((comp) => (
          <>
            <tr
              key={comp.ref}
              onClick={() => setExpandedRow(expandedRow === comp.ref ? null : comp.ref)}
              className={`border-b border-primary/5 cursor-pointer hover:bg-primary/5 ${comp.status === 'red' ? 'bg-hud-red/5' : ''}`}
            >
              <td className="py-1.5 px-2 text-primary">{comp.ref}</td>
              <td className="py-1.5 px-2 text-foreground/80">{comp.mpn}</td>
              <td className="py-1.5 px-2"><StatusBadge status={comp.status} /></td>
              <td className="py-1.5 px-2 text-right">{comp.stock_available.toLocaleString()}</td>
              <td className="py-1.5 px-2 text-right">{comp.lead_time_weeks}</td>
              <td className="py-1.5 px-2 text-right">${comp.unit_price_usd.toFixed(2)}</td>
              <td className="py-1.5 px-2">
                {(comp.issues.length > 0 || comp.alternatives.length > 0) && (
                  expandedRow === comp.ref ? <ChevronUp className="w-3 h-3 text-primary" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />
                )}
              </td>
            </tr>
            {expandedRow === comp.ref && comp.issues.length > 0 && (
              <tr key={`${comp.ref}-detail`}>
                <td colSpan={7} className="p-4 bg-primary/5">
                  {comp.issues.length > 0 && (
                    <div className="mb-3">
                      <div className="font-mono text-hud-label text-hud-red mb-1">ISSUES</div>
                      {comp.issues.map((issue, i) => (
                        <div key={i} className="text-foreground/70 text-hud-data">• {issue}</div>
                      ))}
                    </div>
                  )}
                  {comp.alternatives.map((alt) => (
                    <div key={alt.mpn} className="hud-glass border-l-2 border-l-hud-green/50 p-3 mt-2">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-hud-green font-bold">{alt.mpn}</span>
                          <span className="text-muted-foreground ml-2">{alt.manufacturer}</span>
                        </div>
                        <span className="text-primary font-mono text-hud-label">COMPATIBILITY: {Math.round(alt.compatibility_confidence * 100)}%</span>
                      </div>
                      <div className="flex gap-4 font-mono text-hud-data text-foreground/70 mb-2">
                        <span>STOCK: {alt.stock_available.toLocaleString()}</span>
                        <span>LEAD: {alt.lead_time_weeks}wk</span>
                        <span>${alt.unit_price_usd.toFixed(2)}</span>
                      </div>
                      <div className="grid grid-cols-5 gap-2 text-hud-label">
                        <div className="text-hud-green">✔ ELECTRICAL</div>
                        <div className="text-hud-green">✔ MECHANICAL</div>
                        <div className="text-hud-green">✔ THERMAL</div>
                        <div className="text-hud-green">✔ IPC</div>
                        <div className="text-hud-green">✔ RELIABILITY</div>
                      </div>
                    </div>
                  ))}
                  {comp.recommendation && (
                    <div className="mt-2 text-hud-data text-foreground/60">
                      <span className="text-primary">REC:</span> {comp.recommendation}
                    </div>
                  )}
                </td>
              </tr>
            )}
          </>
        ))}
      </tbody>
    </table>
  </HudCard>
);

const IpcTab = ({ ipc }: { ipc: NonNullable<import('@/types/analysis').BOXReport['ipc']> }) => {
  const grouped = ipc.rules.reduce<Record<string, typeof ipc.rules>>((acc, r) => {
    (acc[r.category] = acc[r.category] || []).push(r);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <HudCard title={`IPC CLASS ${ipc.ipc_class_requested} COMPLIANCE`}>
        <div className="flex items-center gap-6 mb-4">
          <ScoreGauge score={ipc.ipc_compliance_score} label="SCORE" />
          <div className="space-y-1">
            <div className={`font-mono text-hud-data font-bold ${ipc.overall_verdict === 'FAIL' ? 'text-hud-red' : 'text-hud-green'}`}>
              {ipc.overall_verdict === 'FAIL' ? '✖ CLASS 3 NON-COMPLIANT' : '✔ COMPLIANT'}
            </div>
            <div className="font-mono text-hud-label text-muted-foreground">
              FAIL: {ipc.violation_count.FAIL} · WARN: {ipc.violation_count.WARN} · PASS: {ipc.violation_count.PASS}
            </div>
          </div>
        </div>

        {Object.entries(grouped).map(([cat, rules]) => (
          <div key={cat} className="mb-3">
            <div className="font-mono text-hud-label text-primary/70 mb-1 uppercase">{cat}</div>
            {rules.map((rule) => (
              <div key={rule.rule_id} className="flex items-start gap-3 py-1 font-mono text-hud-data">
                <SeverityBadge severity={rule.severity} />
                <span className="text-muted-foreground">{rule.rule_id}</span>
                <span className="text-foreground/80 flex-1">{rule.description}</span>
                {rule.severity === 'FAIL' && (
                  <span className="text-hud-red text-hud-label">{rule.value_found} / {rule.limit}</span>
                )}
              </div>
            ))}
            {rules.some(r => r.severity === 'FAIL' && r.remediation) && (
              <div className="ml-16 mt-1 text-hud-data text-hud-amber">
                FIX: {rules.find(r => r.severity === 'FAIL')!.remediation}
              </div>
            )}
          </div>
        ))}
      </HudCard>

      <HudCard title="FABRICATION_NOTE">
        <div className="relative">
          <Button
            size="sm"
            variant="outline"
            className="absolute top-0 right-0 font-mono text-hud-label border-primary/30 text-primary hover:bg-primary/10 gap-1"
            onClick={() => {
              navigator.clipboard.writeText(ipc.fabrication_note);
              toast.success('Fabrication note copied');
            }}
          >
            <Copy className="w-3 h-3" /> COPY
          </Button>
          <pre className="font-mono text-hud-data text-foreground/70 whitespace-pre-wrap pr-20">{ipc.fabrication_note}</pre>
        </div>
      </HudCard>
    </div>
  );
};

const UpgradeTab = ({ upgrade }: { upgrade: NonNullable<import('@/types/analysis').BOXReport['upgrade']> }) => (
  <div className="space-y-4">
    <HudCard title="VERSION_UPGRADE_SUMMARY">
      <div className="grid grid-cols-4 gap-3 mb-4">
        <HudKpi value={upgrade.suggested_revision} label="SUGGESTED REV" />
        <HudKpi
          value={`-${((1 - upgrade.bom_cost_usd_after / upgrade.bom_cost_usd_before) * 100).toFixed(1)}%`}
          label="COST DELTA"
          status="nominal"
        />
        <HudKpi
          value={`-${upgrade.max_lead_time_before_weeks - upgrade.max_lead_time_after_weeks}wk`}
          label="LEAD TIME DELTA"
          status="nominal"
        />
        <HudKpi value={upgrade.upgrades.length} label="COMPONENTS" />
      </div>

      <div className="space-y-2">
        {upgrade.upgrades.map((upg) => (
          <div key={upg.ref} className="hud-glass border-l-2 border-l-primary/30 p-3">
            <div className="flex items-center gap-3 font-mono text-hud-data">
              <span className="text-primary font-bold">{upg.ref}</span>
              <span className="text-muted-foreground">{upg.original_mpn}</span>
              <span className="text-primary">➜</span>
              <span className="text-hud-green font-bold">{upg.upgraded_mpn}</span>
              <span className={`ml-auto ${upg.unit_price_delta_usd <= 0 ? 'text-hud-green' : 'text-hud-amber'}`}>
                {upg.unit_price_delta_usd >= 0 ? '+' : ''}${upg.unit_price_delta_usd.toFixed(2)}/unit
              </span>
            </div>
            <div className="text-hud-data text-foreground/60 mt-1">{upg.reason}</div>
            <div className="text-hud-label text-primary/60 mt-1">{upg.performance_gain}</div>
          </div>
        ))}
      </div>
    </HudCard>
  </div>
);

const HealthTab = ({ health }: { health: NonNullable<import('@/types/analysis').BOXReport['health']> }) => (
  <div className="space-y-4">
    <HudCard title="PRODUCT_HEALTH" status={health.health_score < 65 ? 'critical' : 'nominal'}>
      <div className="flex items-center gap-6 mb-4">
        <ScoreGauge score={health.health_score} label="HEALTH" />
        <div className="grid grid-cols-4 gap-3 flex-1">
          <HudKpi value={health.limitations_count} label="LIMITATIONS" status={health.limitations_count > 0 ? 'warning' : 'nominal'} />
          <HudKpi value={health.compliance_gaps} label="COMPLIANCE GAPS" status={health.compliance_gaps > 0 ? 'warning' : 'nominal'} />
          <HudKpi value={health.design_issues_count} label="DESIGN ISSUES" status={health.design_issues_count > 0 ? 'critical' : 'nominal'} />
          <HudKpi value={health.recommendations_count} label="RECOMMENDATIONS" />
        </div>
      </div>
    </HudCard>

    <HudCard title="LIMITATIONS">
      <div className="space-y-2">
        {health.limitations.map((lim, i) => (
          <div key={i} className="hud-glass border-l-2 border-l-hud-amber/50 p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-mono text-hud-label px-1.5 py-0.5 ${lim.severity === 'HIGH' ? 'bg-hud-red/20 text-hud-red' : 'bg-hud-amber/20 text-hud-amber'}`}>
                {lim.severity}
              </span>
              <span className="font-mono text-hud-data text-foreground/80">{lim.description}</span>
            </div>
            <div className="font-mono text-hud-label text-muted-foreground mt-1">FIX: {lim.remediation}</div>
          </div>
        ))}
      </div>
    </HudCard>

    <HudCard title="COMPLIANCE_RESTRICTIONS">
      <div className="space-y-1">
        {health.compliance_restrictions.map((cr, i) => {
          const statusCfg = {
            COMPLIANT: { icon: '✔', cls: 'text-hud-green' },
            NON_COMPLIANT: { icon: '✖', cls: 'text-hud-red' },
            GAP: { icon: '⚠', cls: 'text-hud-amber' },
            UNKNOWN: { icon: '?', cls: 'text-muted-foreground' },
          }[cr.status];
          return (
            <div key={i} className="flex items-center gap-3 font-mono text-hud-data py-1">
              <span className={statusCfg.cls}>{statusCfg.icon}</span>
              <span className={statusCfg.cls}>{cr.status}</span>
              <span className="text-foreground/80">{cr.standard}</span>
              <span className="text-muted-foreground ml-auto text-hud-label">{cr.detail}</span>
            </div>
          );
        })}
      </div>
    </HudCard>

    <HudCard title="RECOMMENDATIONS">
      <div className="space-y-2">
        {health.recommendations.map((rec) => {
          const effortCls = { none: 'text-muted-foreground', low: 'text-hud-green', medium: 'text-hud-amber', high: 'text-hud-red' }[rec.effort];
          return (
            <div key={rec.priority} className="flex items-start gap-3 font-mono text-hud-data">
              <span className="text-primary font-bold">{rec.priority}.</span>
              <span className={`text-hud-label px-1 ${effortCls} bg-current/10`}>{rec.effort.toUpperCase()}</span>
              <span className="text-foreground/80 flex-1">{rec.description}</span>
              {rec.eco_ref && <span className="text-primary text-hud-label">{rec.eco_ref}</span>}
            </div>
          );
        })}
      </div>
    </HudCard>
  </div>
);

export default PreCommitmentPage;
