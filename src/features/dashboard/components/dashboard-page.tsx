import { motion } from 'framer-motion';
import { HudCard } from '@/components/ui/hud-card';
import { HudKpi } from '@/components/ui/hud-kpi';
import { StatusBadge } from '@/components/ui/status-badge';
import { ScoreGauge } from '@/components/ui/score-gauge';
import {
  useDashboardSummary,
  useDashboardAlerts,
  useDashboardProjects,
  useDashboardWatchlist,
  useDashboardIpcSummary,
} from '@/features/dashboard/api/use-dashboard';
import { useEcos } from '@/features/engineering/api/use-engineering';
import { Link } from 'react-router-dom';
import { AlertTriangle, Bell, TrendingUp } from 'lucide-react';

const DashboardPage = () => {
  const { data: summary } = useDashboardSummary();
  const { data: alerts } = useDashboardAlerts();
  const { data: projects } = useDashboardProjects();
  const { data: watchlist } = useDashboardWatchlist();
  const { data: ipcSummary } = useDashboardIpcSummary();
  const { data: pendingEcos } = useEcos({ status: 'PENDING' });

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="font-mono text-hud-header text-primary mb-6">ANALYTICS_DASHBOARD</h1>

      {/* KPI Row */}
      {summary && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <HudKpi value={summary.total_products} label="PRODUCTS" />
          <HudKpi value={summary.total_reports} label="REPORTS" />
          <HudKpi value={summary.active_alerts} label="ALERTS" status={summary.active_alerts > 0 ? 'critical' : 'nominal'} />
          <HudKpi value={summary.avg_risk_score} label="AVG RISK SCORE" status={summary.avg_risk_score > 60 ? 'warning' : 'nominal'} />
        </div>
      )}

      <div className="grid grid-cols-[1fr_380px] gap-6">
        <div className="flex flex-col gap-6">
          {/* Alerts */}
          {alerts && alerts.length > 0 && (
            <HudCard title="ACTIVE_ALERTS" status={alerts.some(a => a.severity === 'CRITICAL') ? 'critical' : 'warning'}>
              <div className="space-y-2">
                {alerts.map((alert) => {
                  const cls = { CRITICAL: 'text-hud-red bg-hud-red/10', WARNING: 'text-hud-amber bg-hud-amber/10', INFO: 'text-primary bg-primary/10' }[alert.severity];
                  return (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-3 border-l-2 ${alert.severity === 'CRITICAL' ? 'border-l-hud-red/50' : alert.severity === 'WARNING' ? 'border-l-hud-amber/50' : 'border-l-primary/30'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-mono text-hud-label px-1.5 py-0.5 ${cls}`}>{alert.severity}</span>
                        <span className="font-mono text-hud-data text-primary">{alert.mpn}</span>
                      </div>
                      <div className="font-mono text-hud-data text-foreground/70">{alert.message}</div>
                      <div className="font-mono text-[9px] text-muted-foreground mt-1">
                        {alert.affected_products.join(', ')}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </HudCard>
          )}

          {/* Projects Table */}
          {projects && (
            <HudCard title="PROJECTS">
              <table className="w-full font-mono text-hud-data">
                <thead>
                  <tr className="text-muted-foreground text-hud-label border-b border-primary/10">
                    <th className="text-left py-1.5 px-2">PRODUCT</th>
                    <th className="text-left py-1.5 px-2">REV</th>
                    <th className="text-left py-1.5 px-2">LAST ANALYSED</th>
                    <th className="text-right py-1.5 px-2">RISK</th>
                    <th className="text-center py-1.5 px-2">GO/NO-GO</th>
                    <th className="text-center py-1.5 px-2">IPC</th>
                    <th className="text-right py-1.5 px-2">HEALTH</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((proj) => (
                    <tr key={proj.report_id} className="border-b border-primary/5 hover:bg-primary/5 cursor-pointer">
                      <td className="py-1.5 px-2">
                        <Link to={`/report/${proj.report_id}`} className="text-primary hover:underline">{proj.product}</Link>
                      </td>
                      <td className="py-1.5 px-2 text-foreground/70">{proj.revision}</td>
                      <td className="py-1.5 px-2 text-foreground/70">{proj.last_analysed}</td>
                      <td className="py-1.5 px-2 text-right">
                        <span className={proj.risk_score > 60 ? 'text-hud-red' : proj.risk_score > 40 ? 'text-hud-amber' : 'text-hud-green'}>{proj.risk_score}</span>
                      </td>
                      <td className="py-1.5 px-2 text-center">
                        <span className={proj.go_no_go ? 'text-hud-green' : 'text-hud-red'}>
                          {proj.go_no_go ? 'GO' : 'NO-GO'}
                        </span>
                      </td>
                      <td className="py-1.5 px-2 text-center text-foreground/70">Class {proj.ipc_class_achieved}</td>
                      <td className="py-1.5 px-2 text-right">
                        <span className={proj.health_score >= 85 ? 'text-hud-green' : proj.health_score >= 65 ? 'text-hud-amber' : 'text-hud-red'}>
                          {proj.health_score}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </HudCard>
          )}

          {/* IPC Summary */}
          {ipcSummary && (
            <HudCard title="IPC_COMPLIANCE_OVERVIEW">
              <div className="space-y-2">
                {ipcSummary.recent.map((item) => (
                  <div key={item.product} className="flex items-center gap-3">
                    <span className="font-mono text-hud-data text-foreground/80 w-40 shrink-0">{item.product}</span>
                    <div className="flex-1 h-2 bg-muted relative">
                      <motion.div
                        className={`h-full ${item.pass_rate >= 85 ? 'bg-hud-green' : item.pass_rate >= 65 ? 'bg-hud-amber' : 'bg-hud-red'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.pass_rate}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="font-mono text-hud-label text-muted-foreground w-12 text-right">{item.pass_rate}%</span>
                    {item.fail_count > 0 && <span className="font-mono text-hud-label text-hud-red">{item.fail_count} FAIL</span>}
                  </div>
                ))}
              </div>
            </HudCard>
          )}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Watchlist */}
          {watchlist && (
            <HudCard title="COMPONENT_WATCHLIST">
              <div className="space-y-3">
                {watchlist.map((item) => (
                  <div key={item.mpn} className="border-b border-primary/5 pb-2 last:border-0">
                    <div className="font-mono text-hud-data text-primary">{item.mpn}</div>
                    <div className="font-mono text-[9px] text-muted-foreground">{item.description}</div>
                    <div className="flex gap-3 mt-1 font-mono text-hud-label">
                      <span className="text-foreground/60">STOCK: {item.stock_available.toLocaleString()}</span>
                      <span className="text-foreground/60">${item.unit_price_usd}</span>
                      <span className={item.lead_time_weeks > 8 ? 'text-hud-red' : 'text-foreground/60'}>{item.lead_time_weeks}wk</span>
                    </div>
                    {/* Mini sparkline */}
                    <div className="flex items-end gap-px mt-1 h-3">
                      {item.trend.map((v, i) => {
                        const max = Math.max(...item.trend);
                        const min = Math.min(...item.trend);
                        const h = max === min ? 50 : ((v - min) / (max - min)) * 100;
                        return <div key={i} className="w-2 bg-primary/40" style={{ height: `${Math.max(h, 10)}%` }} />;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </HudCard>
          )}

          {/* Pending ECOs */}
          {pendingEcos && pendingEcos.length > 0 && (
            <HudCard title="PENDING_ECOS" status="warning">
              <div className="space-y-2">
                {pendingEcos.map((eco) => (
                  <div key={eco.id} className="font-mono text-hud-data">
                    <div className="text-hud-amber">{eco.eco_number}</div>
                    <div className="text-foreground/60 text-[9px]">{eco.product} · {eco.type}</div>
                  </div>
                ))}
              </div>
              <Link to="/engineering" className="block mt-3 font-mono text-hud-label text-primary hover:underline">
                REVIEW_ECOS →
              </Link>
            </HudCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
