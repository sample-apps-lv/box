import { TopNav } from './top-nav';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopNav />
      <main className="flex-1 overflow-auto scrollbar-hud">
        {children}
      </main>
    </div>
  );
};
