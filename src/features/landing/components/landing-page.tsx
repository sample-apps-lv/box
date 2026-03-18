import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useHealthCheck } from "@/api/health/use-health-check";
import { Button } from "@/components/ui/button";
import { Activity, ArrowRight, Cpu, Zap } from "lucide-react";

const APP_NAME = import.meta.env.VITE_APP_NAME || "BOX";
const APP_DESC =
  import.meta.env.VITE_APP_DESCRIPTION ||
  "Real-time BOM health. Before you commit.";

const landingImage = "/images/landing_2.png";

const LandingPage = () => {
  const { data: health } = useHealthCheck();
  const isConnected = health?.ollama === "connected";

  return (
    <div className="w-full relative h-[94vh] flex overflow-hidden bg-background">
      
      {/* 1. Base Image Layer (z-0) */}
      <img
        src={landingImage}
        alt="Background Image"
        className="absolute z-0 w-full h-full pointer-events-none"
      />

      {/* 2. Gradient Overlay Layer (z-10) - This Fades the Left Side */}
      {/* 'from-background' uses your theme's background color. 'to-transparent' creates the fade effect. */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-background via-background/50 to-transparent" />

      {/* 3. Content Layer (z-20) - Content must have a higher z-index to sit on top of the gradient */}
      <div className="relative z-20 flex-1 flex flex-col items-start justify-center px-8 py-16 max-w-4xl w-full">
        {/* System status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 mb-8 font-mono text-hud-label"
        >
          <span
            className={`w-2 h-2 ${isConnected ? "bg-hud-green" : "bg-hud-red"}`}
          />
          <span className={isConnected ? "text-hud-green" : "text-hud-red"}>
            {isConnected ? "SYSTEM_READY" : "SYSTEM_OFFLINE"}
          </span>
          <span className="text-muted-foreground mx-2">|</span>
          <span className="text-muted-foreground">
            MODEL: {health?.model || "LOADING..."}
          </span>
        </motion.div>

        {/* Logo & Title */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4, ease: [0.2, 0, 0, 1] }}
          className="flex items-center gap-4 mb-4"
        >
          <div className="w-12 h-12 border-2 border-primary/60 flex items-center justify-center hud-glow">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-mono text-[48px] font-bold text-primary hud-text-glow tracking-[0.1em]">
            {APP_NAME}
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4, ease: [0.2, 0, 0, 1] }}
          className="font-mono text-hud-header text-foreground/80 mb-2 normal-case"
        >
          {APP_DESC}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-hud-data mb-12 max-w-lg"
        >
          Upload a BOM. Watch AI agents analyse every component in real-time.
          Get supply chain risk, IPC compliance, version upgrades, and a
          go/no-go recommendation — all in one stream.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="flex items-center gap-4"
        >
          <Link to="/analyse">
            <Button
              variant="default"
              size="lg"
              className="font-mono text-hud-data uppercase tracking-[0.15em] bg-primary text-primary-foreground hover:bg-primary/80 gap-2 px-8 h-12"
            >
              <Cpu className="w-4 h-4" />
              Analyse a BOM
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button
              variant="outline"
              size="lg"
              className="font-mono text-hud-data uppercase tracking-[0.15em] border-primary/30 text-primary hover:bg-primary/10 h-12"
            >
              View Dashboard
            </Button>
          </Link>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-4 mt-16 w-full"
        >
          {[
            {
              icon: Zap,
              label: "SUPPLY_CHAIN_RISK",
              desc: "6 agents check stock, pricing, lead times, and alternatives",
            },
            {
              icon: Activity,
              label: "IPC_COMPLIANCE",
              desc: "20 IPC rules validated against Class 2/3 standards",
            },
            {
              icon: Cpu,
              label: "VERSION_UPGRADE",
              desc: "AI suggests next-gen components for cost and lifecycle gains",
            },
          ].map((feat) => (
            <div
              key={feat.label}
              className="hud-glass border-l-2 border-l-primary/20 p-4"
            >
              <feat.icon className="w-4 h-4 text-primary mb-2" />
              <div className="font-mono text-hud-label text-primary tracking-[0.15em] mb-1">
                {feat.label}
              </div>
              <div className="text-hud-data text-muted-foreground">
                {feat.desc}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;


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
//     <div
//       className="w-full relative"
//     >
      
//       <div className="flex-1 z-10 flex flex-col items-start justify-center px-8 py-16 max-w-4xl">
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
//           ].map((feat, i) => (
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
//       <img
//         src={landingImage}
//         className="absolute z-0 w-full h-[95vh] top-0"
//       />
//     </div>
//   );
// };

// export default LandingPage;
