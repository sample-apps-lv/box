import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: number;
  className?: string;
}

export const ScoreGauge = ({ score, label, size = 80, className }: ScoreGaugeProps) => {
  const color = score >= 85 ? 'hsl(142, 76%, 36%)' : score >= 65 ? 'hsl(35, 92%, 50%)' : 'hsl(0, 84%, 60%)';
  const circumference = 2 * Math.PI * 32;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <svg width={size} height={size} viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="32" fill="none" stroke="hsl(215, 25%, 15%)" strokeWidth="4" />
        <motion.circle
          cx="40" cy="40" r="32"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.2, 0, 0, 1] }}
          transform="rotate(-90 40 40)"
          strokeLinecap="butt"
        />
        <text x="40" y="36" textAnchor="middle" fill={color} className="font-mono text-[18px] font-bold">
          {score}
        </text>
        <text x="40" y="50" textAnchor="middle" fill="hsl(215, 20%, 55%)" className="font-mono text-[8px] uppercase tracking-[0.15em]">
          / 100
        </text>
      </svg>
      <span className="text-hud-label font-mono uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
    </div>
  );
};
