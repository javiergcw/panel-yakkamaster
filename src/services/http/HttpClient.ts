/**
 * Cliente HTTP genérico para todos los servicios/repositorios.
 * Centraliza base URL, headers, manejo de errores y parsing JSON.
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpClientConfig {
  baseUrl: string;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

/** Same-origin when empty/unset (use with Next.js rewrites to hide API URL). */
const DEFAULT_BASE_URL =
  typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL?.trim()
    ? process.env.NEXT_PUBLIC_API_URL.trim()
    : '';

export class HttpClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly timeout: number;

  constructor(config: Partial<HttpClientConfig> = {}) {
    this.baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
    this.timeout = config.timeout ?? 30000;
  }

  private async request<T>(
    method: HttpMethod,
    path: string,
    body?: unknown,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = path.startsWith('http') ? path : `${this.baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    if (body instanceof FormData) {
      // Let the browser set Content-Type with boundary for multipart/form-data
      delete headers['Content-Type'];
    }

    const init: RequestInit = {
      method,
      headers,
      signal: options.signal ?? controller.signal,
    };

    if (body !== undefined && body !== null && method !== 'GET') {
      init.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(url, init);
      clearTimeout(timeoutId);

      const text = await response.text();
      let data: T;
      try {
        data = text ? (JSON.parse(text) as T) : (undefined as T);
      } catch {
        data = text as unknown as T;
      }

      if (!response.ok) {
        throw new HttpError(response.status, response.statusText, data);
      }

      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof HttpError) throw err;
      if (err instanceof Error) throw err;
      throw new Error(String(err));
    }
  }

  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', path, undefined, options);
  }

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', path, body, options);
  }

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', path, body, options);
  }

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', path, body, options);
  }

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', path, undefined, options);
  }
}
