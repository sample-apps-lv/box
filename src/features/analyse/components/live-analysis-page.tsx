import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HudCard } from '@/components/ui/hud-card';
import { StatusBadge, SeverityBadge } from '@/components/ui/status-badge';
import { isMockMode } from '@/lib/fetch-api';
import { getMockReport } from '@/api/analysis/use-report';
import type { ComponentAnalysis, IpcRuleResult } from '@/types/analysis';
import { Loader2 } from 'lucide-react';

interface AgentLog {
  ref: string;
  agent: string;
  message: string;
  timestamp: number;
}

const LiveAnalysisPage = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0);
  const [components, setComponents] = useState<ComponentAnalysis[]>([]);
  const [totalComponents, setTotalComponents] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  const [ipcRules, setIpcRules] = useState<IpcRuleResult[]>([]);
  const [ipcTotal, setIpcTotal] = useState(0);
  const [product, setProduct] = useState('');
  const [upgradeComponents, setUpgradeComponents] = useState<any[]>([]);
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (logRef.current && !isHovering) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [agentLogs, isHovering]);

  // Mock simulation
  useEffect(() => {
    if (!isMockMode()) return;

    const report = getMockReport();
    setProduct(report.product);
    setTotalComponents(report.components.length);

    const addLog = (ref: string, agent: string, message: string) => {
      setAgentLogs(prev => [...prev, { ref, agent, message, timestamp: Date.now() }]);
    };

    let delay = 300;
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Phase 1: Components
    setPhase(1);
    report.components.forEach((comp, i) => {
      timers.push(setTimeout(() => {
        setComponents(prev => [...prev, { ...comp, status: 'searching' as const, stock_available: 0, unit_price_usd: 0, lead_time_weeks: 0, issues: [], alternatives: [], recommendation: '', sources: [] }]);
        addLog(comp.ref, 'sourcing', `Searching distributors for ${comp.mpn}...`);
      }, delay + i * 400));

      timers.push(setTimeout(() => {
        addLog(comp.ref, 'sourcing', `Found ${comp.stock_available} units at $${comp.unit_price_usd}. Lead time: ${comp.lead_time_weeks} weeks.`);
        if (comp.status === 'red') {
          addLog(comp.ref, 'sourcing', `Insufficient stock. Searching for alternatives...`);
        }
      }, delay + i * 400 + 200));

      timers.push(setTimeout(() => {
        setComponents(prev => prev.map(c => c.ref === comp.ref ? comp : c));
        setCompletedCount(prev => prev + 1);
        if (comp.alternatives.length > 0) {
          addLog(comp.ref, 'sourcing', `Found alternative: ${comp.alternatives[0].mpn} — ${comp.alternatives[0].stock_available} in stock`);
        }
      }, delay + i * 400 + 350));
    });

    // Phase 2: IPC
    const ipcStart = delay + report.components.length * 400 + 500;
    timers.push(setTimeout(() => {
      setPhase(2);
      setIpcTotal(report.ipc?.rules.length || 0);
      addLog('—', 'ipc', 'IPC Class 3 validation initiated...');
    }, ipcStart));

    report.ipc?.rules.forEach((rule, i) => {
      timers.push(setTimeout(() => {
        setIpcRules(prev => [...prev, rule]);
        addLog('—', 'ipc', `${rule.rule_id}: ${rule.description} — ${rule.severity}`);
      }, ipcStart + 200 + i * 150));
    });

    // Phase 3: Upgrades
    const upgradeStart = ipcStart + 200 + (report.ipc?.rules.length || 0) * 150 + 500;
    timers.push(setTimeout(() => {
      setPhase(3);
      addLog('—', 'version_upgrade', 'Version Upgrade Agent initiated...');
    }, upgradeStart));

    report.upgrade?.upgrades.forEach((upg, i) => {
      timers.push(setTimeout(() => {
        setUpgradeComponents(prev => [...prev, upg]);
        addLog(upg.ref, 'version_upgrade', `${upg.original_mpn} → ${upg.upgraded_mpn}: ${upg.reason}`);
      }, upgradeStart + 300 + i * 400));
    });

    // Phase 4: Health
    const healthStart = upgradeStart + 300 + (report.upgrade?.upgrades.length || 0) * 400 + 500;
    timers.push(setTimeout(() => {
      setPhase(4);
      addLog('—', 'strategic', 'Assessing product health...');
    }, healthStart));

    timers.push(setTimeout(() => {
      setHealthScore(report.health?.health_score || 0);
      addLog('—', 'strategic', `Health score: ${report.health?.health_score}/100`);
    }, healthStart + 1000));

    // Phase 5: Complete
    timers.push(setTimeout(() => {
      setPhase(5);
      addLog('—', 'strategic', `ANALYSIS_COMPLETE — Report ID: ${report.report_id}`);
      setTimeout(() => navigate(`/report/${report.report_id}`), 1500);
    }, healthStart + 2000));

    return () => timers.forEach(clearTimeout);
  }, [navigate]);

  const progressPct = totalComponents > 0 ? (completedCount / totalComponents) * 100 : 0;

  return (
    <div className="p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-mono text-hud-header text-primary">ANALYSING: {product || 'LOADING...'}</h1>
          <p className="font-mono text-hud-data text-muted-foreground">
            {completedCount} / {totalComponents} COMPONENTS · PHASE {phase} / 5
          </p>
        </div>
        <div className="font-mono text-hud-label text-primary animate-hud-pulse">
          <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
          PROCESSING
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted mb-6 relative overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
        />
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-4">
        {/* Component table */}
        <div className="flex flex-col gap-4">
          <HudCard title="COMPONENT_ANALYSIS">
            <div className="overflow-auto scrollbar-hud max-h-[350px]">
              <table className="w-full font-mono text-hud-data">
                <thead>
                  <tr className="text-muted-foreground text-hud-label border-b border-primary/10">
                    <th className="text-left py-1.5 px-2">REF</th>
                    <th className="text-left py-1.5 px-2">MPN</th>
                    <th className="text-left py-1.5 px-2">STATUS</th>
                    <th className="text-right py-1.5 px-2">STOCK</th>
                    <th className="text-right py-1.5 px-2">LT(WK)</th>
                    <th className="text-right py-1.5 px-2">PRICE</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {components.map((comp) => (
                      <motion.tr
                        key={comp.ref}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`border-b border-primary/5 ${comp.status === 'red' ? 'bg-hud-red/5' : ''}`}
                      >
                        <td className="py-1.5 px-2 text-primary">{comp.ref}</td>
                        <td className="py-1.5 px-2 text-foreground/80">{comp.mpn}</td>
                        <td className="py-1.5 px-2"><StatusBadge status={comp.status} /></td>
                        <td className="py-1.5 px-2 text-right">{comp.status === 'searching' ? '—' : comp.stock_available.toLocaleString()}</td>
                        <td className="py-1.5 px-2 text-right">{comp.status === 'searching' ? '—' : comp.lead_time_weeks}</td>
                        <td className="py-1.5 px-2 text-right">{comp.status === 'searching' ? '—' : `$${comp.unit_price_usd.toFixed(2)}`}</td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </HudCard>

          {/* IPC Phase */}
          <AnimatePresence>
            {phase >= 2 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <HudCard title={`IPC_VALIDATION · ${ipcRules.length} / ${ipcTotal} RULES`}>
                  <div className="space-y-1 max-h-[200px] overflow-auto scrollbar-hud">
                    {ipcRules.map((rule) => (
                      <motion.div
                        key={rule.rule_id}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 font-mono text-hud-data py-0.5"
                      >
                        <SeverityBadge severity={rule.severity} />
                        <span className="text-muted-foreground">{rule.rule_id}</span>
                        <span className="text-foreground/80 flex-1">{rule.description}</span>
                        {rule.severity === 'FAIL' && (
                          <span className="text-hud-red text-hud-label">{rule.value_found} &lt; {rule.limit}</span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </HudCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upgrade Phase */}
          <AnimatePresence>
            {phase >= 3 && upgradeComponents.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <HudCard title="VERSION_UPGRADE">
                  <div className="space-y-2">
                    {upgradeComponents.map((upg) => (
                      <motion.div
                        key={upg.ref}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-3 font-mono text-hud-data"
                      >
                        <span className="text-primary">{upg.ref}</span>
                        <span className="text-muted-foreground">{upg.original_mpn}</span>
                        <span className="text-primary">➜</span>
                        <span className="text-hud-green">{upg.upgraded_mpn}</span>
                        <span className="text-muted-foreground ml-auto text-hud-label">
                          {upg.unit_price_delta_usd >= 0 ? '+' : ''}${upg.unit_price_delta_usd.toFixed(2)}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </HudCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Health Phase */}
          <AnimatePresence>
            {phase >= 4 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <HudCard title="PRODUCT_HEALTH" status={healthScore !== null && healthScore < 65 ? 'critical' : 'nominal'}>
                  {healthScore === null ? (
                    <div className="flex items-center gap-2 font-mono text-hud-data text-primary animate-hud-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      ASSESSING PRODUCT HEALTH...
                    </div>
                  ) : (
                    <div className="font-mono text-hud-xl font-bold">
                      <span className={healthScore >= 65 ? 'text-hud-green' : 'text-hud-red'}>
                        {healthScore}
                      </span>
                      <span className="text-muted-foreground text-hud-data"> / 100</span>
                    </div>
                  )}
                </HudCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Agent Log */}
        <HudCard title="AGENT_LOG" className="h-fit max-h-[calc(100vh-160px)] sticky top-4">
          <div
            ref={logRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="space-y-1 max-h-[600px] overflow-auto scrollbar-hud"
          >
            {agentLogs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-mono text-[10px] leading-[16px]"
              >
                <span className="text-primary/60">[{log.agent}]</span>{' '}
                <span className="text-foreground/70">{log.message}</span>
              </motion.div>
            ))}
          </div>
        </HudCard>
      </div>
    </div>
  );
};

export default LiveAnalysisPage;
