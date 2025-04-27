import { HttpStatus } from '@pk/types/api.js';
import type { UnknownObject } from '@pk/types/helpers.js';
import { navigate } from '../utils/navigate.ts';
import type { SessionService } from './SessionService.ts';

export class ApiService {
  static DEFAULT_LIMIT = 9999;

  #baseUrl: string;
  #sessionService: SessionService;

  constructor(baseUrl: string, sessionService: SessionService) {
    this.#baseUrl = baseUrl;
    this.#sessionService = sessionService;
  }

  delete<T>(url: string | URL): Promise<T> {
    return this.#performRequest<T, never>(url, 'DELETE');
  }

  get<T>(url: string | URL): Promise<T> {
    return this.#performRequest<T, never>(url, 'GET');
  }

  post<T, U extends UnknownObject = UnknownObject>(url: string | URL, body?: U): Promise<T> {
    return this.#performRequest<T, U>(url, 'POST', body);
  }

  put<T, U extends UnknownObject = UnknownObject>(url: string | URL, body?: U): Promise<T> {
    return this.#performRequest<T, U>(url, 'PUT', body);
  }

  async #performRequest<T, U extends UnknownObject>(
    url: string | URL,
    method: 'DELETE' | 'GET' | 'POST' | 'PUT',
    body?: U,
  ): Promise<T> {
    const origin = url instanceof URL ? url : new URL(url, this.#baseUrl);

    try {
      const response = await fetch(origin, {
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
        method,
      });

      const data = await response.json();

      if (response.status === HttpStatus.Unauthorized) {
        this.#sessionService.clear();
        navigate('#/');
      }

      if (!response.ok) {
        const fallbackMessage = `Response returned the "${response.status}" status code`;
        throw new ApiError('message' in data && typeof data.message === 'string' ? data.message : fallbackMessage);
      }

      return data;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }

      throw new ApiError('Unknown error', err);
    }
  }
}

export class ApiError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.name = 'ApiError';
  }
}
