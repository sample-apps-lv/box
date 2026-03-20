import { cn } from '@/lib/utils';
import type { ComponentStatus } from '@/types/analysis';

interface StatusBadgeProps {
  status: ComponentStatus;
  className?: string;
}

const CONFIG: Record<ComponentStatus, { label: string; dotClass: string; textClass: string }> = {
  green: { label: 'IN STOCK', dotClass: 'bg-hud-green', textClass: 'text-hud-green' },
  yellow: { label: 'AT RISK', dotClass: 'bg-hud-amber', textClass: 'text-hud-amber' },
  red: { label: 'CRITICAL', dotClass: 'bg-hud-red', textClass: 'text-hud-red' },
  unknown: { label: 'UNKNOWN', dotClass: 'bg-muted-foreground', textClass: 'text-muted-foreground' },
  searching: { label: 'SEARCHING', dotClass: 'bg-primary animate-hud-pulse', textClass: 'text-primary' },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const { label, dotClass, textClass } = CONFIG[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 font-mono text-hud-label', textClass, className)}>
      <span className={cn('w-2 h-2', dotClass)} />
      {label}
    </span>
  );
};

interface SeverityBadgeProps {
  severity: 'PASS' | 'WARN' | 'FAIL';
  className?: string;
}

export const SeverityBadge = ({ severity, className }: SeverityBadgeProps) => {
  const cfg = {
    PASS: { icon: '✔', cls: 'text-hud-green' },
    WARN: { icon: '⚠', cls: 'text-hud-amber' },
    FAIL: { icon: '✖', cls: 'text-hud-red' },
  }[severity];
  return (
    <span className={cn('font-mono text-hud-label', cfg?.cls, className)}>
      {cfg?.icon} {severity}
    </span>
  );
};
