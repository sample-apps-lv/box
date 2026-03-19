import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HudCard } from '@/components/ui/hud-card';
import { HudKpi } from '@/components/ui/hud-kpi';
import { StatusBadge, SeverityBadge } from '@/components/ui/status-badge';
import { ScoreGauge } from '@/components/ui/score-gauge';
import { useReport } from '@/features/analyse/api/use-report';
import { Button } from '@/components/ui/button';
import { Copy, Download, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import type { BusinessModel, ComponentAnalysis, BOXReport } from '@/types/analysis';
import { toast } from 'sonner';

const MODEL_LABELS: Record<BusinessModel, { label: string; desc: string }> = {
  FTF: { label: 'FULFILL TO FLOOR', desc: 'Full run covered by warehouse stock' },
  PTF: { label: 'PARTIAL TO FLOOR', desc: 'Some units ready from warehouse' },
  BTS: { label: 'BUILD TO STOCK', desc: 'All parts available from distributors' },
  CTO: { label: 'CONFIGURE TO ORDER', desc: 'Build on customer configuration' },
  BTO: { label: 'BUILD TO ORDER', desc: 'Source parts only when orders arrive' },
  ETO: { label: 'ENGINEER TO ORDER', desc: 'Requires redesign before building' },
  PTS: { label: 'PICK TO SHIP', desc: 'Pre-built stock ready' },
};

const STATUS_ORDER: Record<string, number> = { red: 0, yellow: 1, unknown: 2, green: 3, searching: 4 };

const sortComponents = (components: ComponentAnalysis[]) =>
  [...components].sort((a, b) => (STATUS_ORDER[a.status] ?? 5) - (STATUS_ORDER[b.status] ?? 5));

const PreCommitmentPage = () => {
  const { reportId } = useParams();
  const { data: report, isLoading } = useReport(reportId || '');
  const [activeTab, setActiveTab] = useState(0);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [showReasoning, setShowReasoning] = useState(false);

  if (isLoading || !report) {
    return (
      <div className="flex items-center justify-center h-64 font-mono text-primary animate-hud-pulse">
        LOADING_REPORT...
      </div>
    );
  }

  const tabs = ['COMPONENTS', 'IPC_COMPLIANCE', 'VERSION_UPGRADE', 'PRODUCT_HEALTH'];

  return (
    <div className="p-4 max-w-6xl mx-auto">
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
                {!report.go_no_go && report.ipc_report && report.ipc_report.overall_verdict === 'FAIL' && (
                  <div className="font-mono text-[9px] text-hud-red mt-0.5">IPC CLASS {report.ipc_report.ipc_class_requested} VIOLATION</div>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <ScoreGauge score={report.risk_score} label="RISK" />
            {report.ipc_report && <ScoreGauge score={report.ipc_report.ipc_compliance_score} label="IPC" />}
            {report.product_health && <ScoreGauge score={report.product_health.health_score} label="HEALTH" />}
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
            value={report.ipc_report ? `Class ${report.ipc_report.ipc_class_achieved}` : '—'}
            label="IPC ACHIEVED"
            status={report.ipc_report?.overall_verdict === 'FAIL' ? 'critical' : 'nominal'}
          />
          <HudKpi value={report.components.filter(c => c.status === 'red').length} label="CRITICAL PARTS" status={report.components.some(c => c.status === 'red') ? 'critical' : 'nominal'} />
        </div>
      </motion.div>

      {/* Rationale — always shown */}
      <HudCard title="RATIONALE" className="mb-4">
        <p className="font-mono text-hud-data text-foreground/80">{report.rationale}</p>
        {report.version_upgrade && (
          <p className="font-mono text-hud-label text-primary/70 mt-2">{report.version_upgrade.upgrade_summary}</p>
        )}
        <button
          onClick={() => setShowReasoning(!showReasoning)}
          className="flex items-center gap-1 mt-3 font-mono text-hud-label text-primary hover:text-primary/80 transition-colors"
        >
          {showReasoning ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {showReasoning ? 'HIDE' : 'SHOW'} STRATEGIC REASONING
        </button>
        <AnimatePresence>
          {showReasoning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <pre className="font-mono text-hud-data text-foreground/60 whitespace-pre-wrap mt-3 border-t border-primary/10 pt-3">
                {report.strategic_reasoning}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </HudCard>

      {/* Tabs */}
      <div className="flex gap-0.5 mb-4">
        {tabs.map((tab, i) => {
          // Hide IPC tab if no ipc_report
          if (i === 1 && !report.ipc_report) return null;
          return (
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
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 0 && <ComponentsTab components={report.components} expandedRow={expandedRow} setExpandedRow={setExpandedRow} targetQty={report.target_quantity} />}
      {activeTab === 1 && report.ipc_report && <IpcTab ipc={report.ipc_report} />}
      {activeTab === 2 && report.version_upgrade && <UpgradeTab upgrade={report.version_upgrade} />}
      {activeTab === 3 && report.product_health && <HealthTab health={report.product_health} />}

      {/* Proposed ECOs */}
      {report.proposed_ecos && report.proposed_ecos.length > 0 && (
        <HudCard title="PROPOSED_ECOS" className="mt-6">
          <div className="space-y-2">
            {report.proposed_ecos.map((eco) => (
              <div key={eco.eco_id} className="flex items-center gap-3 font-mono text-hud-data border-b border-primary/5 py-2">
                <span className="text-primary font-bold">{eco.eco_number}</span>
                <span className="text-hud-label px-1.5 py-0.5 bg-primary/10 text-primary">{eco.type}</span>
                <span className="text-foreground/70 flex-1">{eco.reason}</span>
                <span className="text-muted-foreground">{eco.bom_ref}</span>
                <Link to="/engineering">
                  <Button size="sm" variant="outline" className="font-mono text-hud-label border-primary/30 text-primary hover:bg-primary/10 gap-1">
                    <ExternalLink className="w-3 h-3" /> REVIEW ECO
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </HudCard>
      )}

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

/* ─── Components Tab ─── */

const FOOTPRINT_MATCH_CFG = {
  exact: { icon: '✔', cls: 'text-hud-green', label: 'DROP-IN' },
  compatible: { icon: '⚠', cls: 'text-hud-amber', label: 'COMPATIBLE' },
  rework_required: { icon: '✖', cls: 'text-hud-red', label: 'REWORK' },
} as const;

const ComponentsTab = ({ components, expandedRow, setExpandedRow, targetQty }: {
  components: ComponentAnalysis[];
  expandedRow: string | null;
  setExpandedRow: (r: string | null) => void;
  targetQty: number;
}) => {
  const sorted = sortComponents(components);
  return (
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
          {sorted.map((comp) => (
            <ComponentRow key={comp.ref} comp={comp} expanded={expandedRow === comp.ref} onToggle={() => setExpandedRow(expandedRow === comp.ref ? null : comp.ref)} targetQty={targetQty} />
          ))}
        </tbody>
      </table>
    </HudCard>
  );
};

const ComponentRow = ({ comp, expanded, onToggle, targetQty }: { comp: ComponentAnalysis; expanded: boolean; onToggle: () => void; targetQty: number }) => {
  const hasDetail = comp.issues.length > 0 || comp.alternatives.length > 0 || comp.recommendation;
  return (
    <>
      <tr
        onClick={hasDetail ? onToggle : undefined}
        className={`border-b border-primary/5 ${hasDetail ? 'cursor-pointer' : ''} hover:bg-primary/5 ${comp.status === 'red' ? 'bg-hud-red/5' : ''}`}
      >
        <td className="py-1.5 px-2 text-primary">{comp.ref}</td>
        <td className="py-1.5 px-2 text-foreground/80">{comp.mpn}</td>
        <td className="py-1.5 px-2"><StatusBadge status={comp.status} /></td>
        <td className="py-1.5 px-2 text-right">{comp.stock_available.toLocaleString()}</td>
        <td className="py-1.5 px-2 text-right">{comp.lead_time_weeks}</td>
        <td className="py-1.5 px-2 text-right">${comp.unit_price_usd.toFixed(2)}</td>
        <td className="py-1.5 px-2">
          {hasDetail && (expanded ? <ChevronUp className="w-3 h-3 text-primary" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />)}
        </td>
      </tr>
      {expanded && hasDetail && (
        <tr>
          <td colSpan={7} className="p-4 bg-primary/5">
            {/* Stock vs need for red/yellow */}
            {(comp.status === 'red' || comp.status === 'yellow') && (
              <div className="font-mono text-hud-data text-foreground/70 mb-3">
                <span className="text-muted-foreground">STOCK:</span> {comp.stock_available.toLocaleString()}
                <span className="text-muted-foreground ml-3">NEED:</span> {targetQty.toLocaleString()}
                {comp.stock_available < targetQty && (
                  <span className="text-hud-red ml-3">Δ {(targetQty - comp.stock_available).toLocaleString()}</span>
                )}
              </div>
            )}
            {comp.issues.length > 0 && (
              <div className="mb-3">
                <div className="font-mono text-hud-label text-hud-red mb-1">ISSUES</div>
                {comp.issues.map((issue, i) => (
                  <div key={i} className="text-foreground/70 text-hud-data">• {issue}</div>
                ))}
              </div>
            )}
            {comp.alternatives.map((alt) => {
              const fm = FOOTPRINT_MATCH_CFG[alt.validation.mechanical.footprint_match] || FOOTPRINT_MATCH_CFG.compatible;
              const ipcViolations = alt.validation.ipc_impact.ipc_violations_introduced;
              return (
                <div key={alt.mpn} className="hud-glass border-l-2 border-l-hud-green/50 p-3 mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-hud-green font-bold">{alt.mpn}</span>
                      <span className="text-muted-foreground ml-2">{alt.manufacturer}</span>
                    </div>
                    <span className="text-primary font-mono text-hud-label">COMPATIBILITY: {Math.round(alt.compatibility_confidence * 100)}%</span>
                  </div>
                  <div className="font-mono text-hud-data text-foreground/60 mb-1">{alt.description}</div>
                  <div className="flex gap-4 font-mono text-hud-data text-foreground/70 mb-2">
                    <span>STOCK: {alt.stock_available.toLocaleString()}</span>
                    <span>LEAD: {alt.lead_time_weeks}wk</span>
                    <span>${alt.unit_price_usd.toFixed(2)}</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2 text-hud-label">
                    <div className="text-hud-green">✔ ELECTRICAL</div>
                    <div className={fm.cls}>{fm.icon} {fm.label}</div>
                    <div className={alt.validation.thermal.thermal_ok ? 'text-hud-green' : 'text-hud-red'}>
                      {alt.validation.thermal.thermal_ok ? '✔' : '✖'} THERMAL
                    </div>
                    <div className={alt.ipc_compliant ? 'text-hud-green' : 'text-hud-red'}>
                      {alt.ipc_compliant ? '✔' : '✖'} IPC
                    </div>
                    <div className="text-hud-green">✔ RELIABILITY</div>
                  </div>
                  {ipcViolations.length > 0 && (
                    <div className="mt-2 font-mono text-hud-label text-hud-red bg-hud-red/10 px-2 py-1">
                      ⚠ Using this part introduces {ipcViolations.length} new IPC violation(s): {ipcViolations.join(', ')}
                    </div>
                  )}
                </div>
              );
            })}
            {comp.recommendation && (
              <div className="mt-2 text-hud-data text-foreground/60">
                <span className="text-primary">REC:</span> {comp.recommendation}
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
};

/* ─── IPC Tab ─── */

const IpcTab = ({ ipc }: { ipc: NonNullable<BOXReport['ipc_report']> }) => {
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
              Requested Class {ipc.ipc_class_requested} · Achieved Class {ipc.ipc_class_achieved}
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
                {rule.severity !== 'PASS' && (
                  <span className={`text-hud-label ${rule.severity === 'FAIL' ? 'text-hud-red' : 'text-hud-amber'}`}>{rule.value_found} / {rule.limit}</span>
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

      <HudCard title="CONFORMANCE_CHECKLIST">
        <div className="space-y-1">
          {ipc.conformance_package_checklist.map((item, i) => (
            <div key={i} className="font-mono text-hud-data text-foreground/70 flex items-center gap-2">
              <span className="w-3 h-3 border border-primary/30" />
              {item}
            </div>
          ))}
        </div>
      </HudCard>
    </div>
  );
};

/* ─── Upgrade Tab ─── */

const UpgradeTab = ({ upgrade }: { upgrade: NonNullable<BOXReport['version_upgrade']> }) => (
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
        <HudKpi value={upgrade.upgraded_components.length} label="COMPONENTS" />
      </div>

      <p className="font-mono text-hud-data text-foreground/70 mb-4">{upgrade.upgrade_summary}</p>

      <div className="space-y-2">
        {upgrade.upgraded_components.map((upg) => (
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
            <div className="flex gap-4 text-hud-label text-muted-foreground mt-1">
              <span>STOCK: {upg.stock_available.toLocaleString()}</span>
              <span>LEAD: {upg.lead_time_weeks}wk</span>
            </div>
          </div>
        ))}
      </div>
    </HudCard>
  </div>
);

/* ─── Health Tab ─── */

const HealthTab = ({ health }: { health: NonNullable<BOXReport['product_health']> }) => (
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
              <span className={`font-mono text-hud-label px-1.5 py-0.5 ${lim.severity === 'HIGH' ? 'bg-hud-red/20 text-hud-red' : lim.severity === 'MEDIUM' ? 'bg-hud-amber/20 text-hud-amber' : 'bg-muted/30 text-muted-foreground'}`}>
                {lim.severity}
              </span>
              <span className="font-mono text-hud-label text-foreground/50">{lim.type}</span>
            </div>
            <div className="font-mono text-hud-data text-foreground/80">{lim.description}</div>
            {lim.affected_components.length > 0 && (
              <div className="font-mono text-hud-label text-muted-foreground mt-1">AFFECTS: {lim.affected_components.join(', ')}</div>
            )}
            <div className="font-mono text-hud-label text-muted-foreground mt-1">FIX: {lim.remediation}</div>
          </div>
        ))}
      </div>
    </HudCard>

    <HudCard title="DESIGN_ISSUES">
      <div className="space-y-1">
        {health.design_issues.map((di, i) => (
          <div key={i} className="flex items-start gap-3 font-mono text-hud-data py-1">
            <SeverityBadge severity={di.severity} />
            {di.rule_id && <span className="text-muted-foreground">{di.rule_id}</span>}
            <span className="text-foreground/80 flex-1">{di.description}</span>
            {di.remediation && <span className="text-hud-amber text-hud-label">{di.remediation}</span>}
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

    <HudCard title="FUTURE_RECOMMENDATIONS">
      <div className="space-y-2">
        {health.future_recommendations.map((rec) => {
          const effortCls = { none: 'text-muted-foreground bg-muted/20', low: 'text-hud-green bg-hud-green/10', medium: 'text-hud-amber bg-hud-amber/10', high: 'text-hud-red bg-hud-red/10' }[rec.effort];
          return (
            <div key={rec.priority} className="hud-glass border-l-2 border-l-primary/20 p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-primary font-bold">{rec.priority}.</span>
                <span className={`font-mono text-hud-label px-1.5 py-0.5 ${effortCls}`}>{rec.effort.toUpperCase()}</span>
                <span className="font-mono text-hud-label text-foreground/50">{rec.category}</span>
                {rec.eco_reference && (
                  <Link to="/engineering" className="font-mono text-hud-label text-primary hover:underline ml-auto">{rec.eco_reference}</Link>
                )}
              </div>
              <div className="font-mono text-hud-data text-foreground/80 font-bold">{rec.title}</div>
              <div className="font-mono text-hud-data text-foreground/60 mt-0.5">{rec.detail}</div>
              {!rec.eco_reference && (
                <Link to="/engineering">
                  <Button size="sm" variant="outline" className="font-mono text-hud-label border-primary/30 text-primary hover:bg-primary/10 gap-1 mt-2">
                    CREATE ECO
                  </Button>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </HudCard>
  </div>
);

export default PreCommitmentPage;
