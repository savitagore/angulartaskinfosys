import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, forkJoin, Observable, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpacexApiService {
  private baseUrl = 'https://api.spacexdata.com/v4';

  constructor(private http: HttpClient) {}

  getPastLaunches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/launches/past`);
  }

  getUpcomingLaunches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/launches/upcoming`);
  }

  getRocketsByIds(ids: string[]): Observable<any[]> {
    return forkJoin(
      ids.map((id) => this.http.get(`${this.baseUrl}/rockets/${id}`))
    );
  }
}
