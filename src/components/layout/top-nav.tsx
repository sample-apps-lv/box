import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useHealthCheck } from '@/api/health/use-health-check';
import {
  Activity,
  BarChart3,
  Boxes,
  Cpu,
  FileText,
  Settings,
  Warehouse,
} from 'lucide-react';

const APP_NAME = import.meta.env.VITE_APP_NAME || 'BOX';

const navItems = [
  { label: 'Analyse', path: '/', icon: Cpu },
  { label: 'Dashboard', path: '/dashboard', icon: BarChart3 },
  { label: 'Inventory', path: '/inventory', icon: Warehouse },
  { label: 'Pipeline', path: '/pipeline', icon: Boxes },
  { label: 'Engineering', path: '/engineering', icon: Settings },
];

export const TopNav = () => {
  const location = useLocation();
  const { data: health } = useHealthCheck();
  const isConnected = health?.ollama === 'connected';

  return (
    <header className="h-10 flex items-center border-b border-primary/10 bg-background/80 backdrop-blur-md px-4 shrink-0">
      <Link to="/" className="flex items-center gap-2 mr-8">
        <div className="w-5 h-5 border border-primary/60 flex items-center justify-center">
          <Activity className="w-3 h-3 text-primary" />
        </div>
        <span className="font-mono text-hud-data font-bold text-primary tracking-[0.15em]">{APP_NAME}</span>
      </Link>

      <nav className="flex items-center gap-0.5">
        {navItems.map((item) => {
          const isActive = item.path === '/'
            ? location.pathname === '/' || location.pathname.startsWith('/analyse') || location.pathname.startsWith('/report')
            : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 font-mono text-hud-label uppercase tracking-[0.15em] transition-colors duration-200',
                isActive
                  ? 'text-primary bg-primary/10 border-b border-primary/50'
                  : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
              )}
            >
              <item.icon className="w-3 h-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-3">
        {health && (
          <div className="flex items-center gap-1.5 font-mono text-hud-label">
            <span className={cn('w-1.5 h-1.5', isConnected ? 'bg-hud-green' : 'bg-hud-red')} />
            <span className={cn(isConnected ? 'text-hud-green' : 'text-hud-red')}>
              {isConnected ? 'SYSTEM_ONLINE' : 'SYSTEM_OFFLINE'}
            </span>
          </div>
        )}
        <span className="font-mono text-hud-label text-muted-foreground">
          {health?.model || '—'}
        </span>
      </div>
    </header>
  );
};
