/**
 * TrendAgent API Client
 * 
 * Типобезопасный клиент для работы с TrendAgent API
 * 
 * @example
 * ```typescript
 * import { TrendAgentAPI } from './api-client';
 * 
 * const api = new TrendAgentAPI('https://api.yourdomain.com/api/trendagent');
 * 
 * // Получить каталог ЖК
 * const blocks = await api.catalog.get('blocks', { page: 1, per_page: 20 });
 * 
 * // Получить детали квартиры
 * const apartment = await api.detail.get('apartments', '123', { with_media: true });
 * ```
 */

import type {
  ObjectType,
  Entity,
  EntityByType,
  CatalogResponse,
  DetailResponse,
  CatalogParams,
  DetailParams,
  SearchParams,
  ErrorResponse,
} from '../types/trendagent';

export class TrendAgentAPIError extends Error {
  constructor(
    public statusCode: number,
    public error: string,
    message?: string
  ) {
    super(message || error);
    this.name = 'TrendAgentAPIError';
  }
}

export interface TrendAgentAPIConfig {
  baseURL: string;
  headers?: Record<string, string>;
  timeout?: number;
}

export class TrendAgentAPI {
  private config: Required<TrendAgentAPIConfig>;

  constructor(baseURLOrConfig: string | TrendAgentAPIConfig) {
    if (typeof baseURLOrConfig === 'string') {
      this.config = {
        baseURL: baseURLOrConfig,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      };
    } else {
      this.config = {
        baseURL: baseURLOrConfig.baseURL,
        headers: baseURLOrConfig.headers || {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: baseURLOrConfig.timeout || 30000,
      };
    }
  }

  /**
   * Выполнить HTTP запрос
   */
  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseURL}${path}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.config.headers,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        const error = data as ErrorResponse;
        throw new TrendAgentAPIError(
          response.status,
          error.error,
          error.message
        );
      }

      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof TrendAgentAPIError) {
        throw error;
      }
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new TrendAgentAPIError(408, 'Request Timeout');
        }
        throw new TrendAgentAPIError(0, 'Network Error', error.message);
      }
      
      throw error;
    }
  }

  /**
   * Построить query string из параметров
   */
  private buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }

      if (key === 'filter' && typeof value === 'object') {
        Object.entries(value).forEach(([filterKey, filterValue]) => {
          if (Array.isArray(filterValue)) {
            filterValue.forEach(v => {
              searchParams.append(`filter[${filterKey}][]`, String(v));
            });
          } else {
            searchParams.append(`filter[${filterKey}]`, String(filterValue));
          }
        });
      } else if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(`${key}[]`, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    });

    const qs = searchParams.toString();
    return qs ? `?${qs}` : '';
  }

  /**
   * Catalog API
   */
  public catalog = {
    /**
     * Получить каталог объектов
     */
    get: async <T extends ObjectType>(
      type: T,
      params: CatalogParams = {}
    ): Promise<CatalogResponse<EntityByType<T>>> => {
      const queryString = this.buildQueryString(params);
      return this.request(`/catalog/${type}${queryString}`);
    },

    /**
     * Получить количество объектов
     */
    count: async (
      type: ObjectType,
      filters: Record<string, any> = {}
    ): Promise<{ success: true; data: { count: number; type: string; filters: any } }> => {
      const queryString = this.buildQueryString({ filter: filters });
      return this.request(`/catalog/${type}/count${queryString}`);
    },

    /**
     * Поиск по нескольким типам
     */
    search: async (
      params: SearchParams
    ): Promise<{ success: true; data: Record<string, any> }> => {
      return this.request('/catalog/search', {
        method: 'POST',
        body: JSON.stringify(params),
      });
    },
  };

  /**
   * Detail API
   */
  public detail = {
    /**
     * Получить детальную информацию по ID
     */
    get: async <T extends ObjectType>(
      type: T,
      id: string,
      params: DetailParams = {}
    ): Promise<DetailResponse<EntityByType<T>>> => {
      const queryString = this.buildQueryString(params);
      return this.request(`/${type}/${id}${queryString}`);
    },

    /**
     * Получить детальную информацию по slug
     */
    getBySlug: async <T extends ObjectType>(
      type: T,
      slug: string,
      params: DetailParams = {}
    ): Promise<DetailResponse<EntityByType<T>>> => {
      const queryString = this.buildQueryString(params);
      return this.request(`/${type}/by-slug/${slug}${queryString}`);
    },

    /**
     * Получить медиа для объекта
     */
    media: async (
      type: ObjectType,
      id: string
    ): Promise<{ success: true; data: any }> => {
      return this.request(`/${type}/${id}/media`);
    },

    /**
     * Batch получение по нескольким ID
     */
    batch: async <T extends ObjectType>(
      type: T,
      ids: string[],
      withAggregation: boolean = true
    ): Promise<{ success: true; data: Record<string, any> }> => {
      return this.request(`/${type}/batch`, {
        method: 'POST',
        body: JSON.stringify({
          ids,
          with_aggregation: withAggregation,
        }),
      });
    },
  };

  /**
   * Dictionaries API
   */
  public dictionaries = {
    /**
     * Получить все справочники для типа
     */
    getAll: async (
      type: ObjectType
    ): Promise<{ success: true; data: Record<string, any> }> => {
      return this.request(`/dictionaries/${type}`);
    },

    /**
     * Получить конкретный справочник
     */
    get: async (
      type: ObjectType,
      key: string
    ): Promise<{ success: true; data: { key: string; values: any[] } }> => {
      return this.request(`/dictionaries/${type}/${key}`);
    },
  };
}

// ============================================================================
// React Hooks (опционально)
// ============================================================================

import { useState, useEffect } from 'react';

/**
 * Hook для получения каталога
 */
export function useCatalog<T extends ObjectType>(
  api: TrendAgentAPI,
  type: T,
  params: CatalogParams = {}
) {
  const [data, setData] = useState<CatalogResponse<EntityByType<T>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await api.catalog.get(type, params);
        if (mounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [api, type, JSON.stringify(params)]);

  return { data, loading, error };
}

/**
 * Hook для получения детальной информации
 */
export function useDetail<T extends ObjectType>(
  api: TrendAgentAPI,
  type: T,
  id: string,
  params: DetailParams = {}
) {
  const [data, setData] = useState<DetailResponse<EntityByType<T>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await api.detail.get(type, id, params);
        if (mounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [api, type, id, JSON.stringify(params)]);

  return { data, loading, error };
}

// ============================================================================
// Примеры использования
// ============================================================================

/*
// 1. Создание клиента
const api = new TrendAgentAPI('https://api.yourdomain.com/api/trendagent');

// 2. Получение каталога ЖК
const blocks = await api.catalog.get('blocks', {
  page: 1,
  per_page: 20,
  filter: {
    price_from: 5000000,
    class: 'comfort'
  }
});

console.log(`Всего ЖК: ${blocks.meta.total}`);
blocks.data.forEach(block => {
  console.log(`${block.name} - ${block.price.from?.formatted}`);
});

// 3. Получение детальной информации
const apartment = await api.detail.get('apartments', '63c5614728d3bcf2420860b1', {
  with_media: true
});

console.log(`Квартира: ${apartment.data.rooms.label}`);
console.log(`Цена: ${apartment.data.price?.formatted}`);
console.log(`Фото: ${apartment.media.photos.length}`);

// 4. Поиск с фильтрами
const searchResult = await api.catalog.get('apartments', {
  filter: {
    rooms: [2, 3],
    price_from: 5000000,
    price_to: 10000000
  }
});

// 5. Использование в React
function BlocksList() {
  const { data, loading, error } = useCatalog(api, 'blocks', { page: 1 });
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;
  
  return (
    <div>
      <h1>ЖК ({data.meta.total})</h1>
      {data.data.map(block => (
        <div key={block.id}>
          <h2>{block.name}</h2>
          <p>{block.price.from?.formatted}</p>
        </div>
      ))}
    </div>
  );
}

function ApartmentDetail({ id }: { id: string }) {
  const { data, loading, error } = useDetail(api, 'apartments', id, {
    with_media: true
  });
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;
  
  return (
    <div>
      <h1>{data.data.rooms.label}</h1>
      <p>Цена: {data.data.price?.formatted}</p>
      <p>Площадь: {data.data.area.total?.formatted}</p>
      <p>Этаж: {data.data.floor} из {data.data.floors_total}</p>
      {data.media.has_content && (
        <div>Фото: {data.media.photos.length}</div>
      )}
    </div>
  );
}
*/
