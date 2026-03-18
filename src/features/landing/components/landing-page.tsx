import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useHealthCheck } from "@/api/health/use-health-check";
import { Button } from "@/components/ui/button";
import {
  Activity,
  ArrowRight,
  Cpu,
  Database,
  GitMerge,
  Target,
  Sparkles as SparklesIcon,
  FileJson,
  BarChart3,
  Fingerprint,
  Layers,
  Box,
  Maximize,
  AlertCircle,
} from "lucide-react";

// Aceternity UI Components
import { BackgroundBeams } from "@/components/ui/background-beams";
import { SparklesCore } from "@/components/ui/sparkles";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";

const APP_NAME = import.meta.env.VITE_APP_NAME || "BOX";
const APP_DESC =
  import.meta.env.VITE_APP_DESCRIPTION ||
  "Real-time BOM health. Before you commit.";

// Reusable Robotic Corner Component
const CyberCorners = () => (
  <>
    <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-white/20 rounded-sm shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:bg-cyan-500/80 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-[0_0_10px_#22d3ee]" />
    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white/20 rounded-sm shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:bg-cyan-500/80 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:shadow-[0_0_10px_#22d3ee]" />
    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-white/20 rounded-sm shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:bg-cyan-500/80 group-hover:-translate-x-1 group-hover:translate-y-1 group-hover:shadow-[0_0_10px_#22d3ee]" />
    <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-white/20 rounded-sm shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:bg-cyan-500/80 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-[0_0_10px_#22d3ee]" />
  </>
);

const LandingPage = () => {
  const { data: health } = useHealthCheck();
  const isConnected = health?.ollama === "connected";

  // Base fade up for main sections
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  } as any;

  // Staggered sequence for Data Plates in Step 1
  const plateContainerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  } as any;

  const plateVariant = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  } as any;

  // Terminal Line Sequential Reveal Animation in Step 2
  const terminalContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4, // Slower stagger for reading effect
        delayChildren: 0.4,
      },
    },
  } as any;

  const terminalLine = {
    hidden: { opacity: 0, x: -10, filter: "blur(4px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.3, ease: "easeOut" } },
  } as any;

  return (
    <main className="w-full bg-[#050505] text-foreground overflow-x-hidden selection:bg-cyan-500/30 font-sans relative">
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] z-0" />

      {/* =========================================
          1. HERO SECTION
      ========================================= */}
      <section className="w-full relative min-h-[94vh] flex flex-col items-center justify-center overflow-hidden antialiased z-10">
        <BackgroundBeams />

        <div className="relative z-20 flex-1 flex flex-col items-start justify-center px-8 py-16 max-w-6xl w-full mx-auto">
          {/* Robotic HUD Top Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between w-full mb-12 border-b border-white/10 pb-4"
          >
            <div className="flex items-center gap-3 font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase">
              <div
                className={`relative flex items-center justify-center w-4 h-4 rounded-sm border transition-colors duration-500 ${isConnected ? "border-cyan-500/50 bg-cyan-500/10" : "border-red-500/50 bg-red-500/10"}`}
              >
                {isConnected && (
                  <span className="absolute inline-flex h-2.5 w-2.5 rounded-sm bg-cyan-400 opacity-40 animate-ping" />
                )}
                <span
                  className={`relative z-10 w-1.5 h-1.5 rounded-sm transition-colors duration-500 ${isConnected ? "bg-cyan-400 shadow-[0_0_8px_#22d3ee]" : "bg-red-500 shadow-[0_0_8px_#ef4444]"}`}
                />
              </div>
              <span
                className={
                  isConnected
                    ? "text-cyan-400 font-bold"
                    : "text-red-500 font-bold"
                }
              >
                {isConnected ? "SYS.ONLINE" : "SYS.OFFLINE"}
              </span>
              <span className="text-white/20 hidden sm:inline">//</span>
              <span className="text-neutral-500 hidden sm:inline">
                CORE: {health?.model || "INITIALIZING..."}
              </span>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer hover:text-cyan-400 transition-colors">
              <Maximize className="w-4 h-4 text-white/30 group-hover:text-cyan-400 group-hover:scale-110 transition-all" />
            </div>
          </motion.div>

          <div className="relative w-full mb-6">
            <div className="absolute inset-0 w-[600px] h-[100px] -left-10 top-2 opacity-60 pointer-events-none mix-blend-screen">
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={2}
                particleDensity={120}
                className="w-full h-full"
                particleColor="#22d3ee"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex items-center gap-6 relative z-10"
            >
              <div className="relative w-16 h-16 bg-gradient-to-br from-neutral-800 to-black border-t border-l border-white/20 border-r border-b border-black flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,1),0_10px_30px_rgba(34,211,238,0.15)] rounded-xl group hover:scale-105 transition-transform duration-300">
                <CyberCorners />
                <Box className="w-8 h-8 text-cyan-400 animate-[spin_4s_linear_infinite] group-hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] transition-all" />
              </div>
              <h1 className="font-mono text-6xl md:text-[84px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-neutral-500 tracking-[0.05em] drop-shadow-lg">
                {APP_NAME}
              </h1>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative pl-6 py-2 mb-6"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-transparent rounded-full" />
            <p className="font-mono text-xl md:text-2xl text-cyan-400 tracking-wide uppercase font-semibold">
              {APP_DESC}
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-neutral-400 text-sm md:text-base mb-12 max-w-2xl leading-relaxed border border-white/5 bg-white/[0.02] p-6 rounded-lg backdrop-blur-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] hover:bg-white/[0.04] transition-colors duration-300 cursor-default"
          >
            Upload a BOM. Watch AI agents analyze every component in real-time.
            Identify supply chain risks, IPC compliance, version upgrades, and
            receive a definitive go/no-go recommendation —{" "}
            <span className="text-white font-mono border-b border-cyan-500/50 pb-0.5">
              ALL IN ONE SECURE STREAM.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center gap-6"
          >
            <Link to="/analyse">
              <Button
                size="lg"
                className="group relative h-14 px-8 font-mono text-sm font-bold uppercase tracking-[0.15em] text-black bg-cyan-400 hover:bg-cyan-300 overflow-hidden rounded-none shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:-translate-y-0.5 active:scale-95 active:shadow-[0_0_10px_rgba(34,211,238,0.3)]"
              >
                <span className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                <Cpu className="w-5 h-5 mr-3 relative z-10 group-hover:animate-pulse" />
                <span className="relative z-10">Initialize Scan</span>
                <ArrowRight className="w-5 h-5 ml-3 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </Link>

            <Link to="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="group h-14 px-8 font-mono text-sm font-bold uppercase tracking-[0.15em] border-white/20 text-white hover:bg-white/10 hover:text-cyan-400 hover:border-cyan-400/50 rounded-none bg-black/50 backdrop-blur-md shadow-[inset_0_0_10px_rgba(255,255,255,0.05)] transition-all active:scale-95"
              >
                <Activity className="w-4 h-4 mr-3 opacity-50 group-hover:opacity-100 group-hover:text-cyan-400 transition-all group-hover:scale-110" />
                Access Telemetry
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          2. WORKFLOW SECTION
      ========================================= */}
      <section className="relative w-full py-32 bg-[#020202] border-t border-white/10 z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Decorative Top Bracket */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-cyan-500/50 shadow-[0_0_15px_#22d3ee]" />

        <div className="max-w-6xl mx-auto px-8 mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-3xl md:text-5xl font-black text-white tracking-[0.1em] mb-4 flex items-center gap-4 drop-shadow-md uppercase"
          >
            <Layers className="text-cyan-400 w-10 h-10 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
            System_Architecture
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-neutral-400 max-w-2xl text-sm md:text-lg leading-relaxed font-mono"
          >
            [PIPELINE_ACTIVE] Breaking down hardware complexity into actionable,
            real-time insights. From raw BOM ingestion to futuristic product
            telemetry.
          </motion.p>
        </div>

        <TracingBeam className="px-6 md:px-0 max-w-5xl mx-auto">
          <div className="space-y-32 relative pl-4 md:pl-12 pt-4">
            
            {/* STEP 1: Component Ingestion Core */}
            <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="relative group">
              <CardContainer className="inter-var w-full">
                <CardBody className="bg-gradient-to-br from-[#111] to-[#050505] relative group/card border-t border-l  hover:border-white/20 border-r border-b border-black/80 w-full rounded-xl p-8 shadow-[inset_0_2px_20px_rgba(0,0,0,1),0_20px_40px_rgba(0,0,0,0.8)] transition-colors duration-500">
                  <CyberCorners />

                  <CardItem translateZ="40" className="flex items-center gap-4 mb-8 w-full border-b border-white/5 pb-6">
                    <div className="p-4 bg-black rounded border border-white/10 shadow-[inset_0_0_10px_rgba(34,211,238,0.1)] group-hover/card:shadow-[inset_0_0_20px_rgba(34,211,238,0.3)] transition-all duration-500 relative overflow-hidden">
                      {/* Sub-animation: Scanning laser in icon box */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent -translate-y-full group-hover/card:animate-[scan_1.5s_linear_infinite]" />
                      <Database className="w-6 h-6 text-cyan-400 relative z-10" />
                    </div>
                    <h3 className="font-mono text-xl tracking-[0.15em] text-white font-bold uppercase group-hover/card:text-cyan-50 transition-colors">
                      1. Component Ingestion Core
                    </h3>
                  </CardItem>

                  <CardItem translateZ="60" className="w-full">
                    <motion.div 
                      variants={plateContainerVariant}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full"
                    >
                      {/* Plate 1 */}
                      <motion.div variants={plateVariant} className="group/plate relative flex flex-col gap-3 p-5 bg-[#0a0a0a] border border-white/5 rounded shadow-inner hover:-translate-y-1 hover:border-white/20 hover:bg-[#0f0f0f] transition-all duration-300 overflow-hidden cursor-default">
                        {/* Sub-animation: Circuit pattern reveal on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover/plate:opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:10px_10px] transition-opacity duration-500" />
                        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-neutral-800 group-hover/plate:bg-cyan-500 group-hover/plate:shadow-[0_0_8px_#22d3ee] transition-all duration-300" />
                        
                        <Fingerprint className="w-5 h-5 text-neutral-500 group-hover/plate:text-cyan-400 group-hover/plate:scale-110 transition-all duration-300 relative z-10" />
                        <h4 className="font-mono text-sm text-neutral-300 uppercase tracking-wider relative z-10">Part Number DB</h4>
                        <p className="text-xs text-neutral-600 font-mono relative z-10">Historical specs & lifecycle sync.</p>
                      </motion.div>
                      
                      {/* Plate 2 */}
                      <motion.div variants={plateVariant} className="group/plate relative flex flex-col gap-3 p-5 bg-[#0a0a0a] border border-white/5 rounded shadow-inner hover:-translate-y-1 hover:border-white/20 hover:bg-[#0f0f0f] transition-all duration-300 overflow-hidden cursor-default">
                        <div className="absolute inset-0 opacity-0 group-hover/plate:opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:10px_10px] transition-opacity duration-500" />
                        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-neutral-800 group-hover/plate:bg-cyan-500 group-hover/plate:shadow-[0_0_8px_#22d3ee] transition-all duration-300" />
                        
                        <FileJson className="w-5 h-5 text-neutral-500 group-hover/plate:text-cyan-400 group-hover/plate:scale-110 transition-all duration-300 relative z-10" />
                        <h4 className="font-mono text-sm text-neutral-300 uppercase tracking-wider relative z-10">Parameter Extraction</h4>
                        <p className="text-xs text-neutral-600 font-mono relative z-10">Deep dive into voltage/tolerance parameters.</p>
                      </motion.div>

                      {/* Highlighted Reactor Plate */}
                      <motion.div variants={plateVariant} className="group/plate flex flex-col gap-3 p-5 bg-cyan-950/20 rounded border border-cyan-500/30 relative overflow-hidden shadow-[inset_0_0_20px_rgba(34,211,238,0.1)] hover:-translate-y-1 hover:shadow-[inset_0_0_30px_rgba(34,211,238,0.2),0_10px_20px_rgba(34,211,238,0.1)] hover:border-cyan-400/50 transition-all duration-300 cursor-default">
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full group-hover/plate:bg-cyan-400/30 transition-colors duration-500" />
                        {/* Sub-animation: Moving data border */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent -translate-x-full group-hover/plate:animate-[dataFlow_2s_linear_infinite]" />
                        
                        <Layers className="w-5 h-5 text-cyan-400 relative z-10 group-hover/plate:scale-110 transition-transform duration-300" />
                        <h4 className="font-mono text-sm text-cyan-300 font-bold relative z-10 uppercase tracking-widest">BOM Showdown Matrix</h4>
                        <p className="text-xs text-cyan-500/70 relative z-10 font-mono">Automated conflict resolution for component overlap.</p>
                      </motion.div>

                      {/* Plate 4 */}
                      <motion.div variants={plateVariant} className="group/plate relative flex flex-col gap-3 p-5 bg-[#0a0a0a] border border-white/5 rounded shadow-inner hover:-translate-y-1 hover:border-white/20 hover:bg-[#0f0f0f] transition-all duration-300 overflow-hidden cursor-default">
                        <div className="absolute inset-0 opacity-0 group-hover/plate:opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:10px_10px] transition-opacity duration-500" />
                        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-neutral-800 group-hover/plate:bg-cyan-500 group-hover/plate:shadow-[0_0_8px_#22d3ee] transition-all duration-300" />

                        <BarChart3 className="w-5 h-5 text-neutral-500 group-hover/plate:text-cyan-400 group-hover/plate:scale-110 transition-all duration-300 relative z-10" />
                        <h4 className="font-mono text-sm text-neutral-300 uppercase tracking-wider relative z-10">Field Telemetry</h4>
                        <p className="text-xs text-neutral-600 font-mono relative z-10">Live environmental stress scoring.</p>
                      </motion.div>
                    </motion.div>
                  </CardItem>
                </CardBody>
              </CardContainer>
            </motion.div>

            {/* STEP 2: Logic Routing Engine */}
            <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="relative group">
              <CardContainer className="inter-var w-full">
                <CardBody className="bg-gradient-to-br from-[#111] to-[#050505] relative group/card border-t border-l hover:border-white/20 border-r border-b border-black/80 w-full rounded-xl p-8 shadow-[inset_0_2px_20px_rgba(0,0,0,1),0_20px_40px_rgba(0,0,0,0.8)] transition-colors duration-500">
                  <CyberCorners />

                  <CardItem translateZ="40" className="flex items-center gap-4 mb-6 border-b border-white/5 pb-6">
                    <div className="p-4 bg-black rounded border border-white/10 shadow-[inset_0_0_10px_rgba(168,85,247,0.1)] group-hover/card:shadow-[inset_0_0_20px_rgba(168,85,247,0.3)] transition-all duration-500">
                      <GitMerge className="w-6 h-6 text-purple-400 group-hover/card:rotate-180 transition-transform duration-700 ease-in-out" />
                    </div>
                    <h3 className="font-mono text-xl tracking-[0.15em] text-white font-bold uppercase">2. Logic Routing Engine</h3>
                  </CardItem>

                  <CardItem translateZ="30" className="text-sm font-mono text-neutral-500 mb-8 max-w-xl">
                    Dynamic routing of RESOURCE data into actionable business
                    frameworks. Watch the neural net process inputs in real-time.
                  </CardItem>

                  {/* 3D Cyber Terminal */}
                  <CardItem translateZ="70" className="w-full bg-[#030303] border border-white/10 rounded overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,1)] relative animate-[crtFlicker_0.15s_infinite_alternate]">
                    {/* CRT Scanline Overlay */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-30 opacity-40 mix-blend-color-burn" />
                    <div className="absolute top-0 left-0 right-0 h-10 bg-white/5 blur-sm animate-[scanline_8s_linear_infinite] z-20 pointer-events-none" />

                    <div className="bg-[#0a0a0a] px-4 py-3 border-b border-white/10 flex justify-between items-center relative z-40">
                      <span className="font-mono text-[10px] text-neutral-500 uppercase flex items-center gap-3">
                        <div className="flex gap-1.5 hover:opacity-80 transition-opacity">
                          <motion.div whileTap={{ scale: 0.8 }} className="w-2.5 h-2.5 bg-red-500/80 rounded-sm cursor-pointer" />
                          <motion.div whileTap={{ scale: 0.8 }} className="w-2.5 h-2.5 bg-yellow-500/80 rounded-sm cursor-pointer" />
                          <motion.div whileTap={{ scale: 0.8 }} className="w-2.5 h-2.5 bg-green-500/80 rounded-sm cursor-pointer" />
                        </div>
                        <motion.span 
                          animate={{ opacity: [1, 0.4, 1] }} 
                          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} 
                          className="ml-2 font-bold tracking-widest text-purple-500/70"
                        >
                          TERMINAL_OVERRIDE
                        </motion.span>
                      </span>
                      <span className="font-mono text-[10px] text-purple-400 border border-purple-500/30 px-2 py-1 rounded bg-purple-950/30">SEQ_0X4A</span>
                    </div>
                    
                    <motion.div 
                      variants={terminalContainer}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-50px" }}
                      className="p-6 font-mono text-[13px] text-neutral-400 leading-relaxed border-l border-purple-500/50 ml-6 my-6 relative z-40 shadow-inner flex flex-col gap-1 min-h-[160px]"
                    >
                      <motion.div variants={terminalLine} className="text-purple-400 font-bold mb-2">{">"} EXECUTE_PROTOCOL: DIAGNOSTICS</motion.div>
                      <motion.div variants={terminalLine} className="text-neutral-600 hover:text-neutral-300 transition-colors cursor-default">[SYS] Mounting dependencies...</motion.div>
                      <motion.div variants={terminalLine} className="hover:text-white transition-colors cursor-default"><span className="text-cyan-400">[OK]</span> Parsed 421 nodes from BOM structure.</motion.div>
                      <motion.div variants={terminalLine} className="hover:text-white transition-colors cursor-default"><span className="text-cyan-400">[OK]</span> Cross-referencing IPC compliance databases...</motion.div>
                      <motion.div variants={terminalLine} className="mb-2 hover:text-white transition-colors cursor-default"><span className="text-yellow-400/90">[WARN]</span> Thermal variance detected in node #89.</motion.div>
                      <motion.div variants={terminalLine} className="text-green-400 font-black bg-green-950/30 px-2 py-1 border border-green-500/30 self-start inline-flex items-center gap-2 mt-2">
                        COMPUTING OPTIMAL SUPPLY CHAIN PATH 
                        <motion.span 
                          animate={{ opacity: [1, 0, 1] }} 
                          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                          className="w-2 h-3 bg-green-400"
                        />
                      </motion.div>
                    </motion.div>
                  </CardItem>
                </CardBody>
              </CardContainer>
            </motion.div>

            {/* STEP 3: Actionable Directives */}
            <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="relative group">
              <CardContainer className="inter-var w-full">
                <CardBody className="bg-gradient-to-br from-[#111] to-[#050505] relative group/card border-t border-l  hover:border-white/20 border-r border-b border-black/80 w-full rounded-xl p-8 shadow-[inset_0_2px_20px_rgba(0,0,0,1),0_20px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(34,211,238,0.05)] transition-colors duration-500">
                  <CyberCorners />

                  <CardItem translateZ="40" className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
                    <div className="p-4 bg-black rounded border border-white/10 shadow-[inset_0_0_10px_rgba(34,211,238,0.1)] group-hover/card:shadow-[inset_0_0_20px_rgba(34,211,238,0.3)] transition-all duration-500">
                      <Target className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="font-mono text-xl tracking-[0.15em] text-white font-bold uppercase">3. Actionable Directives</h3>
                  </CardItem>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <CardItem translateZ="30" className="text-sm font-mono text-neutral-500 leading-relaxed">
                      Synthesizing execution logic into binary directives. The
                      system highlights critical supply chain bottlenecks and
                      explicitly dictates go/no-go production status.
                    </CardItem>

                    <div className="flex flex-col gap-5 relative">
                      {/* Go/No-Go Indicator Block */}
                      <CardItem translateZ="60" className="flex flex-col w-full bg-[#0a0a0a] border border-white/10 hover:border-green-500/30 transition-colors duration-300 rounded shadow-2xl overflow-hidden group/status relative">
                        {/* Sub-animation: Hazard Stripe background on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover/status:opacity-5 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#22c55e_10px,#22c55e_20px)] transition-opacity duration-300" />
                        
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-green-500/50 shadow-[0_0_10px_#22c55e] hidden group-hover/status:block animate-[scan_2s_linear_infinite]" />
                        
                        <div className="bg-green-500/10 px-4 py-2 border-b border-green-500/20 flex items-center justify-between relative z-10">
                          <span className="font-mono text-[10px] text-green-500 font-bold tracking-widest uppercase flex items-center gap-2">
                            <Activity className="w-3 h-3 group-hover/status:animate-spin" style={{ animationDuration: '3s' }}/> Status
                          </span>
                        </div>
                        <div className="p-6 flex items-center justify-between relative z-10">
                          <motion.span 
                            initial={{ filter: "blur(10px)", opacity: 0, x: -10 }}
                            whileInView={{ filter: "blur(0px)", opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="font-mono text-2xl text-white font-black tracking-widest group-hover/status:text-green-50 transition-colors group-hover/status:animate-[glitch_0.3s_linear_infinite_alternate]"
                          >
                            APPROVED
                          </motion.span>
                          <span className="font-mono text-xs bg-green-500 text-black font-black px-4 py-2 rounded-sm shadow-[0_0_15px_rgba(34,197,94,0.4)] group-hover/status:shadow-[0_0_25px_rgba(34,197,94,0.7)] transition-shadow">PROTOTYPE_READY</span>
                        </div>
                      </CardItem>

                      {/* Animated Risk Factor Block */}
                      <CardItem translateZ="50" className="flex flex-col w-full p-4 bg-[#0a0a0a] border border-white/10 hover:border-yellow-500/30 transition-colors duration-300 rounded shadow-xl group/risk">
                        <div className="flex w-full items-center justify-between mb-2">
                          <span className="font-mono text-xs text-neutral-500 tracking-widest uppercase flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-yellow-500 animate-[pulse_2s_ease-in-out_infinite]" /> Risk Index
                          </span>
                          <span className="font-mono text-sm text-yellow-500 font-bold drop-shadow-[0_0_5px_rgba(234,179,8,0.5)] group-hover/risk:animate-pulse">
                            LOW [ 2.4% ]
                          </span>
                        </div>
                        {/* Animated Progress Bar */}
                        <div className="w-full bg-black rounded-full h-1.5 border border-white/5 overflow-hidden relative">
                           <motion.div 
                             initial={{ width: 0 }}
                             whileInView={{ width: "2.4%" }}
                             transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                             viewport={{ once: true }}
                             className="bg-yellow-500 h-full rounded-full shadow-[0_0_10px_rgba(234,179,8,0.8)] relative"
                           >
                             <div className="absolute inset-0 bg-white/20 animate-pulse" />
                             {/* Glowing Data Packet on progress line */}
                             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_#fff] group-hover/risk:animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
                           </motion.div>
                        </div>
                      </CardItem>
                    </div>
                  </div>
                </CardBody>
              </CardContainer>
            </motion.div>

            {/* STEP 4: Autonomous Evolution */}
            <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="relative group pb-20">
              <CardContainer className="inter-var w-full">
                <CardBody className="bg-gradient-to-br from-[#0a0f12] to-[#000] relative group/card border-t border-l border-cyan-500/30 hover:border-cyan-400/60 border-r border-b border-black w-full rounded-xl p-8 overflow-hidden shadow-[inset_0_0_40px_rgba(34,211,238,0.05),0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-500">
                  <CyberCorners />

                  {/* Reactor Core Glow Effect */}
                  <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[400px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen group-hover/card:bg-cyan-400/20 transition-colors duration-700" />

                  <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                    <CardItem translateZ="80" className="relative w-28 h-28 rounded-full bg-[#050505] flex items-center justify-center border-4 border-black shadow-[inset_0_0_20px_rgba(34,211,238,0.3),0_0_30px_rgba(34,211,238,0.2)] shrink-0 z-20">
                      
                      {/* Shockwave rings */}
                      <motion.div 
                        animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeOut" }}
                        className="absolute inset-[-4px] rounded-full border border-cyan-400/50 z-0" 
                      />

                      {/* Rotating Cyber Ring */}
                      <div className="absolute inset-[-4px] rounded-full border border-cyan-500/30 border-cyan-400 animate-[spin_4s_linear_infinite] z-10" />
                      
                      {/* Floating Core Icon */}
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="relative z-20"
                      >
                        <SparklesIcon className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,1)]" />
                      </motion.div>
                    </CardItem>

                    <CardItem translateZ="40" className="flex-1 relative z-10">
                      {/* Sub-animation: Moving text gradient */}
                      <h3 className="font-mono text-xl md:text-3xl font-black tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-white bg-[length:200%_auto] animate-[gradientShift_3s_linear_infinite] uppercase mb-4">
                        4. Autonomous Evolution
                      </h3>
                      <p className="text-sm md:text-base font-mono text-neutral-400 leading-relaxed border-l-2 border-cyan-500/50 pl-6 py-2 bg-gradient-to-r from-cyan-950/20 to-transparent group-hover/card:border-cyan-400 transition-colors">
                        Evolving beyond static analysis. The platform acts as an
                        autonomous hardware engineering partner—predicting
                        supply chain disruptions, automatically generating
                        alternative schematics, and negotiating component
                        pricing via agentic workflows.
                      </p>
                    </CardItem>
                  </div>
                </CardBody>
              </CardContainer>
            </motion.div>
          </div>
        </TracingBeam>
      </section>

      {/* Global Styles for new Custom Keyframes */}
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        @keyframes dataFlow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes scanline {
          0% { transform: translateY(-10px); }
          100% { transform: translateY(200px); }
        }
        @keyframes crtFlicker {
          0% { opacity: 0.95; }
          100% { opacity: 1; }
        }
        @keyframes glitch {
          0% { transform: translate(0); text-shadow: -2px 0 red, 2px 0 cyan; }
          20% { transform: translate(-2px, 1px); text-shadow: -2px 0 red, 2px 0 cyan; }
          40% { transform: translate(-1px, -1px); text-shadow: 2px 0 red, -2px 0 cyan; }
          60% { transform: translate(2px, 1px); text-shadow: -2px 0 red, 2px 0 cyan; }
          80% { transform: translate(1px, -1px); text-shadow: 2px 0 red, -2px 0 cyan; }
          100% { transform: translate(0); text-shadow: none; }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </main>
  );
};

export default LandingPage;







// import React from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { useHealthCheck } from "@/api/health/use-health-check";
// import { Button } from "@/components/ui/button";
// import {
//   Activity,
//   ArrowRight,
//   Cpu,
//   Zap,
//   Database,
//   GitMerge,
//   Target,
//   Sparkles as SparklesIcon,
//   FileJson,
//   BarChart3,
//   Fingerprint,
//   Layers,
//   Box,
//   Maximize,
//   AlertCircle,
// } from "lucide-react";

// // Aceternity UI Components
// import { BackgroundBeams } from "@/components/ui/background-beams";
// import { SparklesCore } from "@/components/ui/sparkles";
// import { TracingBeam } from "@/components/ui/tracing-beam";
// import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";

// const APP_NAME = import.meta.env.VITE_APP_NAME || "BOX";
// const APP_DESC =
//   import.meta.env.VITE_APP_DESCRIPTION ||
//   "Real-time BOM health. Before you commit.";

// // Reusable Robotic Corner Component
// const CyberCorners = () => (
//   <>
//     <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-white/20 rounded-sm shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]" />
//     <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white/20 rounded-sm shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]" />
//     <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-white/20 rounded-sm shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]" />
//     <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-white/20 rounded-sm shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]" />
//   </>
// );

// const LandingPage = () => {
//   const { data: health } = useHealthCheck();
//   const isConnected = health?.ollama === "connected";

//   return (
//     <main className="w-full bg-[#050505] text-foreground overflow-x-hidden selection:bg-cyan-500/30 font-sans relative">
//       {/* Global Tech Grid Overlay */}
//       <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] z-0" />

//       {/* =========================================
//           1. HERO SECTION (Aceternity Beams & Sparkles)
//       ========================================= */}
//       <section className="w-full relative min-h-[94vh] flex flex-col items-center justify-center overflow-hidden antialiased z-10">
//         <BackgroundBeams />

//         <div className="relative z-20 flex-1 flex flex-col items-start justify-center px-8 py-16 max-w-6xl w-full mx-auto">
//           {/* Robotic HUD Top Bar */}
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="flex items-center justify-between w-full mb-12 border-b border-white/10 pb-4"
//           >
//             <div className="flex items-center gap-3 font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase">
//               <div
//                 className={`relative flex items-center justify-center w-4 h-4 rounded-sm border ${isConnected ? "border-cyan-500/50 bg-cyan-500/10" : "border-red-500/50 bg-red-500/10"}`}
//               >
//                 <span
//                   className={`w-1.5 h-1.5 rounded-sm ${isConnected ? "bg-cyan-400 shadow-[0_0_8px_#22d3ee]" : "bg-red-500 shadow-[0_0_8px_#ef4444]"}`}
//                 />
//               </div>
//               <span
//                 className={
//                   isConnected
//                     ? "text-cyan-400 font-bold"
//                     : "text-red-500 font-bold"
//                 }
//               >
//                 {isConnected ? "SYS.ONLINE" : "SYS.OFFLINE"}
//               </span>
//               <span className="text-white/20 hidden sm:inline">//</span>
//               <span className="text-neutral-500 hidden sm:inline">
//                 CORE: {health?.model || "INITIALIZING..."}
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Maximize className="w-4 h-4 text-white/30" />
//             </div>
//           </motion.div>

//           <div className="relative w-full mb-6">
//             <div className="absolute inset-0 w-[600px] h-[100px] -left-10 top-2 opacity-60 pointer-events-none mix-blend-screen">
//               <SparklesCore
//                 background="transparent"
//                 minSize={0.4}
//                 maxSize={2}
//                 particleDensity={120}
//                 className="w-full h-full"
//                 particleColor="#22d3ee"
//               />
//             </div>

//             <motion.div
//               initial={{ opacity: 0, x: -30 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5, ease: "easeOut" }}
//               className="flex items-center gap-6 relative z-10"
//             >
//               {/* 3D Hardware Block Icon */}
//               {/* <div className="relative w-16 h-16 bg-gradient-to-br from-neutral-800 to-black border-t border-l border-white/20 border-r border-b border-black flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,1),0_10px_30px_rgba(34,211,238,0.15)] rounded-xl group hover:scale-105 transition-transform">
//                 <CyberCorners />
//                 <Box className="w-8 h-8 text-cyan-400 group-hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] transition-all" />
//               </div> */}

//               <div className="relative w-16 h-16 bg-gradient-to-br from-neutral-800 to-black border-t border-l border-white/20 border-r border-b border-black flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,1),0_10px_30px_rgba(34,211,238,0.15)] rounded-xl group hover:scale-105 transition-transform">
//                 <CyberCorners />
//                 {/* Added a slow, infinite spin to the Box */}
//                 <Box className="w-8 h-8 text-cyan-400 animate-[spin_4s_linear_infinite] group-hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] transition-all" />
//               </div>

//               <h1 className="font-mono text-6xl md:text-[84px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-neutral-500 tracking-[0.05em] drop-shadow-lg">
//                 {APP_NAME}
//               </h1>
//             </motion.div>
//           </div>

//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.2 }}
//             className="relative pl-6 py-2 mb-6"
//           >
//             <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-transparent" />
//             <p className="font-mono text-xl md:text-2xl text-cyan-400 tracking-wide uppercase font-semibold">
//               {APP_DESC}
//             </p>
//           </motion.div>

//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.3 }}
//             className="text-neutral-400 text-sm md:text-base mb-12 max-w-2xl leading-relaxed border border-white/5 bg-white/[0.02] p-6 rounded-lg backdrop-blur-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
//           >
//             Upload a BOM. Watch AI agents analyze every component in real-time.
//             Identify supply chain risks, IPC compliance, version upgrades, and
//             receive a definitive go/no-go recommendation —{" "}
//             <span className="text-white font-mono">
//               ALL IN ONE SECURE STREAM.
//             </span>
//           </motion.p>

//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className="flex flex-wrap items-center gap-6"
//           >
//             {/* Cybernetic Button */}
//             <Link to="/analyse">
//               <Button
//                 size="lg"
//                 className="group relative h-14 px-8 font-mono text-sm font-bold uppercase tracking-[0.15em] text-black bg-cyan-400 hover:bg-cyan-300 overflow-hidden rounded-none clip-path-slant shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all"
//               >
//                 <span className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
//                 <Cpu className="w-5 h-5 mr-3 relative z-10" />
//                 <span className="relative z-10">Initialize Scan</span>
//                 <ArrowRight className="w-5 h-5 ml-3 relative z-10 group-hover:translate-x-2 transition-transform" />
//               </Button>
//             </Link>

//             <Link to="/dashboard">
//               <Button
//                 variant="outline"
//                 size="lg"
//                 className="h-14 px-8 font-mono text-sm font-bold uppercase tracking-[0.15em] border-white/20 text-white hover:bg-white/10 hover:text-cyan-400 rounded-none bg-black/50 backdrop-blur-md shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]"
//               >
//                 Access Telemetry
//               </Button>
//             </Link>
//           </motion.div>
//         </div>
//       </section>

//       {/* =========================================
//           2. WORKFLOW SECTION (Aceternity Tracing Beam & 3D Cards)
//       ========================================= */}
//       <section className="relative w-full py-32 bg-[#020202] border-t border-white/10 z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
//         {/* Decorative Top Bracket */}
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-cyan-500/50 shadow-[0_0_10px_#22d3ee]" />

//         <div className="max-w-6xl mx-auto px-8 mb-20">
//           <h2 className="font-mono text-3xl md:text-5xl font-black text-white tracking-[0.1em] mb-4 flex items-center gap-4 drop-shadow-md uppercase">
//             <Layers className="text-cyan-400 w-10 h-10 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
//             System_Architecture
//           </h2>
//           <p className="text-neutral-400 max-w-2xl text-sm md:text-lg leading-relaxed font-mono">
//             [PIPELINE_ACTIVE] Breaking down hardware complexity into actionable,
//             real-time insights. From raw BOM ingestion to futuristic product
//             telemetry.
//           </p>
//         </div>

//         <TracingBeam className="px-6 md:px-0 max-w-5xl mx-auto">
//           <div className="space-y-32 relative pl-4 md:pl-12 pt-4">
//             {/* STEP 1: Product Design & Resources */}
//             <div className="relative group">
//               <CardContainer className="inter-var w-full">
//                 <CardBody className="bg-gradient-to-br from-[#111] to-[#050505] relative group/card border-t border-l border-white/20 border-r border-b border-black/80 w-full rounded-xl p-8 shadow-[inset_0_2px_20px_rgba(0,0,0,1),0_20px_40px_rgba(0,0,0,0.8)]">
//                   <CyberCorners />

//                   <CardItem
//                     translateZ="40"
//                     className="flex items-center gap-4 mb-8 w-full border-b border-white/5 pb-6"
//                   >
//                     <div className="p-4 bg-black rounded border border-white/10 shadow-[inset_0_0_10px_rgba(34,211,238,0.2)]">
//                       <Database className="w-6 h-6 text-cyan-400" />
//                     </div>
//                     <h3 className="font-mono text-xl tracking-[0.15em] text-white font-bold uppercase">
//                       1. Component Ingestion Core
//                     </h3>
//                   </CardItem>

//                   <CardItem
//                     translateZ="60"
//                     className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full"
//                   >
//                     {/* Standard Data Plate */}
//                     <div className="flex flex-col gap-3 p-5 bg-[#0a0a0a] border border-white/5 rounded shadow-inner">
//                       <Fingerprint className="w-5 h-5 text-neutral-500" />
//                       <h4 className="font-mono text-sm text-neutral-300 uppercase tracking-wider">
//                         Part Number DB
//                       </h4>
//                       <p className="text-xs text-neutral-600 font-mono">
//                         Historical specs & lifecycle sync.
//                       </p>
//                     </div>
//                     <div className="flex flex-col gap-3 p-5 bg-[#0a0a0a] border border-white/5 rounded shadow-inner">
//                       <FileJson className="w-5 h-5 text-neutral-500" />
//                       <h4 className="font-mono text-sm text-neutral-300 uppercase tracking-wider">
//                         Parameter Extraction
//                       </h4>
//                       <p className="text-xs text-neutral-600 font-mono">
//                         Deep dive into voltage/tolerance parameters.
//                       </p>
//                     </div>

//                     {/* Highlighted Reactor Plate */}
//                     <div className="flex flex-col gap-3 p-5 bg-cyan-950/20 rounded border border-cyan-500/30 relative overflow-hidden shadow-[inset_0_0_20px_rgba(34,211,238,0.1)]">
//                       <div className="absolute -right-10 -top-10 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full" />
//                       <Layers className="w-5 h-5 text-cyan-400 relative z-10" />
//                       <h4 className="font-mono text-sm text-cyan-300 font-bold relative z-10 uppercase tracking-widest">
//                         BOM Showdown Matrix
//                       </h4>
//                       <p className="text-xs text-cyan-500/70 relative z-10 font-mono">
//                         Automated conflict resolution for component overlap.
//                       </p>
//                     </div>

//                     <div className="flex flex-col gap-3 p-5 bg-[#0a0a0a] border border-white/5 rounded shadow-inner">
//                       <BarChart3 className="w-5 h-5 text-neutral-500" />
//                       <h4 className="font-mono text-sm text-neutral-300 uppercase tracking-wider">
//                         Field Telemetry
//                       </h4>
//                       <p className="text-xs text-neutral-600 font-mono">
//                         Live environmental stress scoring.
//                       </p>
//                     </div>
//                   </CardItem>
//                 </CardBody>
//               </CardContainer>
//             </div>

//             {/* STEP 2: Execution Logic Model */}
//             <div className="relative group">
//               <CardContainer className="inter-var w-full">
//                 <CardBody className="bg-gradient-to-br from-[#111] to-[#050505] relative group/card border-t border-l border-white/20 border-r border-b border-black/80 w-full rounded-xl p-8 shadow-[inset_0_2px_20px_rgba(0,0,0,1),0_20px_40px_rgba(0,0,0,0.8)]">
//                   <CyberCorners />

//                   <CardItem
//                     translateZ="40"
//                     className="flex items-center gap-4 mb-6 border-b border-white/5 pb-6"
//                   >
//                     <div className="p-4 bg-black rounded border border-white/10 shadow-[inset_0_0_10px_rgba(168,85,247,0.2)]">
//                       <GitMerge className="w-6 h-6 text-purple-400" />
//                     </div>
//                     <h3 className="font-mono text-xl tracking-[0.15em] text-white font-bold uppercase">
//                       2. Logic Routing Engine
//                     </h3>
//                   </CardItem>

//                   <CardItem
//                     translateZ="30"
//                     className="text-sm font-mono text-neutral-500 mb-8 max-w-xl"
//                   >
//                     Dynamic routing of RESOURCE data into actionable business
//                     frameworks. Watch the neural net process inputs in
//                     real-time.
//                   </CardItem>

//                   {/* 3D Cyber Terminal */}
//                   <CardItem
//                     translateZ="70"
//                     className="w-full bg-[#030303] border border-white/10 rounded overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,1)] relative"
//                   >
//                     {/* Scanline Overlay */}
//                     <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-10 opacity-30" />

//                     <div className="bg-[#0a0a0a] px-4 py-3 border-b border-white/10 flex justify-between items-center relative z-20">
//                       <span className="font-mono text-[10px] text-neutral-500 uppercase flex items-center gap-3">
//                         <div className="flex gap-1.5">
//                           <div className="w-2.5 h-2.5 bg-red-500/80 rounded-sm" />
//                           <div className="w-2.5 h-2.5 bg-yellow-500/80 rounded-sm" />
//                           <div className="w-2.5 h-2.5 bg-green-500/80 rounded-sm" />
//                         </div>
//                         <span className="ml-2 font-bold tracking-widest text-purple-500/70">
//                           TERMINAL_OVERRIDE
//                         </span>
//                       </span>
//                       <span className="font-mono text-[10px] text-purple-400 border border-purple-500/30 px-2 py-1 rounded bg-purple-950/30">
//                         SEQ_0X4A
//                       </span>
//                     </div>
//                     <div className="p-6 font-mono text-[13px] text-neutral-400 leading-relaxed border-l border-purple-500/50 ml-6 my-6 relative z-20 shadow-inner">
//                       <span className="text-purple-400 font-bold">
//                         {">"} EXECUTE_PROTOCOL: DIAGNOSTICS
//                       </span>
//                       <br />
//                       <br />
//                       <span className="text-neutral-600">
//                         [SYS] Mounting dependencies...
//                       </span>
//                       <br />
//                       <span className="text-cyan-400">[OK]</span> Parsed 421
//                       nodes from BOM structure.
//                       <br />
//                       <span className="text-cyan-400">[OK]</span>{" "}
//                       Cross-referencing IPC compliance databases...
//                       <br />
//                       <span className="text-yellow-400/90">[WARN]</span> Thermal
//                       variance detected in node #89.
//                       <br />
//                       <br />
//                       <span className="text-green-400 font-black animate-pulse bg-green-950/30 px-2 py-1 border border-green-500/30">
//                         COMPUTING OPTIMAL SUPPLY CHAIN PATH...
//                       </span>
//                     </div>
//                   </CardItem>
//                 </CardBody>
//               </CardContainer>
//             </div>

//             {/* STEP 3: Strategic Recommendation */}
//             <div className="relative group">
//               <CardContainer className="inter-var w-full">
//                 <CardBody className="bg-gradient-to-br from-[#111] to-[#050505] relative group/card border-t border-l border-white/20 border-r border-b border-black/80 w-full rounded-xl p-8 shadow-[inset_0_2px_20px_rgba(0,0,0,1),0_20px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(34,211,238,0.05)]">
//                   <CyberCorners />

//                   <CardItem
//                     translateZ="40"
//                     className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6"
//                   >
//                     <div className="p-4 bg-black rounded border border-white/10 shadow-[inset_0_0_10px_rgba(34,211,238,0.2)]">
//                       <Target className="w-6 h-6 text-cyan-400" />
//                     </div>
//                     <h3 className="font-mono text-xl tracking-[0.15em] text-white font-bold uppercase">
//                       3. Actionable Directives
//                     </h3>
//                   </CardItem>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
//                     <CardItem
//                       translateZ="30"
//                       className="text-sm font-mono text-neutral-500 leading-relaxed"
//                     >
//                       Synthesizing execution logic into binary directives. The
//                       system highlights critical supply chain bottlenecks and
//                       explicitly dictates go/no-go production status.
//                     </CardItem>

//                     <div className="flex flex-col gap-5 relative">
//                       {/* Go/No-Go Indicator Block */}
//                       <CardItem
//                         translateZ="60"
//                         className="flex flex-col w-full bg-[#0a0a0a] border border-white/10 rounded shadow-2xl overflow-hidden"
//                       >
//                         <div className="bg-green-500/10 px-4 py-2 border-b border-green-500/20 flex items-center justify-between">
//                           <span className="font-mono text-[10px] text-green-500 font-bold tracking-widest uppercase flex items-center gap-2">
//                             <Activity className="w-3 h-3" /> Status
//                           </span>
//                         </div>
//                         <div className="p-6 flex items-center justify-between">
//                           <span className="font-mono text-2xl text-white font-black tracking-widest">
//                             APPROVED
//                           </span>
//                           <span className="font-mono text-xs bg-green-500 text-black font-black px-4 py-2 rounded-sm shadow-[0_0_15px_rgba(34,197,94,0.4)]">
//                             PROTOTYPE_READY
//                           </span>
//                         </div>
//                       </CardItem>

//                       {/* Risk Factor Block */}
//                       <CardItem
//                         translateZ="50"
//                         className="flex w-full items-center justify-between p-4 bg-[#0a0a0a] border border-white/10 rounded shadow-xl"
//                       >
//                         <span className="font-mono text-xs text-neutral-500 tracking-widest uppercase flex items-center gap-2">
//                           <AlertCircle className="w-4 h-4 text-yellow-500" />{" "}
//                           Risk Index
//                         </span>
//                         <span className="font-mono text-sm text-yellow-500 font-bold drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]">
//                           LOW [ 2.4% ]
//                         </span>
//                       </CardItem>
//                     </div>
//                   </div>
//                 </CardBody>
//               </CardContainer>
//             </div>

//             {/* STEP 4: Futuristic Vision */}
//             <div className="relative group pb-20">
//               <CardContainer className="inter-var w-full">
//                 <CardBody className="bg-gradient-to-br from-[#0a0f12] to-[#000] relative group/card border-t border-l border-cyan-500/30 border-r border-b border-black w-full rounded-xl p-8 overflow-hidden shadow-[inset_0_0_40px_rgba(34,211,238,0.05),0_20px_50px_rgba(0,0,0,0.8)]">
//                   <CyberCorners />

//                   {/* Reactor Core Glow Effect */}
//                   <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[400px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

//                   <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
//                     <CardItem
//                       translateZ="80"
//                       className="relative w-28 h-28 rounded-full bg-[#050505] flex items-center justify-center border-4 border-black shadow-[inset_0_0_20px_rgba(34,211,238,0.3),0_0_30px_rgba(34,211,238,0.2)] shrink-0"
//                     >
//                       {/* Rotating Cyber Ring */}
//                       <div className="absolute inset-[-4px] rounded-full border border-cyan-500/30 border-t-cyan-400 animate-[spin_4s_linear_infinite]" />
//                       <SparklesIcon className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
//                     </CardItem>

//                     <CardItem translateZ="40" className="flex-1">
//                       <h3 className="font-mono text-xl md:text-3xl font-black tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-500 uppercase mb-4">
//                         4. Autonomous Evolution
//                       </h3>
//                       <p className="text-sm md:text-base font-mono text-neutral-400 leading-relaxed border-l-2 border-cyan-500/50 pl-6 py-2 bg-gradient-to-r from-cyan-950/20 to-transparent">
//                         Evolving beyond static analysis. The platform acts as an
//                         autonomous hardware engineering partner—predicting
//                         supply chain disruptions, automatically generating
//                         alternative schematics, and negotiating component
//                         pricing via agentic workflows.
//                       </p>
//                     </CardItem>
//                   </div>
//                 </CardBody>
//               </CardContainer>
//             </div>
//           </div>
//         </TracingBeam>
//       </section>
//     </main>
//   );
// };

// export default LandingPage;


















// import React from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { useHealthCheck } from "@/api/health/use-health-check";
// import { Button } from "@/components/ui/button";
// import {
//   Activity, ArrowRight, Cpu, Zap,
//   Database, GitMerge, Target, Sparkles as SparklesIcon,
//   FileJson, BarChart3, Fingerprint, Layers, Box
// } from "lucide-react";

// // Aceternity UI Components
// import { BackgroundBeams } from "@/components/ui/background-beams";
// import { SparklesCore } from "@/components/ui/sparkles";
// import { TracingBeam } from "@/components/ui/tracing-beam";
// import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";

// const APP_NAME = import.meta.env.VITE_APP_NAME || "BOX";
// const APP_DESC = import.meta.env.VITE_APP_DESCRIPTION || "Real-time BOM health. Before you commit.";

// const LandingPage = () => {
//   const { data: health } = useHealthCheck();
//   const isConnected = health?.ollama === "connected";

//   return (
//     <main className="w-full bg-neutral-950 text-foreground overflow-x-hidden selection:bg-primary/30">

//       {/* =========================================
//           1. HERO SECTION (Aceternity Beams & Sparkles)
//       ========================================= */}
//       <section className="w-full relative min-h-[94vh] flex flex-col items-center justify-center overflow-hidden antialiased">

//         {/* Aceternity Interactive Background */}
//         <BackgroundBeams />

//         <div className="relative z-20 flex-1 flex flex-col items-start justify-center px-8 py-16 max-w-5xl w-full mx-auto">

//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 mb-8 font-mono text-xs tracking-widest uppercase">
//             <span className={`w-2 h-2 rounded-full shadow-[0_0_12px_currentColor] ${isConnected ? "bg-green-500 text-green-500" : "bg-red-500 text-red-500"}`} />
//             <span className={isConnected ? "text-green-500" : "text-red-500"}>
//               {isConnected ? "SYSTEM_READY" : "SYSTEM_OFFLINE"}
//             </span>
//             <span className="text-muted-foreground mx-2">|</span>
//             <span className="text-muted-foreground">MODEL: {health?.model || "LOADING..."}</span>
//           </motion.div>

//           <div className="relative w-full mb-4">
//             {/* Aceternity Sparkles strictly behind the title */}
//             <div className="absolute inset-0 w-[600px] h-[100px] -left-10 top-2 opacity-50 pointer-events-none">
//               <SparklesCore
//                 background="transparent"
//                 minSize={0.4}
//                 maxSize={1.5}
//                 particleDensity={100}
//                 className="w-full h-full"
//                 particleColor="#ffffff"
//               />
//             </div>

//             <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="flex items-center gap-4 relative z-10">
//               <div className="w-14 h-14 border border-primary/40 flex items-center justify-center shadow-[0_0_25px_rgba(var(--primary),0.2)] bg-black/50 backdrop-blur-md rounded-lg">
//                 <Box className="w-7 h-7 text-primary" />
//               </div>
//               <h1 className="font-mono text-5xl md:text-[72px] font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40 tracking-[0.1em]">
//                 {APP_NAME}
//               </h1>
//             </motion.div>
//           </div>

//           <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="font-mono text-xl text-primary mb-4 normal-case border-l-2 border-primary/70 pl-4 py-1">
//             {APP_DESC}
//           </motion.p>

//           <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-neutral-400 text-sm md:text-base mb-12 max-w-xl leading-relaxed">
//             Upload a BOM. Watch AI agents analyse every component in real-time.
//             Get supply chain risk, IPC compliance, version upgrades, and a
//             go/no-go recommendation — all in one stream.
//           </motion.p>

//           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-wrap items-center gap-4">
//             <Link to="/analyse">
//               <Button size="lg" className="font-mono text-xs uppercase tracking-[0.15em] gap-2 px-8 h-14 relative overflow-hidden group bg-primary hover:bg-primary/90 text-primary-foreground">
//                 <Cpu className="w-4 h-4 relative z-10" />
//                 <span className="relative z-10">Analyse a BOM</span>
//                 <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
//               </Button>
//             </Link>
//             <Link to="/dashboard">
//               <Button variant="outline" size="lg" className="font-mono text-xs uppercase tracking-[0.15em] border-neutral-800 text-neutral-300 hover:bg-neutral-900 h-14 backdrop-blur-sm">
//                 View Dashboard
//               </Button>
//             </Link>
//           </motion.div>
//         </div>
//       </section>

//       {/* =========================================
//           2. WORKFLOW SECTION (Aceternity Tracing Beam & 3D Cards)
//       ========================================= */}
//       <section className="relative w-full py-32 bg-black border-t border-white/5">
//         <div className="max-w-5xl mx-auto px-8 mb-16">
//           <h2 className="font-mono text-3xl md:text-4xl font-bold text-white tracking-[0.1em] mb-4 flex items-center gap-4">
//             <Layers className="text-primary w-8 h-8" />
//             SYSTEM_ARCHITECTURE
//           </h2>
//           <p className="text-neutral-400 max-w-2xl text-sm md:text-base leading-relaxed">
//             Our intelligent pipeline breaks down hardware complexity into actionable, real-time insights. From raw BOM ingestion to futuristic product telemetry.
//           </p>
//         </div>

//         {/* Aceternity Tracing Beam wraps the timeline content */}
//         <TracingBeam className="px-6 md:px-0 max-w-5xl mx-auto">
//           <div className="space-y-24 relative pl-4 md:pl-12 pt-4">

//             {/* STEP 1: Product Design & Resources */}
//             <div className="relative group">
//               <CardContainer className="inter-var w-full">
//                 <CardBody className="bg-neutral-950 relative group/card hover:shadow-2xl hover:shadow-primary/[0.1] border-white/5 w-full rounded-xl p-8 border">

//                   <CardItem translateZ="30" className="flex items-center gap-4 mb-8 w-full">
//                     <div className="p-3 bg-neutral-900 rounded-lg border border-white/10">
//                       <Database className="w-6 h-6 text-primary" />
//                     </div>
//                     <h3 className="font-mono text-xl tracking-[0.1em] text-white font-semibold uppercase">1. Product Design & Resources</h3>
//                   </CardItem>

//                   <CardItem translateZ="50" className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
//                     <div className="flex flex-col gap-2 p-5 bg-black rounded-lg border border-white/5">
//                       <Fingerprint className="w-5 h-5 text-neutral-500" />
//                       <h4 className="font-mono text-sm text-neutral-200">Part Number Report</h4>
//                       <p className="text-xs text-neutral-500">Detailed historical specs and lifecycle status.</p>
//                     </div>
//                     <div className="flex flex-col gap-2 p-5 bg-black rounded-lg border border-white/5">
//                       <FileJson className="w-5 h-5 text-neutral-500" />
//                       <h4 className="font-mono text-sm text-neutral-200">Component Report</h4>
//                       <p className="text-xs text-neutral-500">Deep dive into individual component parameters.</p>
//                     </div>
//                     {/* Highlighted Block */}
//                     <div className="flex flex-col gap-2 p-5 bg-primary/10 rounded-lg border border-primary/30 relative overflow-hidden">
//                       <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/20 blur-xl rounded-full" />
//                       <Layers className="w-5 h-5 text-primary relative z-10" />
//                       <h4 className="font-mono text-sm text-primary font-bold relative z-10">BOM Input & Showdown</h4>
//                       <p className="text-xs text-primary/70 relative z-10">Automated conflict resolution for overlapping parts.</p>
//                     </div>
//                     <div className="flex flex-col gap-2 p-5 bg-black rounded-lg border border-white/5">
//                       <BarChart3 className="w-5 h-5 text-neutral-500" />
//                       <h4 className="font-mono text-sm text-neutral-200">Product Telemetry</h4>
//                       <p className="text-xs text-neutral-500">Live field-data integration for reliability scores.</p>
//                     </div>
//                   </CardItem>

//                 </CardBody>
//               </CardContainer>
//             </div>

//             {/* STEP 2: Business Model Execution */}
//             <div className="relative group">
//               <CardContainer className="inter-var w-full">
//                 <CardBody className="bg-neutral-950 relative group/card hover:shadow-2xl hover:shadow-primary/[0.1] border-white/5 w-full rounded-xl p-8 border">

//                   <CardItem translateZ="30" className="flex items-center gap-4 mb-6">
//                     <div className="p-3 bg-neutral-900 rounded-lg border border-white/10">
//                       <GitMerge className="w-6 h-6 text-primary" />
//                     </div>
//                     <h3 className="font-mono text-xl tracking-[0.1em] text-white font-semibold uppercase">2. Execution Logic Model</h3>
//                   </CardItem>

//                   <CardItem translateZ="20" className="text-sm text-neutral-400 mb-8 max-w-xl">
//                     Dynamic routing of RESOURCE data into actionable business frameworks. Watch the system ingest and process inputs in real-time.
//                   </CardItem>

//                   {/* 3D Terminal Simulation */}
//                   <CardItem translateZ="60" className="w-full bg-black border border-white/10 rounded-lg overflow-hidden shadow-2xl relative">
//                     <div className="bg-[#111] px-4 py-3 border-b border-white/5 flex justify-between items-center">
//                       <span className="font-mono text-xs text-neutral-500 uppercase flex items-center gap-2">
//                         <div className="w-2 h-2 bg-red-500/80 rounded-full" />
//                         <div className="w-2 h-2 bg-yellow-500/80 rounded-full" />
//                         <div className="w-2 h-2 bg-green-500/80 rounded-full" />
//                         <span className="ml-2">Active Drill-down</span>
//                       </span>
//                       <span className="font-mono text-[10px] text-primary border border-primary/30 px-2 py-0.5 rounded">STEP_01_INFO</span>
//                     </div>
//                     <div className="p-6 font-mono text-sm text-neutral-300 leading-loose border-l-2 border-primary ml-6 my-6 relative">
//                       <span className="text-primary font-bold">{">"} INIT_LOGIC_SEQUENCE</span><br/>
//                       <span className="text-neutral-500">Loading resource dependencies...</span><br/>
//                       <span className="text-white">[OK]</span> Parsed 421 components from BOM Showdown.<br/>
//                       <span className="text-white">[OK]</span> Telemetry threshold met. Validating against constraints...<br/>
//                       <span className="text-green-400/90 font-bold">Yielding highest margin execution path.</span>
//                     </div>
//                   </CardItem>

//                 </CardBody>
//               </CardContainer>
//             </div>

//             {/* STEP 3: Strategic Recommendation */}
//             <div className="relative group">
//               <CardContainer className="inter-var w-full">
//                 <CardBody className="bg-neutral-950 relative group/card border-primary/20 w-full rounded-xl p-8 border shadow-[0_0_30px_rgba(var(--primary),0.05)]">

//                   <CardItem translateZ="30" className="flex items-center gap-4 mb-6">
//                     <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
//                       <Target className="w-6 h-6 text-primary" />
//                     </div>
//                     <h3 className="font-mono text-xl tracking-[0.1em] text-white font-semibold uppercase">3. Strategic Recommendation</h3>
//                   </CardItem>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
//                     <CardItem translateZ="20" className="text-sm text-neutral-400 leading-relaxed">
//                       Based on real-time execution logic, the system synthesizes a definitive go/no-go directive, highlighting critical supply chain bottlenecks and lifecycle upgrades.
//                     </CardItem>

//                     <div className="flex flex-col gap-4 relative">
//                       <CardItem translateZ="50" className="flex w-full items-center justify-between p-4 bg-green-950/30 border-l-2 border-green-500 rounded-r-lg">
//                         <span className="font-mono text-xs text-green-500 font-bold tracking-widest">RECOMMENDATION</span>
//                         <span className="font-mono text-xs bg-green-500 text-black font-bold px-3 py-1.5 rounded-sm">PROCEED TO PROTOTYPE</span>
//                       </CardItem>

//                       <CardItem translateZ="40" className="flex w-full items-center justify-between p-4 bg-yellow-950/20 border-l-2 border-yellow-600/50 rounded-r-lg">
//                         <span className="font-mono text-xs text-neutral-500 tracking-widest">RISK_FACTOR</span>
//                         <span className="font-mono text-xs text-yellow-500 font-bold">LOW (2.4%)</span>
//                       </CardItem>
//                     </div>
//                   </div>

//                 </CardBody>
//               </CardContainer>
//             </div>

//             {/* STEP 4: Futuristic Vision */}
//             <div className="relative group pb-20">
//               <CardContainer className="inter-var w-full">
//                 <CardBody className="bg-gradient-to-br from-neutral-900 to-black relative group/card border-white/5 w-full rounded-xl p-8 border overflow-hidden">

//                   <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

//                   <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
//                     <CardItem translateZ="60" className="w-20 h-20 rounded-full bg-black flex items-center justify-center border border-white/10 shrink-0 shadow-2xl">
//                       <SparklesIcon className="w-8 h-8 text-primary" />
//                     </CardItem>

//                     <CardItem translateZ="30" className="flex-1">
//                       <h3 className="font-mono text-xl md:text-2xl font-bold tracking-[0.1em] text-white uppercase mb-3">
//                         4. Futuristic Vision
//                       </h3>
//                       <p className="text-sm md:text-base text-neutral-400 leading-relaxed">
//                         Evolving beyond static analysis. The platform acts as an autonomous hardware engineering partner—predicting supply chain disruptions months in advance, automatically generating alternative schematics, and negotiating component pricing via agentic workflows.
//                       </p>
//                     </CardItem>
//                   </div>

//                 </CardBody>
//               </CardContainer>
//             </div>

//           </div>
//         </TracingBeam>
//       </section>

//     </main>
//   );
// };

// export default LandingPage;

// import React, { useRef } from "react";
// import { Link } from "react-router-dom";
// import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
// import { useHealthCheck } from "@/api/health/use-health-check";
// import { Button } from "@/components/ui/button";
// import {
//   Activity, ArrowRight, Cpu, Zap,
//   Database, GitMerge, Target, Sparkles,
//   FileJson, BarChart3, Fingerprint, Layers, Box
// } from "lucide-react";

// const APP_NAME = import.meta.env.VITE_APP_NAME || "BOX";
// const APP_DESC = import.meta.env.VITE_APP_DESCRIPTION || "Real-time BOM health. Before you commit.";
// const landingImage = "/images/landing_2.png";

// // --- 3D ANIMATION VARIANTS ---
// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: { staggerChildren: 0.3 }
//   }
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 40, rotateX: -15, scale: 0.95 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     rotateX: 0,
//     scale: 1,
//     transition: { type: "spring", stiffness: 80, damping: 20 }
//   }
// };

// // --- INTERACTIVE 3D CARD COMPONENT ---
// // This component tracks mouse movement to tilt the card and create a 3D parallax effect
// const TiltCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
//   const ref = useRef<HTMLDivElement>(null);
//   const x = useMotionValue(0);
//   const y = useMotionValue(0);

//   const mouseXSpring = useSpring(x);
//   const mouseYSpring = useSpring(y);

//   const transform = useMotionTemplate`rotateX(${mouseXSpring}deg) rotateY(${mouseYSpring}deg)`;

//   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (!ref.current) return;
//     const rect = ref.current.getBoundingClientRect();
//     const width = rect.width;
//     const height = rect.height;
//     const mouseX = e.clientX - rect.left;
//     const mouseY = e.clientY - rect.top;

//     // Calculate rotation (-5 to 5 degrees)
//     const rotateY = ((mouseX / width) - 0.5) * 10;
//     const rotateX = ((mouseY / height) - 0.5) * -10;

//     x.set(rotateX);
//     y.set(rotateY);
//   };

//   const handleMouseLeave = () => {
//     x.set(0);
//     y.set(0);
//   };

//   return (
//     <motion.div
//       ref={ref}
//       onMouseMove={handleMouseMove}
//       onMouseLeave={handleMouseLeave}
//       style={{ transform, transformStyle: "preserve-3d" }}
//       className={`relative rounded-xl border border-white/10 bg-background/40 backdrop-blur-xl shadow-2xl transition-colors duration-500 hover:border-primary/40 ${className}`}
//     >
//       {/* 3D Inner Content Wrapper */}
//       <div
//         style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}
//         className="relative z-10 w-full h-full p-8"
//       >
//         {children}
//       </div>

//       {/* Outer Glow Effect */}
//       <div
//         style={{ transform: "translateZ(-10px)" }}
//         className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl blur-md"
//       />
//     </motion.div>
//   );
// };

// const LandingPage = () => {
//   const { data: health } = useHealthCheck();
//   const isConnected = health?.ollama === "connected";

//   return (
//     <main className="w-full bg-background text-foreground overflow-x-hidden selection:bg-primary/30">

//       {/* =========================================
//           1. HERO SECTION
//       ========================================= */}
//       <section className="w-full relative min-h-[94vh] flex overflow-hidden">
//         <img
//           src={landingImage}
//           alt="Background"
//           className="absolute z-0 w-full h-full object-cover pointer-events-none opacity-40 md:opacity-100 mix-blend-luminosity"
//         />
//         <div className="absolute inset-0 z-10 bg-gradient-to-r from-background via-background/90 to-background/20" />
//         {/* Adds a slight grid overlay for a spatial feel */}
//         <div className="absolute inset-0 z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

//         <div className="relative z-20 flex-1 flex flex-col items-start justify-center px-8 py-16 max-w-5xl w-full mx-auto perspective-[1000px]">

//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 mb-8 font-mono text-xs tracking-widest uppercase">
//             <span className={`w-2 h-2 rounded-full shadow-[0_0_12px_currentColor] ${isConnected ? "bg-green-500 text-green-500" : "bg-red-500 text-red-500"}`} />
//             <span className={isConnected ? "text-green-500" : "text-red-500"}>
//               {isConnected ? "SYSTEM_READY" : "SYSTEM_OFFLINE"}
//             </span>
//             <span className="text-muted-foreground mx-2">|</span>
//             <span className="text-muted-foreground">MODEL: {health?.model || "LOADING..."}</span>
//           </motion.div>

//           <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="flex items-center gap-4 mb-4">
//             <div className="w-14 h-14 border-2 border-primary/60 flex items-center justify-center shadow-[0_0_25px_rgba(var(--primary),0.4)] bg-background/50 backdrop-blur-md rounded-lg rotate-3 hover:rotate-0 transition-transform duration-300">
//               <Box className="w-7 h-7 text-primary" />
//             </div>
//             <h1 className="font-mono text-5xl md:text-[72px] font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary/50 tracking-[0.1em] drop-shadow-[0_0_10px_rgba(var(--primary),0.3)]">
//               {APP_NAME}
//             </h1>
//           </motion.div>

//           <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="font-mono text-xl text-foreground/90 mb-4 normal-case border-l-4 border-primary/70 pl-4 py-1">
//             {APP_DESC}
//           </motion.p>

//           <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-muted-foreground text-sm md:text-base mb-12 max-w-xl leading-relaxed">
//             Upload a BOM. Watch AI agents analyse every component in real-time.
//             Get supply chain risk, IPC compliance, version upgrades, and a
//             go/no-go recommendation — all in one stream.
//           </motion.p>

//           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-wrap items-center gap-4">
//             <Link to="/analyse">
//               <Button size="lg" className="font-mono text-xs uppercase tracking-[0.15em] gap-2 px-8 h-14 relative overflow-hidden group bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.4)] hover:shadow-[0_0_30px_rgba(var(--primary),0.6)] transition-all">
//                 <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
//                 <Cpu className="w-4 h-4 relative z-10" />
//                 <span className="relative z-10">Analyse a BOM</span>
//                 <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
//               </Button>
//             </Link>
//             <Link to="/dashboard">
//               <Button variant="outline" size="lg" className="font-mono text-xs uppercase tracking-[0.15em] border-primary/40 text-primary hover:bg-primary/10 h-14 backdrop-blur-sm">
//                 View Dashboard
//               </Button>
//             </Link>
//           </motion.div>

//           {/* Hero Feature Grid */}
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full perspective-[1000px]">
//             {[
//               { icon: Zap, label: "SUPPLY_CHAIN_RISK", desc: "6 agents check stock, pricing, lead times, and alternatives" },
//               { icon: Activity, label: "IPC_COMPLIANCE", desc: "20 IPC rules validated against Class 2/3 standards" },
//               { icon: Cpu, label: "VERSION_UPGRADE", desc: "AI suggests next-gen components for cost and lifecycle gains" },
//             ].map((feat, i) => (
//               <motion.div key={feat.label} whileHover={{ y: -5, scale: 1.02 }} className="bg-gradient-to-br from-background/60 to-background/20 backdrop-blur-md border border-primary/20 border-t-2 border-t-primary/60 p-5 rounded-lg shadow-xl hover:shadow-[0_10px_30px_rgba(var(--primary),0.15)] transition-all">
//                 <feat.icon className="w-6 h-6 text-primary mb-4 drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
//                 <div className="font-mono text-xs font-bold text-foreground tracking-[0.15em] mb-2">{feat.label}</div>
//                 <div className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</div>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* =========================================
//           2. 3D WORKFLOW / PROCESS SECTION
//       ========================================= */}
//       <section className="relative w-full py-32 px-8 bg-[#0a0a0a] border-t border-white/5 overflow-hidden">

//         {/* Background 3D Elements */}
//         <div className="absolute top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
//         <div className="absolute bottom-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

//         <div className="max-w-5xl mx-auto perspective-[2000px]">
//           <div className="mb-20 text-center md:text-left">
//             <h2 className="font-mono text-3xl md:text-4xl font-bold text-foreground tracking-[0.1em] mb-4 flex items-center justify-center md:justify-start gap-4">
//               <Layers className="text-primary w-10 h-10 drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
//               SYSTEM_ARCHITECTURE
//             </h2>
//             <p className="text-muted-foreground max-w-2xl text-sm md:text-base leading-relaxed mx-auto md:mx-0">
//               Our intelligent pipeline breaks down hardware complexity into actionable, real-time insights. From raw BOM ingestion to futuristic product telemetry.
//             </p>
//           </div>

//           <motion.div
//             variants={containerVariants}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, margin: "-100px" }}
//             className="space-y-16 relative"
//           >
//             {/* 3D Glowing Connecting Line */}
//             <div className="absolute left-10 top-12 bottom-12 w-1.5 rounded-full bg-gradient-to-b from-primary via-primary/30 to-transparent hidden md:block shadow-[0_0_15px_rgba(var(--primary),0.6)]" />

//             {/* STEP 1: Product Design & Resources */}
//             <motion.div variants={itemVariants} className="relative z-10 md:pl-24 group">
//               <div className="absolute left-7 top-8 w-6 h-6 bg-[#0a0a0a] border-4 border-primary rounded-full hidden md:block shadow-[0_0_20px_rgba(var(--primary),0.8)] z-20" />

//               <TiltCard className="group">
//                 <div className="flex items-center gap-4 mb-8" style={{ transform: "translateZ(30px)" }}>
//                   <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
//                     <Database className="w-6 h-6 text-primary" />
//                   </div>
//                   <h3 className="font-mono text-xl tracking-[0.1em] text-foreground font-semibold">1. PRODUCT DESIGN & RESOURCES</h3>
//                 </div>

//                 {/* 3D Resource Blocks */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" style={{ transform: "translateZ(50px)" }}>
//                   <div className="flex flex-col gap-2 p-5 bg-[#141414] rounded-lg border-b-4 border-r-4 border-white/5 hover:border-white/20 transition-colors">
//                     <Fingerprint className="w-6 h-6 text-muted-foreground" />
//                     <h4 className="font-mono text-sm font-semibold">Part Number Report</h4>
//                     <p className="text-xs text-muted-foreground">Detailed historical specs and lifecycle status.</p>
//                   </div>
//                   <div className="flex flex-col gap-2 p-5 bg-[#141414] rounded-lg border-b-4 border-r-4 border-white/5 hover:border-white/20 transition-colors">
//                     <FileJson className="w-6 h-6 text-muted-foreground" />
//                     <h4 className="font-mono text-sm font-semibold">Component Report</h4>
//                     <p className="text-xs text-muted-foreground">Deep dive into individual component parameters.</p>
//                   </div>
//                   {/* Highlighted Block */}
//                   <div className="flex flex-col gap-2 p-5 bg-primary/10 rounded-lg border-b-4 border-r-4 border-primary/40 shadow-[inset_0_0_20px_rgba(var(--primary),0.1)] relative overflow-hidden">
//                     <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/20 blur-xl rounded-full" />
//                     <Layers className="w-6 h-6 text-primary relative z-10" />
//                     <h4 className="font-mono text-sm text-primary font-bold relative z-10">BOM Input & Showdown</h4>
//                     <p className="text-xs text-muted-foreground relative z-10">Automated conflict resolution for overlapping parts.</p>
//                   </div>
//                   <div className="flex flex-col gap-2 p-5 bg-[#141414] rounded-lg border-b-4 border-r-4 border-white/5 hover:border-white/20 transition-colors">
//                     <BarChart3 className="w-6 h-6 text-muted-foreground" />
//                     <h4 className="font-mono text-sm font-semibold">Product Telemetry</h4>
//                     <p className="text-xs text-muted-foreground">Live field-data integration for reliability scores.</p>
//                   </div>
//                 </div>
//               </TiltCard>
//             </motion.div>

//             {/* STEP 2: Business Model Execution */}
//             <motion.div variants={itemVariants} className="relative z-10 md:pl-24 group">
//               <div className="absolute left-7 top-8 w-6 h-6 bg-[#0a0a0a] border-4 border-primary rounded-full hidden md:block shadow-[0_0_20px_rgba(var(--primary),0.8)] z-20" />

//               <TiltCard>
//                 <div className="flex items-center gap-4 mb-6" style={{ transform: "translateZ(30px)" }}>
//                   <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
//                     <GitMerge className="w-6 h-6 text-primary" />
//                   </div>
//                   <h3 className="font-mono text-xl tracking-[0.1em] text-foreground font-semibold">2. EXECUTION LOGIC MODEL</h3>
//                 </div>
//                 <p className="text-sm text-muted-foreground mb-8 max-w-xl" style={{ transform: "translateZ(20px)" }}>
//                   Dynamic routing of RESOURCE data into actionable business frameworks. Watch the system ingest and process inputs in real-time.
//                 </p>

//                 {/* 3D Terminal Simulation */}
//                 <div
//                   className="bg-black border-2 border-primary/20 rounded-lg overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.8),0_10px_30px_rgba(0,0,0,0.5)] relative"
//                   style={{ transform: "translateZ(60px)" }}
//                 >
//                   {/* Glass glare effect */}
//                   <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

//                   <div className="bg-[#111] px-4 py-3 border-b border-white/10 flex justify-between items-center shadow-md">
//                     <span className="font-mono text-xs text-muted-foreground uppercase flex items-center gap-2">
//                       <div className="w-2 h-2 bg-red-500 rounded-full" />
//                       <div className="w-2 h-2 bg-yellow-500 rounded-full" />
//                       <div className="w-2 h-2 bg-green-500 rounded-full" />
//                       <span className="ml-2">Active Drill-down</span>
//                     </span>
//                     <span className="font-mono text-[10px] bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(var(--primary),0.3)]">STEP_01_INFO</span>
//                   </div>
//                   <div className="p-6 font-mono text-sm text-foreground/80 leading-loose border-l-2 border-primary ml-6 my-6 bg-black/40 relative">
//                     {/* Scanline effect */}
//                     <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />

//                     <span className="text-primary font-bold">{">"} INIT_LOGIC_SEQUENCE</span><br/>
//                     <span className="text-muted-foreground">Loading resource dependencies...</span><br/>
//                     <span className="text-white">[OK]</span> Parsed 421 components from BOM Showdown.<br/>
//                     <span className="text-white">[OK]</span> Telemetry threshold met. Validating against constraints...<br/>
//                     <span className="text-green-400 font-bold drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">Yielding highest margin execution path.</span>
//                   </div>
//                 </div>
//               </TiltCard>
//             </motion.div>

//             {/* STEP 3: Strategic Recommendation */}
//             <motion.div variants={itemVariants} className="relative z-10 md:pl-24 group">
//               <div className="absolute left-7 top-8 w-6 h-6 bg-[#0a0a0a] border-4 border-primary rounded-full hidden md:block shadow-[0_0_20px_rgba(var(--primary),0.8)] z-20" />

//               <TiltCard className="border-primary/40 shadow-[0_0_40px_rgba(var(--primary),0.1)]">
//                 <div className="flex items-center gap-4 mb-6" style={{ transform: "translateZ(30px)" }}>
//                   <div className="p-3 bg-primary/20 rounded-lg border border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.4)]">
//                     <Target className="w-6 h-6 text-primary" />
//                   </div>
//                   <h3 className="font-mono text-xl tracking-[0.1em] text-foreground font-semibold">3. STRATEGIC RECOMMENDATION</h3>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
//                   <p className="text-sm text-muted-foreground leading-relaxed" style={{ transform: "translateZ(20px)" }}>
//                     Based on real-time execution logic, the system synthesizes a definitive go/no-go directive, highlighting critical supply chain bottlenecks and lifecycle upgrades.
//                   </p>

//                   {/* Floating Badges */}
//                   <div className="flex flex-col gap-4 relative" style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }}>
//                     <motion.div
//                       whileHover={{ scale: 1.05, x: -10 }}
//                       className="flex items-center justify-between p-4 bg-green-500/10 border-l-4 border-green-500 rounded-r-lg backdrop-blur-md shadow-[0_10px_30px_rgba(34,197,94,0.15)]"
//                     >
//                       <span className="font-mono text-xs text-green-400 font-bold tracking-widest">RECOMMENDATION</span>
//                       <span className="font-mono text-xs bg-green-500 text-black font-bold px-3 py-1.5 rounded-sm">PROCEED TO PROTOTYPE</span>
//                     </motion.div>

//                     <motion.div
//                       whileHover={{ scale: 1.05, x: 10 }}
//                       className="flex items-center justify-between p-4 bg-yellow-500/5 border-l-4 border-yellow-500/50 rounded-r-lg backdrop-blur-md shadow-lg"
//                     >
//                       <span className="font-mono text-xs text-muted-foreground tracking-widest">RISK_FACTOR</span>
//                       <span className="font-mono text-xs text-yellow-500 font-bold">LOW (2.4%)</span>
//                     </motion.div>
//                   </div>
//                 </div>
//               </TiltCard>
//             </motion.div>

//             {/* STEP 4: Futuristic Vision */}
//             <motion.div variants={itemVariants} className="relative z-10 md:pl-24 mt-8">
//               {/* Final Glowing Node Marker */}
//               <div className="absolute left-[18px] top-8 w-10 h-10 bg-primary/20 flex items-center justify-center rounded-full hidden md:flex z-20">
//                 <div className="w-4 h-4 bg-primary rounded-full shadow-[0_0_20px_rgba(var(--primary),1)] animate-pulse" />
//               </div>

//               <TiltCard className="bg-gradient-to-br from-primary/10 via-[#0a0a0a] to-[#0a0a0a] border-primary/30 overflow-hidden">
//                 {/* 3D Hologram Glow Effect Background */}
//                 <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
//                 <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 blur-[80px] rounded-full pointer-events-none" />

//                 <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center" style={{ transform: "translateZ(40px)" }}>
//                   {/* Floating Orb */}
//                   <motion.div
//                     animate={{ y: [-10, 10, -10] }}
//                     transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
//                     className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/40 shrink-0 shadow-[0_0_40px_rgba(var(--primary),0.3),inset_0_0_20px_rgba(var(--primary),0.2)]"
//                   >
//                     <Sparkles className="w-10 h-10 text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
//                   </motion.div>

//                   <div style={{ transform: "translateZ(20px)" }}>
//                     <h3 className="font-mono text-2xl font-bold tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 uppercase mb-3">
//                       4. Futuristic Vision
//                     </h3>
//                     <p className="text-base text-muted-foreground leading-relaxed">
//                       Evolving beyond static analysis. The platform acts as an autonomous hardware engineering partner—predicting supply chain disruptions months in advance, automatically generating alternative schematics, and negotiating component pricing via agentic workflows.
//                     </p>
//                   </div>
//                 </div>
//               </TiltCard>
//             </motion.div>

//           </motion.div>
//         </div>
//       </section>

//     </main>
//   );
// };

// export default LandingPage;

// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { useHealthCheck } from "@/api/health/use-health-check";
// import { Button } from "@/components/ui/button";
// import {
//   Activity, ArrowRight, Cpu, Zap,
//   Database, GitMerge, Target, Sparkles,
//   FileJson, BarChart3, Fingerprint, Layers
// } from "lucide-react";

// const APP_NAME = import.meta.env.VITE_APP_NAME || "BOX";
// const APP_DESC = import.meta.env.VITE_APP_DESCRIPTION || "Real-time BOM health. Before you commit.";
// const landingImage = "/images/landing_2.png";

// // --- NEW ANIMATION VARIANTS ---
// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: { staggerChildren: 0.2 }
//   }
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
// };

// const LandingPage = () => {
//   const { data: health } = useHealthCheck();
//   const isConnected = health?.ollama === "connected";

//   return (
//     <main className="w-full bg-background text-foreground overflow-x-hidden selection:bg-primary/30">

//       {/* =========================================
//           1. HERO SECTION (Your Existing Code)
//       ========================================= */}
//       <section className="w-full relative min-h-[94vh] flex overflow-hidden">
//         <img
//           src={landingImage}
//           alt="Background Image"
//           className="absolute z-0 w-full h-full object-cover pointer-events-none opacity-40 md:opacity-100"
//         />
//         <div className="absolute inset-0 z-10 bg-gradient-to-r from-background via-background/80 to-background/20" />

//         <div className="relative z-20 flex-1 flex flex-col items-start justify-center px-8 py-16 max-w-5xl w-full mx-auto">
//           {/* System status */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="flex items-center gap-2 mb-8 font-mono text-xs tracking-widest uppercase"
//           >
//             <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${isConnected ? "bg-green-500 text-green-500" : "bg-red-500 text-red-500"}`} />
//             <span className={isConnected ? "text-green-500" : "text-red-500"}>
//               {isConnected ? "SYSTEM_READY" : "SYSTEM_OFFLINE"}
//             </span>
//             <span className="text-muted-foreground mx-2">|</span>
//             <span className="text-muted-foreground">
//               MODEL: {health?.model || "LOADING..."}
//             </span>
//           </motion.div>

//           {/* Logo & Title */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.1, duration: 0.4, ease: [0.2, 0, 0, 1] }}
//             className="flex items-center gap-4 mb-4"
//           >
//             <div className="w-12 h-12 border-2 border-primary/60 flex items-center justify-center shadow-[0_0_15px_rgba(var(--primary),0.3)] bg-background/50 backdrop-blur-sm">
//               <Activity className="w-6 h-6 text-primary" />
//             </div>
//             <h1 className="font-mono text-5xl md:text-[64px] font-bold text-primary tracking-[0.1em] drop-shadow-[0_0_10px_rgba(var(--primary),0.5)]">
//               {APP_NAME}
//             </h1>
//           </motion.div>

//           <motion.p
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.2, duration: 0.4, ease: [0.2, 0, 0, 1] }}
//             className="font-mono text-xl text-foreground/80 mb-4 normal-case border-l-2 border-primary/50 pl-4"
//           >
//             {APP_DESC}
//           </motion.p>

//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.3 }}
//             className="text-muted-foreground text-sm md:text-base mb-12 max-w-xl leading-relaxed"
//           >
//             Upload a BOM. Watch AI agents analyse every component in real-time.
//             Get supply chain risk, IPC compliance, version upgrades, and a
//             go/no-go recommendation — all in one stream.
//           </motion.p>

//           {/* CTA */}
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4, duration: 0.3 }}
//             className="flex flex-wrap items-center gap-4"
//           >
//             <Link to="/analyse">
//               <Button variant="default" size="lg" className="font-mono text-xs uppercase tracking-[0.15em] gap-2 px-8 h-12 relative overflow-hidden group">
//                 <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
//                 <Cpu className="w-4 h-4 relative z-10" />
//                 <span className="relative z-10">Analyse a BOM</span>
//                 <ArrowRight className="w-4 h-4 relative z-10" />
//               </Button>
//             </Link>
//             <Link to="/dashboard">
//               <Button variant="outline" size="lg" className="font-mono text-xs uppercase tracking-[0.15em] border-primary/30 text-primary hover:bg-primary/10 h-12">
//                 View Dashboard
//               </Button>
//             </Link>
//           </motion.div>

//           {/* Feature grid */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.6 }}
//             className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full"
//           >
//             {[
//               { icon: Zap, label: "SUPPLY_CHAIN_RISK", desc: "6 agents check stock, pricing, lead times, and alternatives" },
//               { icon: Activity, label: "IPC_COMPLIANCE", desc: "20 IPC rules validated against Class 2/3 standards" },
//               { icon: Cpu, label: "VERSION_UPGRADE", desc: "AI suggests next-gen components for cost and lifecycle gains" },
//             ].map((feat) => (
//               <div key={feat.label} className="bg-background/40 backdrop-blur-md border border-primary/10 border-l-2 border-l-primary/50 p-5 hover:bg-background/60 transition-colors">
//                 <feat.icon className="w-5 h-5 text-primary mb-3 opacity-80" />
//                 <div className="font-mono text-xs font-semibold text-primary tracking-[0.15em] mb-2">
//                   {feat.label}
//                 </div>
//                 <div className="text-sm text-muted-foreground leading-relaxed">
//                   {feat.desc}
//                 </div>
//               </div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* =========================================
//           2. WORKFLOW / PROCESS SECTION (New UI)
//       ========================================= */}
//       <section className="relative w-full py-32 px-8 bg-black/40 border-t border-white/5">
//         <div className="max-w-5xl mx-auto">

//           <div className="mb-16">
//             <h2 className="font-mono text-3xl font-bold text-foreground tracking-[0.1em] mb-4 flex items-center gap-3">
//               <Layers className="text-primary w-8 h-8" />
//               SYSTEM_ARCHITECTURE
//             </h2>
//             <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
//               Our intelligent pipeline breaks down hardware complexity into actionable, real-time insights. From raw BOM ingestion to futuristic product telemetry.
//             </p>
//           </div>

//           <motion.div
//             variants={containerVariants}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, margin: "-100px" }}
//             className="space-y-8 relative"
//           >
//             {/* Vertical Connecting Line */}
//             <div className="absolute left-8 top-10 bottom-10 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent hidden md:block" />

//             {/* STEP 1: Product Design & Resources */}
//             <motion.div variants={itemVariants} className="relative z-10 md:pl-20">
//               <div className="absolute left-6 top-6 w-4 h-4 bg-background border-2 border-primary rounded-full hidden md:block shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
//               <div className="bg-background/40 backdrop-blur-xl border border-white/10 rounded-lg p-8 hover:border-primary/30 transition-all duration-300">
//                 <div className="flex items-center gap-3 mb-6">
//                   <Database className="w-6 h-6 text-primary" />
//                   <h3 className="font-mono text-xl tracking-[0.1em] uppercase">1. Product Design & Resources</h3>
//                 </div>

//                 {/* Resource Grid */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="flex items-start gap-3 p-4 bg-white/5 rounded border border-white/5">
//                     <Fingerprint className="w-5 h-5 text-muted-foreground mt-0.5" />
//                     <div>
//                       <h4 className="font-mono text-sm mb-1">Part Number Report</h4>
//                       <p className="text-xs text-muted-foreground">Detailed historical specs and lifecycle status.</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start gap-3 p-4 bg-white/5 rounded border border-white/5">
//                     <FileJson className="w-5 h-5 text-muted-foreground mt-0.5" />
//                     <div>
//                       <h4 className="font-mono text-sm mb-1">Component Report</h4>
//                       <p className="text-xs text-muted-foreground">Deep dive into individual component parameters.</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start gap-3 p-4 bg-primary/10 rounded border border-primary/20">
//                     <Layers className="w-5 h-5 text-primary mt-0.5" />
//                     <div>
//                       <h4 className="font-mono text-sm text-primary mb-1">BOM Input & Showdown</h4>
//                       <p className="text-xs text-muted-foreground">Automated conflict resolution for overlapping parts.</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start gap-3 p-4 bg-white/5 rounded border border-white/5">
//                     <BarChart3 className="w-5 h-5 text-muted-foreground mt-0.5" />
//                     <div>
//                       <h4 className="font-mono text-sm mb-1">Product Telemetry</h4>
//                       <p className="text-xs text-muted-foreground">Live field-data integration for reliability scores.</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* STEP 2: Business Model Execution */}
//             <motion.div variants={itemVariants} className="relative z-10 md:pl-20">
//               <div className="absolute left-6 top-6 w-4 h-4 bg-background border-2 border-primary rounded-full hidden md:block" />
//               <div className="bg-background/40 backdrop-blur-xl border border-white/10 rounded-lg p-8">
//                 <div className="flex items-center gap-3 mb-6">
//                   <GitMerge className="w-6 h-6 text-primary" />
//                   <h3 className="font-mono text-xl tracking-[0.1em] uppercase">2. Execution Logic Model</h3>
//                 </div>
//                 <p className="text-sm text-muted-foreground mb-6">
//                   Dynamic routing of RESOURCE data into actionable business frameworks.
//                 </p>

//                 {/* Drill-down UI Representation */}
//                 <div className="bg-black/50 border border-white/10 rounded overflow-hidden">
//                   <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex justify-between items-center">
//                     <span className="font-mono text-xs text-muted-foreground uppercase">Active Drill-down</span>
//                     <span className="font-mono text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded">STEP_01_INFO</span>
//                   </div>
//                   <div className="p-4 font-mono text-xs text-foreground/80 leading-relaxed border-l-2 border-primary ml-4 my-4">
//                     <span className="text-primary">{">"} INIT_LOGIC_SEQUENCE</span><br/>
//                     <span className="text-muted-foreground">Loading resource dependencies...</span><br/>
//                     [OK] Parsed 421 components from BOM Showdown.<br/>
//                     [OK] Telemetry threshold met. Validating against constraints...<br/>
//                     <span className="text-green-400">Yielding highest margin execution path.</span>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* STEP 3: Strategic Recommendation */}
//             <motion.div variants={itemVariants} className="relative z-10 md:pl-20">
//               <div className="absolute left-6 top-6 w-4 h-4 bg-background border-2 border-primary rounded-full hidden md:block" />
//               <div className="bg-background/40 backdrop-blur-xl border border-primary/30 rounded-lg p-8 shadow-[0_0_30px_rgba(var(--primary),0.05)]">
//                 <div className="flex items-center gap-3 mb-4">
//                   <Target className="w-6 h-6 text-primary" />
//                   <h3 className="font-mono text-xl tracking-[0.1em] uppercase">3. Strategic Recommendation</h3>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <p className="text-sm text-muted-foreground leading-relaxed">
//                     Based on real-time execution logic, the system synthesizes a definitive go/no-go directive, highlighting critical supply chain bottlenecks and lifecycle upgrades.
//                   </p>
//                   <div className="flex flex-col gap-2">
//                     <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded">
//                       <span className="font-mono text-xs text-green-400">RECOMMENDATION</span>
//                       <span className="font-mono text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">PROCEED TO PROTOTYPE</span>
//                     </div>
//                     <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded">
//                       <span className="font-mono text-xs text-muted-foreground">RISK_FACTOR</span>
//                       <span className="font-mono text-xs text-yellow-500">LOW (2.4%)</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* STEP 4: Futuristic Vision */}
//             <motion.div variants={itemVariants} className="relative z-10 md:pl-20 mt-12">
//               {/* Final Node Marker */}
//               <div className="absolute left-[22px] top-6 w-6 h-6 bg-primary/20 flex items-center justify-center rounded-full hidden md:flex">
//                 <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
//               </div>

//               <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background border border-primary/20 rounded-lg p-8 group">
//                 {/* Glow Effect Background */}
//                 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-colors duration-700" />

//                 <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
//                   <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30 shrink-0">
//                     <Sparkles className="w-8 h-8 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-mono text-xl tracking-[0.1em] text-foreground uppercase mb-2">
//                       4. Futuristic Vision
//                     </h3>
//                     <p className="text-sm text-muted-foreground leading-relaxed">
//                       Evolving beyond static analysis. The platform acts as an autonomous hardware engineering partner—predicting supply chain disruptions months in advance, automatically generating alternative schematics, and negotiating component pricing via agentic workflows.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//           </motion.div>
//         </div>
//       </section>

//     </main>
//   );
// };

// export default LandingPage;

// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { useHealthCheck } from "@/api/health/use-health-check";
// import { Button } from "@/components/ui/button";
// import { Activity, ArrowRight, Cpu, Zap } from "lucide-react";

// const APP_NAME = import.meta.env.VITE_APP_NAME || "BOX";
// const APP_DESC =
//   import.meta.env.VITE_APP_DESCRIPTION ||
//   "Real-time BOM health. Before you commit.";

// const landingImage = "/images/landing_2.png";

// const LandingPage = () => {
//   const { data: health } = useHealthCheck();
//   const isConnected = health?.ollama === "connected";

//   return (
//     <div className="w-full relative h-[94vh] flex overflow-hidden bg-background">

//       {/* 1. Base Image Layer (z-0) */}
//       <img
//         src={landingImage}
//         alt="Background Image"
//         className="absolute z-0 w-full h-full pointer-events-none"
//       />

//       {/* 2. Gradient Overlay Layer (z-10) - This Fades the Left Side */}
//       {/* 'from-background' uses your theme's background color. 'to-transparent' creates the fade effect. */}
//       <div className="absolute inset-0 z-10 bg-gradient-to-r from-background via-background/50 to-transparent" />

//       {/* 3. Content Layer (z-20) - Content must have a higher z-index to sit on top of the gradient */}
//       <div className="relative z-20 flex-1 flex flex-col items-start justify-center px-8 py-16 max-w-4xl w-full">
//         {/* System status */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="flex items-center gap-2 mb-8 font-mono text-hud-label"
//         >
//           <span
//             className={`w-2 h-2 ${isConnected ? "bg-hud-green" : "bg-hud-red"}`}
//           />
//           <span className={isConnected ? "text-hud-green" : "text-hud-red"}>
//             {isConnected ? "SYSTEM_READY" : "SYSTEM_OFFLINE"}
//           </span>
//           <span className="text-muted-foreground mx-2">|</span>
//           <span className="text-muted-foreground">
//             MODEL: {health?.model || "LOADING..."}
//           </span>
//         </motion.div>

//         {/* Logo & Title */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.1, duration: 0.4, ease: [0.2, 0, 0, 1] }}
//           className="flex items-center gap-4 mb-4"
//         >
//           <div className="w-12 h-12 border-2 border-primary/60 flex items-center justify-center hud-glow">
//             <Activity className="w-6 h-6 text-primary" />
//           </div>
//           <h1 className="font-mono text-[48px] font-bold text-primary hud-text-glow tracking-[0.1em]">
//             {APP_NAME}
//           </h1>
//         </motion.div>

//         <motion.p
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.2, duration: 0.4, ease: [0.2, 0, 0, 1] }}
//           className="font-mono text-hud-header text-foreground/80 mb-2 normal-case"
//         >
//           {APP_DESC}
//         </motion.p>

//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3 }}
//           className="text-muted-foreground text-hud-data mb-12 max-w-lg"
//         >
//           Upload a BOM. Watch AI agents analyse every component in real-time.
//           Get supply chain risk, IPC compliance, version upgrades, and a
//           go/no-go recommendation — all in one stream.
//         </motion.p>

//         {/* CTA */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4, duration: 0.3 }}
//           className="flex items-center gap-4"
//         >
//           <Link to="/analyse">
//             <Button
//               variant="default"
//               size="lg"
//               className="font-mono text-hud-data uppercase tracking-[0.15em] bg-primary text-primary-foreground hover:bg-primary/80 gap-2 px-8 h-12"
//             >
//               <Cpu className="w-4 h-4" />
//               Analyse a BOM
//               <ArrowRight className="w-4 h-4" />
//             </Button>
//           </Link>
//           <Link to="/dashboard">
//             <Button
//               variant="outline"
//               size="lg"
//               className="font-mono text-hud-data uppercase tracking-[0.15em] border-primary/30 text-primary hover:bg-primary/10 h-12"
//             >
//               View Dashboard
//             </Button>
//           </Link>
//         </motion.div>

//         {/* Feature grid */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.6 }}
//           className="grid grid-cols-3 gap-4 mt-16 w-full"
//         >
//           {[
//             {
//               icon: Zap,
//               label: "SUPPLY_CHAIN_RISK",
//               desc: "6 agents check stock, pricing, lead times, and alternatives",
//             },
//             {
//               icon: Activity,
//               label: "IPC_COMPLIANCE",
//               desc: "20 IPC rules validated against Class 2/3 standards",
//             },
//             {
//               icon: Cpu,
//               label: "VERSION_UPGRADE",
//               desc: "AI suggests next-gen components for cost and lifecycle gains",
//             },
//           ].map((feat) => (
//             <div
//               key={feat.label}
//               className="hud-glass border-l-2 border-l-primary/20 p-4"
//             >
//               <feat.icon className="w-4 h-4 text-primary mb-2" />
//               <div className="font-mono text-hud-label text-primary tracking-[0.15em] mb-1">
//                 {feat.label}
//               </div>
//               <div className="text-hud-data text-muted-foreground">
//                 {feat.desc}
//               </div>
//             </div>
//           ))}
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default LandingPage;
