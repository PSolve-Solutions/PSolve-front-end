import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class CasheService {
  http = inject(HttpClient);
  private cache: { [key: string]: any } = {};

  get<T>(url: string, params?: HttpParams): Observable<T> {
    // Create a cache key by combining the URL and the serialized parameters
    const cacheKey = this.getCacheKey(url, params);

    // Check if the response is already cached
    if (this.cache[cacheKey]) {
      return of(this.cache[cacheKey]);
    } else {
      // If not cached, make the HTTP GET request and cache the response
      return this.http.get<T>(url, { params }).pipe(
        tap((response) => {
          this.cache[cacheKey] = response;
        })
      );
    }
  }

  clearCache(): void {
    this.cache = {};
  }

  private getCacheKey(url: string, params?: HttpParams): string {
    // If there are no params, return the URL as the cache key
    if (!params) {
      return url;
    }

    // Serialize the parameters and append them to the URL to form the cache key
    const serializedParams = params.toString();
    return `${url}?${serializedParams}`;
  }
}
