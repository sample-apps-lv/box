import { useQuery } from '@tanstack/react-query';
import { fetchApi, isMockMode } from '@/lib/fetch-api';
import type { HealthCheck } from '@/types/health';

const MOCK_HEALTH: HealthCheck = {
  status: 'ok',
  ollama: 'connected',
  model: 'qwen3:14b',
};

export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: async (): Promise<HealthCheck> => {
      if (isMockMode()) return MOCK_HEALTH;
      const res = await fetchApi('/api/v1/health');
      return res.json();
    },
    refetchInterval: 30000,
  });
};
