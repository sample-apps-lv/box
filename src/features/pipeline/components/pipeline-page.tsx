import { useState } from 'react';
import { motion } from 'framer-motion';
import { HudCard } from '@/components/ui/hud-card';
import { usePipelines, usePipelineMissing, usePipelineSequence } from '@/features/pipeline/api/use-pipeline';
import { Boxes } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PipelinePage = () => {
  const { data: pipelines } = usePipelines();
  const [selectedPipeline, setSelectedPipeline] = useState<string>('pipe-001');
  const { data: missing } = usePipelineMissing(selectedPipeline);
  const { data: sequence } = usePipelineSequence(selectedPipeline);
  const [showSequence, setShowSequence] = useState(true);

  const pipeline = pipelines?.find(p => p.id === selectedPipeline);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Boxes className="w-5 h-5 text-primary" />
        <h1 className="font-mono text-hud-header text-primary">PRODUCTION_PIPELINE</h1>
      </div>

      {pipeline && (
        <div className="flex flex-col gap-6">
          <HudCard title={pipeline.name.toUpperCase()}>
            <table className="w-full font-mono text-hud-data">
              <thead>
                <tr className="text-muted-foreground text-hud-label border-b border-primary/10">
                  <th className="text-left py-1.5 px-2">PRODUCT</th>
                  <th className="text-left py-1.5 px-2">REV</th>
                  <th className="text-right py-1.5 px-2">QTY</th>
                  <th className="text-left py-1.5 px-2">TARGET</th>
                  <th className="text-left py-1.5 px-2">COVERAGE</th>
                  <th className="text-center py-1.5 px-2">MODEL</th>
                  <th className="text-right py-1.5 px-2">MISSING</th>
                </tr>
              </thead>
              <tbody>
                {pipeline.runs.map((run) => (
                  <tr key={run.product} className="border-b border-primary/5 hover:bg-primary/5">
                    <td className="py-1.5 px-2 text-primary">{run.product}</td>
                    <td className="py-1.5 px-2 text-foreground/70">{run.revision}</td>
                    <td className="py-1.5 px-2 text-right">{run.planned_qty.toLocaleString()}</td>
                    <td className="py-1.5 px-2 text-foreground/70">{run.target_date}</td>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted relative">
                          <motion.div
                            className={`h-full ${run.coverage_pct >= 80 ? 'bg-hud-green' : run.coverage_pct >= 30 ? 'bg-hud-amber' : 'bg-hud-red'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(run.coverage_pct, 100)}%` }}
                          />
                        </div>
                        <span className="text-hud-label">{run.coverage_pct}%</span>
                      </div>
                    </td>
                    <td className="py-1.5 px-2 text-center">
                      <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-hud-label">{run.business_model}</span>
                    </td>
                    <td className="py-1.5 px-2 text-right">
                      {run.missing_count > 0 ? (
                        <span className="text-hud-red">{run.missing_count} MPNs</span>
                      ) : (
                        <span className="text-hud-green">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                className="font-mono text-hud-label border-primary/30 text-primary hover:bg-primary/10"
                onClick={() => setShowSequence(!showSequence)}
              >
                {showSequence ? 'HIDE SEQUENCE' : 'OPTIMAL SEQUENCE'}
              </Button>
            </div>
          </HudCard>

          {/* Missing Components */}
          {missing && missing.some(m => m.delta > 0) && (
            <HudCard title="MISSING_COMPONENTS" status="warning">
              <div className="space-y-2">
                {missing.filter(m => m.delta > 0).map((m) => (
                  <div key={m.mpn} className="flex items-center gap-3 font-mono text-hud-data">
                    <span className="text-primary">{m.mpn}</span>
                    <span className="text-foreground/60">{m.description}</span>
                    <span className="ml-auto text-muted-foreground">NEED: {m.total_needed}</span>
                    <span className="text-foreground/60">HAVE: {m.total_available}</span>
                    <span className="text-hud-red">Δ {m.delta}</span>
                  </div>
                ))}
              </div>
            </HudCard>
          )}

          {/* Optimal Sequence */}
          {showSequence && sequence && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <HudCard title="OPTIMAL_SEQUENCE">
                <div className="space-y-3">
                  {sequence.map((s) => (
                    <div key={s.order} className="flex items-start gap-3 font-mono text-hud-data">
                      <span className="w-6 h-6 flex items-center justify-center bg-primary/10 text-primary font-bold">{s.order}</span>
                      <div>
                        <div className="text-primary font-bold">{s.product}</div>
                        <div className="text-foreground/60 text-hud-label mt-0.5">{s.rationale}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </HudCard>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default PipelinePage;
