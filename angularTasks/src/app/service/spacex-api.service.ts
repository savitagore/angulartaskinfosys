import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, forkJoin, Observable, retry, throwError } from 'rxjs';
import { Launch, Payload, Rocket } from '../core/interface/interface';

@Injectable({
  providedIn: 'root',
})
export class SpacexApiService {
  private base = 'https://api.spacexdata.com/v4';

  constructor(private http: HttpClient) {}

  getPast(limit = 0, offset = 0): Observable<Launch[]> {
    const params: any = {};
    if (limit) {
      params.limit = limit;
      params.offset = offset;
    }
    return this.http.get<Launch[]>(`${this.base}/launches/past`, { params });
  }

  getUpcoming(): Observable<Launch[]> {
    return this.http.get<Launch[]>(`${this.base}/launches/upcoming`);
  }

  getById(id: string): Observable<Launch> {
    return this.http.get<Launch>(`${this.base}/launches/${id}`);
  }

  getRocket(id: string): Observable<Rocket> {
    return this.http.get<Rocket>(`${this.base}/rockets/${id}`);
  }

  getPayload(id: string): Observable<Payload> {
    return this.http.get<Payload>(`${this.base}/payloads/${id}`);
  }
}
