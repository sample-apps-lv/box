import { useQuery } from "@tanstack/react-query";
import { fetchApi, isMockMode } from "@/lib/fetch-api";
import type {
  DashboardSummary,
  DashboardAlert,
  DashboardProject,
  WatchlistItem,
  IpcSummaryItem,
  IpcSummary,
} from "@/types/dashboard";

const MOCK_SUMMARY: DashboardSummary = {
  total_products: 12,
  total_reports: 47,
  active_alerts: 3,
  avg_risk_score: 58,
};

export const useDashboardSummary = () =>
  useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: async (): Promise<DashboardSummary> => {
      if (isMockMode()) return MOCK_SUMMARY;
      const res = await fetchApi("/api/v1/dashboard/summary");
      return res.json();
    },
    refetchInterval: 300000,
  });

const MOCK_ALERTS: DashboardAlert[] = [
  {
    id: "1",
    severity: "CRITICAL",
    mpn: "EIP-10S048",
    message: "Stock depleted — 0 units available across all distributors",
    affected_products: ["IoT Gateway v2"],
    created_at: "2026-03-17T08:00:00Z",
  },
  {
    id: "2",
    severity: "WARNING",
    mpn: "STM32H743VIT6",
    message: "Lead time increased from 4 to 8 weeks",
    affected_products: ["IoT Gateway v2", "Motor Controller v3"],
    created_at: "2026-03-16T14:30:00Z",
  },
  {
    id: "3",
    severity: "INFO",
    mpn: "CP2102N",
    message: "EOL notice published — successor CP2102N-A02 available",
    affected_products: ["IoT Gateway v2"],
    created_at: "2026-03-15T10:00:00Z",
  },
];

export const useDashboardAlerts = () =>
  useQuery({
    queryKey: ["dashboard", "alerts"],
    queryFn: async (): Promise<DashboardAlert[]> => {
      if (isMockMode()) return MOCK_ALERTS;
      const res = await fetchApi("/api/v1/dashboard/alerts");
      return res.json();
    },
  });

const MOCK_PROJECTS: DashboardProject[] = [
  {
    product: "IoT Gateway v2",
    revision: "B",
    last_analysed: "2026-03-17",
    risk_score: 74,
    go_no_go: false,
    ipc_class_achieved: 2,
    health_score: 54,
    report_id: "rpt-001",
  },
  {
    product: "Motor Controller v3",
    revision: "A",
    last_analysed: "2026-03-15",
    risk_score: 42,
    go_no_go: true,
    ipc_class_achieved: 3,
    health_score: 81,
    report_id: "rpt-002",
  },
  {
    product: "Sensor Hub Pro",
    revision: "C",
    last_analysed: "2026-03-14",
    risk_score: 28,
    go_no_go: true,
    ipc_class_achieved: 3,
    health_score: 92,
    report_id: "rpt-003",
  },
  {
    product: "Power Distribution Unit",
    revision: "A",
    last_analysed: "2026-03-12",
    risk_score: 65,
    go_no_go: false,
    ipc_class_achieved: 2,
    health_score: 61,
    report_id: "rpt-004",
  },
];

export const useDashboardProjects = () =>
  useQuery({
    queryKey: ["dashboard", "projects"],
    queryFn: async (): Promise<DashboardProject[]> => {
      if (isMockMode()) return MOCK_PROJECTS;
      const res = await fetchApi("/api/v1/dashboard/projects");
      return res.json();
    },
  });

const MOCK_WATCHLIST: WatchlistItem[] = [
  {
    mpn: "STM32H743VIT6",
    description: "32-bit MCU, 480MHz",
    stock_available: 12400,
    unit_price_usd: 14.22,
    lead_time_weeks: 4,
    trend: [14.1, 14.0, 14.2, 14.5, 14.22, 14.3, 14.8],
  },
  {
    mpn: "EIP-10S048",
    description: "48V DC-DC converter",
    stock_available: 40,
    unit_price_usd: 38.9,
    lead_time_weeks: 18,
    trend: [35.0, 36.2, 37.5, 38.0, 38.9, 39.1, 38.9],
  },
  {
    mpn: "CP2102N",
    description: "USB-UART Bridge",
    stock_available: 8500,
    unit_price_usd: 2.15,
    lead_time_weeks: 6,
    trend: [2.1, 2.1, 2.15, 2.12, 2.15, 2.18, 2.15],
  },
];

export const useDashboardWatchlist = () =>
  useQuery({
    queryKey: ["dashboard", "watchlist"],
    queryFn: async (): Promise<WatchlistItem[]> => {
      if (isMockMode()) return MOCK_WATCHLIST;
      const res = await fetchApi("/api/v1/dashboard/watchlist");
      return res.json();
    },
  });



const MOCK_RECENT_ITEMS: IpcSummaryItem[] = [
  { product: "IoT Gateway v2", pass_rate: 71, fail_count: 1 },
  { product: "Motor Controller v3", pass_rate: 95, fail_count: 0 },
  { product: "Sensor Hub Pro", pass_rate: 100, fail_count: 0 },
  { product: "Power Distribution Unit", pass_rate: 60, fail_count: 3 },
];

const MOCK_IPC_SUMMARY: IpcSummary = {
  total_reports: 124,     // Mocked aggregate data
  avg_ipc_score: 81.5,
  passing: 120,
  failing: 4,
  recent: MOCK_RECENT_ITEMS,
};

export const useDashboardIpcSummary = () =>
  useQuery({
    queryKey: ["dashboard", "ipc-summary"],
    queryFn: async (): Promise<IpcSummary> => {
      if (isMockMode()) return MOCK_IPC_SUMMARY;
      const res = await fetchApi("/api/v1/dashboard/ipc-summary");
      if (res.ok) {
        return await res.json();
      }
      throw new Error("Failed to fetch IPC summary");
    },
  });
