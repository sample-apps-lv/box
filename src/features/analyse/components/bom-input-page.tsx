import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HudCard } from '@/components/ui/hud-card';
import { Button } from '@/components/ui/button';
import { Play, FileJson, Upload } from 'lucide-react';

const SAMPLE_BOM = JSON.stringify({
  product: "IoT Gateway v2",
  revision: "B",
  target_quantity: 500,
  components: [
    { ref: "U1", mpn: "STM32H743VIT6", manufacturer: "STMicroelectronics", description: "32-bit MCU, 480MHz, 2MB Flash", quantity: 1, category: "Microcontroller", approved_alternatives: ["STM32H753VIT6"] },
    { ref: "U3", mpn: "EIP-10S048", manufacturer: "Bel Fuse", description: "48V DC-DC converter, 10A", quantity: 2, category: "Power", approved_alternatives: [] },
    { ref: "C1", mpn: "GRM188R61A106", manufacturer: "Murata", description: "10µF 10V X5R 0603", quantity: 4, category: "Capacitor", approved_alternatives: [] },
    { ref: "U5", mpn: "CP2102N", manufacturer: "Silicon Labs", description: "USB-UART Bridge IC", quantity: 1, category: "Interface", approved_alternatives: [] },
    { ref: "U2", mpn: "TPS54360B", manufacturer: "Texas Instruments", description: "60V 3.5A Step-Down Converter", quantity: 1, category: "Power", approved_alternatives: [] },
    { ref: "R1", mpn: "RC0603FR-0710KL", manufacturer: "Yageo", description: "10kΩ 0603 1%", quantity: 8, category: "Resistor", approved_alternatives: [] },
    { ref: "Y1", mpn: "ABM8-25.000MHZ", manufacturer: "Abracon", description: "25MHz Crystal", quantity: 1, category: "Passive", approved_alternatives: [] },
    { ref: "J1", mpn: "USB4105-GF-A", manufacturer: "GCT", description: "USB-C Connector", quantity: 1, category: "Connector", approved_alternatives: [] },
  ],
  design_params: {
    ipc_class: 3, board_thickness_mm: 1.6, layer_count: 4, min_trace_width_mm: 0.15, min_clearance_mm: 0.15,
    min_drill_dia_mm: 0.2, min_annular_ring_mm: 0.04, via_in_pad: false, has_90deg_bends: true,
    has_teardrops: true, has_fiducials: true, solder_mask_expansion_mm: 0.05, surface_finish: "ENIG",
    stackup_symmetric: true, copper_balance_pct: { top: 48, bottom: 52 },
  },
}, null, 2);

const BomInputPage = () => {
  const navigate = useNavigate();
  const [json, setJson] = useState(SAMPLE_BOM);
  const [includeIpc, setIncludeIpc] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    try {
      const parsed = JSON.parse(json);
      if (!parsed.product || !parsed.components?.length || !parsed.target_quantity) {
        setError('MISSING_REQUIRED_FIELDS: product, components, target_quantity');
        return false;
      }
      setError(null);
      return true;
    } catch {
      setError('PARSE_ERROR: Invalid JSON');
      return false;
    }
  };

  const handleSubmit = () => {
    if (validate()) {
      // Store BOM in sessionStorage for live analysis
      sessionStorage.setItem('bom_input', json);
      navigate('/analyse/live');
    }
  };

  let parsed: any = null;
  try { parsed = JSON.parse(json); } catch {}

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center gap-3 mb-6">
        <FileJson className="w-5 h-5 text-primary" />
        <h1 className="font-mono text-hud-header text-primary">BOM_INPUT</h1>
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-6">
        <div className="flex flex-col gap-4">
          {/* Tabs */}
          <div className="flex gap-0.5">
            <div className="px-3 py-1.5 font-mono text-hud-label bg-primary/10 text-primary border-b border-primary/50">
              BOM & DESIGN JSON
            </div>
            <div className="px-3 py-1.5 font-mono text-hud-label text-muted-foreground bg-muted/20 cursor-not-allowed">
              UPLOAD CSV <span className="text-muted-foreground/50 ml-1">COMING_SOON</span>
            </div>
          </div>

          {/* Editor */}
          <HudCard title="JSON_EDITOR">
            <textarea
              value={json}
              onChange={(e) => { setJson(e.target.value); setError(null); }}
              className="w-full h-[400px] bg-transparent font-mono text-hud-data text-foreground/90 resize-none outline-none scrollbar-hud"
              spellCheck={false}
            />
          </HudCard>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-hud-label text-hud-red px-3 py-2 bg-hud-red/10 border-l-2 border-l-hud-red/50"
            >
              {error}
            </motion.div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 font-mono text-hud-label text-foreground/70 cursor-pointer">
              <input
                type="checkbox"
                checked={includeIpc}
                onChange={(e) => setIncludeIpc(e.target.checked)}
                className="accent-primary"
              />
              INCLUDE IPC DESIGN CHECK
            </label>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!!error}
            className="font-mono text-hud-data uppercase tracking-[0.15em] bg-primary text-primary-foreground hover:bg-primary/80 gap-2 h-11 w-fit px-8"
          >
            <Play className="w-4 h-4" />
            Run Analysis
          </Button>
        </div>

        {/* Sidebar - parsed values */}
        <div className="flex flex-col gap-4">
          {parsed && (
            <>
              <HudCard title="PARSED_VALUES" compact>
                <div className="space-y-2 font-mono text-hud-data">
                  <div><span className="text-muted-foreground">PRODUCT:</span> <span className="text-foreground">{parsed.product || '—'}</span></div>
                  <div><span className="text-muted-foreground">REVISION:</span> <span className="text-foreground">{parsed.revision || 'A'}</span></div>
                  <div><span className="text-muted-foreground">QUANTITY:</span> <span className="text-primary">{parsed.target_quantity || '—'}</span></div>
                  <div><span className="text-muted-foreground">COMPONENTS:</span> <span className="text-primary">{parsed.components?.length || 0}</span></div>
                </div>
              </HudCard>

              {parsed.design_params && includeIpc && (
                <HudCard title="DESIGN_PARAMS" compact>
                  <div className="space-y-1.5 font-mono text-hud-data">
                    <div><span className="text-muted-foreground">IPC_CLASS:</span> <span className="text-primary">{parsed.design_params.ipc_class}</span></div>
                    <div><span className="text-muted-foreground">LAYERS:</span> <span className="text-foreground">{parsed.design_params.layer_count}</span></div>
                    <div><span className="text-muted-foreground">ANN_RING:</span> <span className="text-foreground">{parsed.design_params.min_annular_ring_mm}mm</span></div>
                    <div><span className="text-muted-foreground">TRACE_W:</span> <span className="text-foreground">{parsed.design_params.min_trace_width_mm}mm</span></div>
                    <div><span className="text-muted-foreground">CLEARANCE:</span> <span className="text-foreground">{parsed.design_params.min_clearance_mm}mm</span></div>
                    <div><span className="text-muted-foreground">FINISH:</span> <span className="text-foreground">{parsed.design_params.surface_finish}</span></div>
                  </div>
                </HudCard>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BomInputPage;
