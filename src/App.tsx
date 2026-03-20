import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/app-layout";
import LandingPage from "@/features/landing/components/landing-page";
import BomInputPage from "@/features/analyse/components/bom-input-page";
import LiveAnalysisPage from "@/features/analyse/components/live-analysis-page";
import PreCommitmentPage from "@/features/report/components/pre-commitment-page";
import ExportPage from "@/features/report/components/export-page";
import DashboardPage from "@/features/dashboard/components/dashboard-page";
import InventoryPage from "@/features/inventory/components/inventory-page";
import PipelinePage from "@/features/pipeline/components/pipeline-page";
import EngineeringPage from "@/features/engineering/components/engineering-page";
import NotFound from "./pages/NotFound.tsx";
import ContactPage from "./pages/contact-page.tsx";
import ModelView from "./pages/model-view.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/analyse" element={<BomInputPage />} />
            <Route path="/analyse/live" element={<LiveAnalysisPage />} />
            <Route path="/report/:reportId" element={<PreCommitmentPage />} />
            <Route path="/report/:reportId/export" element={<ExportPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/pipeline" element={<PipelinePage />} />
            <Route path="/engineering" element={<EngineeringPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/model-view" element={<ModelView />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
