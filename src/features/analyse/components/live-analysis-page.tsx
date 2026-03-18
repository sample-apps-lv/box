import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HudCard } from '@/components/ui/hud-card';
import { StatusBadge, SeverityBadge } from '@/components/ui/status-badge';
import { isMockMode } from '@/lib/fetch-api';
import { useAnalysisStream } from '@/features/analyse/api/use-analysis-stream';
import type { AnalysisRequest } from '@/types/analysis';
import { Loader2, AlertTriangle } from 'lucide-react';

const LiveAnalysisPage = () => {
  const navigate = useNavigate();
  const { state, startStream, abort } = useAnalysisStream();
  const logRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const startedRef = useRef(false);

  // Auto-scroll agent log
  useEffect(() => {
    if (logRef.current && !isHovering) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [state.agentLogs, isHovering]);

  // Start the stream on mount
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (isMockMode()) {
      const cleanup = startStream();
      return typeof cleanup === 'function' ? cleanup : undefined;
    }

    // Parse BOM from sessionStorage
    const bomJson = sessionStorage.getItem('bom_input');
    if (!bomJson) {
      navigate('/analyse');
      return;
    }

    try {
      const parsed = JSON.parse(bomJson) as AnalysisRequest;
      startStream(parsed);
    } catch {
      navigate('/analyse');
    }

    return () => abort();
  }, []);

  // Navigate to report on completion
  useEffect(() => {
    if (state.phase === 5 && state.report) {
      const timer = setTimeout(() => {
        navigate(`/report/${state.report!.report_id}`);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.phase, state.report, navigate]);

  const progressPct = state.totalComponents > 0
    ? (state.completedCount / state.totalComponents) * 100
    : 0;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-mono text-hud-header text-primary">
            ANALYSING: {state.product || 'LOADING...'}
          </h1>
          <p className="font-mono text-hud-data text-muted-foreground">
            {state.completedCount} / {state.totalComponents} COMPONENTS · PHASE {state.phase} / 5
          </p>
        </div>
        <div className="font-mono text-hud-label text-primary animate-hud-pulse">
          {state.isRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
              PROCESSING
            </>
          ) : state.error ? (
            <span className="text-hud-red">
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              ERROR
            </span>
          ) : (
            'COMPLETE'
          )}
        </div>
      </div>

      {/* Error banner */}
      {state.error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-hud-label text-hud-red px-3 py-2 bg-hud-red/10 border-l-2 border-l-hud-red/50 mb-4"
        >
          {state.error}
        </motion.div>
      )}

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
                    {state.components.map((comp) => (
                      <motion.tr
                        key={comp.ref}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`border-b border-primary/5 ${comp.status === 'red' ? 'bg-hud-red/5' : ''}`}
                      >
                        <td className="py-1.5 px-2 text-primary">{comp.ref}</td>
                        <td className="py-1.5 px-2 text-foreground/80">{comp.mpn}</td>
                        <td className="py-1.5 px-2"><StatusBadge status={comp.status} /></td>
                        <td className="py-1.5 px-2 text-right">
                          {comp.status === 'searching' ? '—' : comp.stock_available.toLocaleString()}
                        </td>
                        <td className="py-1.5 px-2 text-right">
                          {comp.status === 'searching' ? '—' : comp.lead_time_weeks}
                        </td>
                        <td className="py-1.5 px-2 text-right">
                          {comp.status === 'searching' ? '—' : `$${comp.unit_price_usd.toFixed(2)}`}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </HudCard>

          {/* IPC Phase */}
          <AnimatePresence>
            {state.phase >= 2 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <HudCard title={`IPC_VALIDATION · ${state.ipcRules.length} / ${state.ipcTotal} RULES`}>
                  <div className="space-y-1 max-h-[200px] overflow-auto scrollbar-hud">
                    {state.ipcRules.map((rule) => (
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
                          <span className="text-hud-red text-hud-label">
                            {rule.value_found} &lt; {rule.limit}
                          </span>
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
            {state.phase >= 3 && state.upgradeComponents.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <HudCard title="VERSION_UPGRADE">
                  <div className="space-y-2">
                    {state.upgradeComponents.map((upg) => (
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
            {state.phase >= 4 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <HudCard
                  title="PRODUCT_HEALTH"
                  status={state.healthScore !== null && state.healthScore < 65 ? 'critical' : 'nominal'}
                >
                  {state.healthScore === null ? (
                    <div className="flex items-center gap-2 font-mono text-hud-data text-primary animate-hud-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      ASSESSING PRODUCT HEALTH...
                    </div>
                  ) : (
                    <div className="font-mono text-hud-xl font-bold">
                      <span className={state.healthScore >= 65 ? 'text-hud-green' : 'text-hud-red'}>
                        {state.healthScore}
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
            {state.agentLogs.map((log, i) => (
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
