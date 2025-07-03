
import { useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export const useApiRequests = () => {
  const makeRequest = useCallback(async <T = any>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    try {
      console.log(`Making request to: ${url}`);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      
      if (!contentType || !contentType.includes('application/json')) {
        console.warn(`Response is not JSON. Content-Type: ${contentType}`);
        const text = await response.text();
        console.warn(`Response text: ${text.substring(0, 100)}...`);
        
        // Return empty data for non-JSON responses instead of throwing error
        return {
          data: null,
          error: null,
          loading: false,
        };
      }

      const data = await response.json();
      console.log(`Request successful for: ${url}`);
      
      return {
        data,
        error: null,
        loading: false,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Request failed for ${url}:`, errorMessage);
      
      // Don't show toast for every API error to avoid spam
      if (!errorMessage.includes('Preview ha')) {
        toast({
          title: "Erro na requisição",
          description: `Falha ao conectar com: ${url}`,
          variant: "destructive",
        });
      }
      
      return {
        data: null,
        error: errorMessage,
        loading: false,
      };
    }
  }, []);

  const get = useCallback(<T = any>(url: string) => 
    makeRequest<T>(url, { method: 'GET' }), [makeRequest]);

  const post = useCallback(<T = any>(url: string, data: any) => 
    makeRequest<T>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    }), [makeRequest]);

  return { get, post, makeRequest };
};
