import type { UnknownObject } from '@pk/types/helpers.js';

export class ApiService {
  #baseUrl: string;

  constructor(baseUrl: string) {
    this.#baseUrl = baseUrl;
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

      if (!response.ok) {
        throw new ApiError(`Response returned the "${response.status}" status code`);
      }

      return response.json();
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
