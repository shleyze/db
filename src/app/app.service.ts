import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import type { ICountry, IRegion } from './types';

@Injectable()
export class Service {
  private baseUrl = 'https://restcountries.com/v2/region';
  private mockRegionsData$ = new BehaviorSubject<IRegion[]>([
    { name: 'africa' },
    { name: 'americas' },
    { name: 'asia' },
    { name: 'europe' },
    { name: 'oceania' },
  ]);
  constructor(private http: HttpClient) {}

  fetchCountriesByRegionName$(regionId: string): Observable<ICountry[]> {
    return this.http.get<ICountry[]>(`${this.baseUrl}/${regionId}`);
  }
  fetchRegions$(): Observable<IRegion[]> {
    return this.mockRegionsData$;
  }
}
