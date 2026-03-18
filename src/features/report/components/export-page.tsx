import { useParams } from 'react-router-dom';
import { HudCard } from '@/components/ui/hud-card';
import { useReport } from '@/features/analyse/api/use-report';
import { Button } from '@/components/ui/button';
import { Copy, Download, FileJson, FileText } from 'lucide-react';
import { toast } from 'sonner';

const ExportPage = () => {
  const { reportId } = useParams();
  const { data: report } = useReport(reportId || '');

  if (!report) return <div className="p-4 max-w-6xl mx-auto font-mono text-primary animate-hud-pulse">LOADING...</div>;

  const downloadJson = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="font-mono text-hud-header text-primary mb-6">EXPORT_REPORT</h1>

      <div className="grid grid-cols-2 gap-4">
        <HudCard title="FULL_REPORT">
          <p className="font-mono text-hud-data text-muted-foreground mb-3">Complete BOXReport as JSON</p>
          <Button
            variant="outline"
            className="font-mono text-hud-label border-primary/30 text-primary hover:bg-primary/10 gap-2"
            onClick={() => downloadJson(report, `box-report-${report.report_id}.json`)}
          >
            <FileJson className="w-3 h-3" /> DOWNLOAD JSON
          </Button>
        </HudCard>

        <HudCard title="SHARE_LINK">
          <p className="font-mono text-hud-data text-muted-foreground mb-3">Report ID: {report.report_id}</p>
          <Button
            variant="outline"
            className="font-mono text-hud-label border-primary/30 text-primary hover:bg-primary/10 gap-2"
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/report/${report.report_id}`);
              toast.success('Link copied');
            }}
          >
            <Copy className="w-3 h-3" /> COPY LINK
          </Button>
        </HudCard>

        {report.ipc && (
          <HudCard title="FABRICATION_NOTE">
            <p className="font-mono text-hud-data text-muted-foreground mb-3">IPC fab note for Gerber package</p>
            <Button
              variant="outline"
              className="font-mono text-hud-label border-primary/30 text-primary hover:bg-primary/10 gap-2"
              onClick={() => {
                navigator.clipboard.writeText(report.ipc!.fabrication_note);
                toast.success('Fabrication note copied');
              }}
            >
              <Copy className="w-3 h-3" /> COPY FAB NOTE
            </Button>
          </HudCard>
        )}

        {report.upgrade && (
          <HudCard title="REV_C_BOM">
            <p className="font-mono text-hud-data text-muted-foreground mb-3">Upgraded BOM with new MPNs</p>
            <Button
              variant="outline"
              className="font-mono text-hud-label border-primary/30 text-primary hover:bg-primary/10 gap-2"
              onClick={() => {
                const upgradedBom = {
                  product: report.product,
                  revision: report.upgrade!.suggested_revision,
                  components: report.components.map(c => {
                    const upg = report.upgrade!.upgrades.find(u => u.ref === c.ref);
                    return { ref: c.ref, mpn: upg ? upg.upgraded_mpn : c.mpn };
                  }),
                };
                downloadJson(upgradedBom, `bom-${report.upgrade!.suggested_revision}.json`);
              }}
            >
              <Download className="w-3 h-3" /> EXPORT REV C BOM
            </Button>
          </HudCard>
        )}

        {report.ipc && (
          <HudCard title="CONFORMANCE_CHECKLIST">
            <div className="space-y-1 mb-3">
              {report.ipc.conformance_package_checklist.map((item, i) => (
                <div key={i} className="font-mono text-hud-data text-foreground/70 flex items-center gap-2">
                  <span className="w-3 h-3 border border-primary/30" />
                  {item}
                </div>
              ))}
            </div>
          </HudCard>
        )}
      </div>
    </div>
  );
};

export default ExportPage;
