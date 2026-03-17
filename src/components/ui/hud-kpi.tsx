import { cn } from '@/lib/utils';

interface HudKpiProps {
  value: string | number;
  label: string;
  sublabel?: string;
  status?: 'nominal' | 'warning' | 'critical';
  className?: string;
}

export const HudKpi = ({ value, label, sublabel, status = 'nominal', className }: HudKpiProps) => {
  const valueColor = {
    nominal: 'text-primary hud-text-glow',
    warning: 'text-hud-amber',
    critical: 'text-hud-red',
  }[status];

  return (
    <div className={cn('hud-glass border-l-2 border-l-primary/30 p-3', className)}>
      <div className={cn('font-mono text-hud-xl font-bold', valueColor)}>{value}</div>
      <div className="text-hud-label font-mono uppercase tracking-[0.2em] text-muted-foreground mt-1">{label}</div>
      {sublabel && <div className="text-hud-label font-mono text-muted-foreground/60 mt-0.5">{sublabel}</div>}
    </div>
  );
};
