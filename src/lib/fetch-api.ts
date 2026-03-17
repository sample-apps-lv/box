const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const fetchApi = async (
  input: string | URL | Request,
  init?: RequestInit,
): Promise<Response> => {
  const url = typeof input === 'string' && input.startsWith('/') 
    ? `${BASE_URL}${input}` 
    : input;
  const response = await fetch(url, init);
  return response;
};

export const isMockMode = (): boolean => {
  return import.meta.env.VITE_MOCK_API_CALLS === 'true';
};
