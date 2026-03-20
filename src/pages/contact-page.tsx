import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  User,
  Mail,
  Building,
  MessageSquare,
  Cpu,
  Zap,
  Activity,
  Shield,
  CheckCircle2
} from "lucide-react";

// Shadcn Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

// Reusable Cybernetic Corners
const CyberCorners = ({ active }) => (
  <>
    <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 transition-colors duration-300 ${active ? 'border-primary' : 'border-border'}`} />
    <div className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 transition-colors duration-300 ${active ? 'border-primary' : 'border-border'}`} />
    <div className={`absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 transition-colors duration-300 ${active ? 'border-primary' : 'border-border'}`} />
    <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 transition-colors duration-300 ${active ? 'border-primary' : 'border-border'}`} />
  </>
);

const plans = [
  { id: "Free", icon: <Cpu className="w-4 h-4" /> },
  { id: "Basic", icon: <Zap className="w-4 h-4" /> },
  { id: "Pro", icon: <Activity className="w-4 h-4" /> },
  { id: "Custom", icon: <Shield className="w-4 h-4" /> },
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    plan: "Pro", // Default selected plan
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeField, setActiveField] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  } as any;

  return (
    <main className="min-h-screen w-full bg-background text-foreground relative flex items-center justify-center pt-24 pb-12 px-6 overflow-hidden selection:bg-primary/30 font-sans z-10">
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,hsl(var(--muted))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)] z-0 opacity-20" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl w-full mx-auto relative z-10"
      >
        <motion.div variants={itemVariants}>
          <Card className="bg-card  rounded-sm p-1 shadow-2xl relative overflow-hidden">
            {/* Top glowing accent line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-primary/80 shadow-[0_0_15px_hsl(var(--primary))]" />
            
            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="p-6 sm:p-10 relative flex flex-col gap-8">
                
                {isSuccess ? (
                  <div className="absolute inset-0 z-50 bg-card/95 backdrop-blur flex flex-col items-center justify-center p-8 text-center border border-primary/30">
                    <CheckCircle2 className="w-16 h-16 text-primary mb-6 animate-[bounce_1s_ease-in-out]" />
                    <h2 className="font-mono text-2xl text-foreground font-bold tracking-widest uppercase mb-2">Transmission Sent</h2>
                    <p className="font-mono text-sm text-muted-foreground max-w-sm">
                      Protocol accepted. Our engineering team will review your parameters and establish contact shortly.
                    </p>
                    <Button
                      type="button"
                      onClick={() => setIsSuccess(false)}
                      variant="outline"
                      className="mt-8 font-mono text-xs uppercase tracking-widest border-border text-muted-foreground hover:text-foreground hover:border-primary/50 rounded-none bg-transparent"
                    >
                      Initiate_New_Request
                    </Button>
                  </div>
                ) : null}

                {/* Form Fields Header */}
                <div className="text-center mb-2">
                  <h1 className="font-mono text-2xl sm:text-3xl font-black text-foreground tracking-[0.1em] uppercase">
                    Establish_Uplink
                  </h1>
                  <p className="text-muted-foreground font-mono mt-2 text-sm">
                    Enter your coordinates and pipeline requirements.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  
                  {/* Name */}
                  <div className="flex flex-col gap-3 relative group">
                    <Label className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <User className="w-3 h-3" /> Operative_Name
                    </Label>
                    <div className="relative">
                      <CyberCorners active={activeField === 'name'} />
                      <Input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onFocus={() => setActiveField('name')}
                        onBlur={() => setActiveField(null)}
                        placeholder="Jane Doe"
                        className="w-full rounded-none  bg-background/50 p-6 pl-4 font-mono text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-primary/5 focus-visible:border-primary transition-all placeholder:text-muted"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-3 relative group">
                    <Label className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <Mail className="w-3 h-3" /> Comm_Link (Email)
                    </Label>
                    <div className="relative">
                      <CyberCorners active={activeField === 'email'} />
                      <Input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => setActiveField('email')}
                        onBlur={() => setActiveField(null)}
                        placeholder="jane@corp.com"
                        className="w-full rounded-none  bg-background/50 p-6 pl-4 font-mono text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-primary/5 focus-visible:border-primary transition-all placeholder:text-muted"
                      />
                    </div>
                  </div>
                </div>

                {/* Company */}
                <div className="flex flex-col gap-3 relative group">
                  <Label className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Building className="w-3 h-3" /> Organization
                  </Label>
                  <div className="relative">
                    <CyberCorners active={activeField === 'company'} />
                    <Input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      onFocus={() => setActiveField('company')}
                      onBlur={() => setActiveField(null)}
                      placeholder="Acme Hardware Ltd."
                      className="w-full rounded-none  bg-background/50 p-6 pl-4 font-mono text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-primary/5 focus-visible:border-primary transition-all placeholder:text-muted"
                    />
                  </div>
                </div>

                {/* Plan Selection (Custom Radio Buttons mapped to Shadcn colors) */}
                <div className="flex flex-col gap-4">
                  <Label className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                    Target_Resource_Allocation (Plan)
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {plans.map((plan) => {
                      const isSelected = formData.plan === plan.id;
                      return (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, plan: plan.id }))}
                          className={`flex flex-col items-center justify-center gap-2 py-4 px-2 border transition-all duration-300 relative overflow-hidden group/plan ${
                            isSelected 
                              ? 'bg-primary/10 border-primary/80 text-primary shadow-[inset_0_0_15px_hsl(var(--primary)/0.2)]' 
                              : 'bg-background/40  text-muted-foreground hover:border-border hover:text-foreground'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
                          )}
                          <div className={`transition-transform duration-300 ${isSelected ? 'scale-110 drop-shadow-[0_0_8px_hsl(var(--primary)/0.8)]' : 'group-hover/plan:scale-110'}`}>
                            {plan.icon}
                          </div>
                          <span className="font-mono text-xs font-bold uppercase tracking-wider">{plan.id}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-3 relative group flex-1">
                  <Label className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare className="w-3 h-3" /> Telemetry_Data (Project Details)
                  </Label>
                  <div className="relative h-full flex flex-col">
                    <CyberCorners active={activeField === 'message'} />
                    <Textarea
                      required
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      onFocus={() => setActiveField('message')}
                      onBlur={() => setActiveField(null)}
                      placeholder="Describe your hardware pipeline bottlenecks..."
                      className="w-full rounded-none flex-1 min-h-[140px]  bg-background/50 p-4 font-mono text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-primary/5 focus-visible:border-primary transition-all placeholder:text-muted resize-y"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 group/submit relative font-mono text-sm font-bold uppercase tracking-[0.2em] rounded-none overflow-hidden transition-all shadow-[0_0_20px_hsl(var(--primary)/0.2)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {/* Sliding light effect */}
                    <span className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] translate-x-[-100%] group-hover/submit:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                    
                    {isSubmitting ? (
                      <span className="relative z-10 flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        TRANSMITTING...
                      </span>
                    ) : (
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        <Send className="w-4 h-4" />
                        Execute_Transmission
                      </span>
                    )}
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </main>
  );
};

export default ContactPage;