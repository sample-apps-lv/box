import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface HudCardProps {
  title: string;
  children: React.ReactNode;
  status?: 'nominal' | 'warning' | 'critical';
  className?: string;
  compact?: boolean;
}

export const HudCard = ({ title, children, status = 'nominal', className, compact }: HudCardProps) => {
  const borderColor = {
    nominal: 'border-l-primary/50',
    warning: 'border-l-hud-amber/50',
    critical: 'border-l-hud-red/50',
  }[status];

  const headerBg = {
    nominal: 'bg-primary/10 border-b-primary/20',
    warning: 'bg-hud-amber/10 border-b-hud-amber/20',
    critical: 'bg-hud-red/10 border-b-hud-red/20',
  }[status];

  const titleColor = {
    nominal: 'text-primary',
    warning: 'text-hud-amber',
    critical: 'text-hud-red',
  }[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
      className={cn('relative hud-glass border-l-2', borderColor, className)}
    >
      <div className={cn('flex justify-between items-center px-3 py-1.5 border-b', headerBg)}>
        <span className={cn('text-hud-label uppercase tracking-[0.2em] font-mono', titleColor)}>
          {title}
        </span>
        <div className="flex gap-0.5">
          <div className="w-1 h-3 bg-primary/40" />
          <div className="w-1 h-3 bg-primary/20" />
        </div>
      </div>
      <div className={cn(compact ? 'p-2' : 'p-4')}>
        {children}
      </div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-primary/30" />
    </motion.div>
  );
};
