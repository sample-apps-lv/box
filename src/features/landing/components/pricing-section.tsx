import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Shield, Zap, Cpu, Activity, ArrowRight, Layers } from "lucide-react";

// Reusable Cybernetic Corners
const CyberCorners = () => (
  <>
    <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-white/20 rounded-sm shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:bg-cyan-500/80 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-[0_0_10px_#22d3ee]" />
    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white/20 rounded-sm shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:bg-cyan-500/80 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:shadow-[0_0_10px_#22d3ee]" />
    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-white/20 rounded-sm shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:bg-cyan-500/80 group-hover:-translate-x-1 group-hover:translate-y-1 group-hover:shadow-[0_0_10px_#22d3ee]" />
    <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-white/20 rounded-sm shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:bg-cyan-500/80 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-[0_0_10px_#22d3ee]" />
  </>
);

// Fallback pricing data (Replace with your features.md content)
const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    description: "Standard telemetry for single-node prototype projects.",
    icon: <Cpu className="w-5 h-5 text-neutral-400" />,
    features: [
      "Up to 5 BOM uploads per month",
      "Basic component parameter extraction",
      "Standard IPC compliance check",
      "Community forum access",
    ],
    buttonText: "INIT_FREE_TIER",
    buttonLink: "/contact",
    highlight: false,
    colorStyle: "border-white/10 hover:border-white/30 text-white",
  },
  {
    name: "Basic",
    price: "$49",
    period: "/mo",
    description: "Expanded pipeline for growing hardware teams.",
    icon: <Zap className="w-5 h-5 text-green-400 group-hover:animate-pulse" />,
    features: [
      "Up to 50 BOM uploads per month",
      "Real-time supply chain telemetry",
      "Automated conflict showdown matrix",
      "Exportable diagnostics (PDF/CSV)",
      "Standard email routing",
    ],
    buttonText: "DEPLOY_BASIC",
    buttonLink: "/contact",
    highlight: false,
    colorStyle: "border-white/10 hover:border-green-500/40 text-green-400",
  },
  {
    name: "Pro",
    price: "$199",
    period: "/mo",
    description: "Autonomous agentic resolution for mission-critical hardware.",
    icon: <Activity className="w-5 h-5 text-cyan-400 group-hover:animate-spin" style={{ animationDuration: '3s' }}/>,
    features: [
      "Unlimited BOM ingestions",
      "Predictive disruption alerts",
      "Live environmental stress scoring",
      "Alternative schematic generation",
      "API access & Webhook integration",
      "Priority 24/7 system routing",
    ],
    buttonText: "AUTHORIZE_PRO",
    buttonLink: "/contact",
    highlight: true,
    colorStyle: "border-cyan-500/50 hover:border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.1)]",
  },
  {
    name: "Custom",
    price: "Enterprise",
    description: "Dedicated infrastructure and custom neural net training.",
    icon: <Shield className="w-5 h-5 text-purple-400 group-hover:animate-pulse" />,
    features: [
      "On-premise deployment options",
      "Custom ERP/PLM integrations",
      "Dedicated account command manager",
      "Custom component DB sync",
      "99.99% SLA guarantees",
      "Hardware agent workflow training",
    ],
    buttonText: "CONTACT_COMMAND",
    buttonLink: "/contact", // Redirects to contact page as requested
    highlight: false,
    colorStyle: "border-white/10 hover:border-purple-500/40 text-purple-400",
  },
];

export const PricingSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  } as any;

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  } as any;

  return (
    <section className="relative w-full py-32 bg-[#020202] border-t border-white/10 z-10 overflow-hidden font-sans">
      {/* Background Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,#000_70%,transparent_100%)] z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col items-center justify-center text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-3xl md:text-5xl font-black text-white tracking-[0.1em] mb-4 flex items-center justify-center gap-4 drop-shadow-md uppercase"
          >
            <Layers className="text-cyan-400 w-8 h-8 md:w-10 md:h-10 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
            Deployment_Tiers
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-neutral-400 max-w-2xl text-sm md:text-lg leading-relaxed font-mono"
          >
            [SELECT_PROTOCOL] Allocate computational resources based on your hardware pipeline needs. Upgrade your bandwidth anytime.
          </motion.p>
        </div>

        {/* Pricing Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8"
        >
          {pricingTiers.map((tier, idx) => (
            <motion.div key={tier.name} variants={cardVariants} className="h-full">
              <div 
                className={`relative flex flex-col h-full bg-[#0a0a0a] border rounded-xl p-8 transition-all duration-500 group overflow-hidden ${tier.colorStyle} ${tier.highlight ? 'bg-gradient-to-b from-[#0a0f12] to-[#050505] -translate-y-2' : 'hover:-translate-y-1 hover:bg-[#0f0f0f]'}`}
              >
                {/* Highlight Glow Effect for Pro */}
                {tier.highlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] bg-cyan-500/20 blur-[50px] rounded-full pointer-events-none mix-blend-screen" />
                )}

                <CyberCorners />
                
                {/* Header */}
                <div className="flex items-center justify-between mb-6 relative z-10 border-b border-white/5 pb-6">
                  <span className="font-mono text-xl tracking-[0.1em] text-white font-bold uppercase">{tier.name}</span>
                  <div className="p-2 bg-black rounded border border-white/10 shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]">
                    {tier.icon}
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4 relative z-10">
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-500">
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span className="font-mono text-sm text-neutral-500">{tier.period}</span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm font-mono text-neutral-500 mb-8 min-h-[40px] relative z-10">
                  {tier.description}
                </p>

                {/* Features List */}
                <div className="flex-1 relative z-10 mb-8">
                  <ul className="space-y-4">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${tier.highlight ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]' : 'text-neutral-600 group-hover:text-white transition-colors'}`} />
                        <span className="text-sm font-mono text-neutral-400 leading-tight group-hover:text-neutral-300 transition-colors">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <div className="mt-auto pt-6 border-t border-white/5 relative z-10">
                  <Link to={tier.buttonLink} className="w-full block">
                    <Button
                      variant={tier.highlight ? "default" : "outline"}
                      className={`w-full group/btn relative h-12 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] rounded-none transition-all duration-300 ${
                        tier.highlight 
                          ? "bg-cyan-400 hover:bg-cyan-300 text-black shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]" 
                          : "border-white/20 text-white bg-black/50 hover:bg-white/10 backdrop-blur-md"
                      }`}
                    >
                      {/* Scanning Light overlay on Pro button */}
                      {tier.highlight && (
                        <span className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%)] translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                      )}
                      
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {tier.buttonText}
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </Link>
                </div>
                
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
