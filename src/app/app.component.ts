import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, map, first, combineLatest } from 'rxjs';
import type { Subscription } from 'rxjs';

import { Service } from './app.service';
import type { IRegion, ICountry } from './types';
import type { ISelectOption } from './select/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [Service],
})
export class AppComponent implements OnInit, OnDestroy {
  private regionsRawData$ = new Subject<IRegion[]>();
  private countriesRawData$ = new Subject<ICountry[]>();

  private regionsData$ = new BehaviorSubject<ISelectOption[]>([]);
  private countriesData$ = new BehaviorSubject<ISelectOption[]>([]);

  private regionSelectedName$ = new Subject<string>();
  private countrySelectedName$ = new Subject<string>();
  private selectedCountry$ = new BehaviorSubject<ICountry | null>(null);
  private subscriptions: Subscription[] = [];

  private subscribeToFetchRegions = (): Subscription => {
    return this.service
      .fetchRegions$()
      .pipe(
        map((data) => {
          const selectData = this.transformDataForSelect(data);
          this.regionsRawData$.next(data);
          this.regionsData$.next(selectData);
          this.countrySelectedName$.next('');

          return data;
        })
      )
      .pipe()
      .subscribe();
  };
  private subscribeToFetchCountries = (): Subscription => {
    return this.regionSelectedName$
      .pipe(
        map((name) => {
          this.service
            .fetchCountriesByRegionName$(name)
            .pipe(first())
            .pipe(
              map((data) => {
                const selectData = this.transformDataForSelect(data);
                this.countriesRawData$.next(data);
                this.countriesData$.next(selectData);
              })
            )
            .subscribe();
        })
      )
      .subscribe();
  };
  private subscribeToChangeCountryName = (): Subscription => {
    return combineLatest(this.countrySelectedName$, this.countriesRawData$)
      .pipe(
        map(([selectedCountryName, countries]) => {
          const selectedCountryData = countries.find(
            ({ name }) => name === selectedCountryName
          );

          this.selectedCountry$.next(selectedCountryData || null);
        })
      )
      .subscribe();
  };

  constructor(private service: Service) {
    this.subscriptions.push(this.subscribeToFetchRegions());
    this.subscriptions.push(this.subscribeToFetchCountries());
    this.subscriptions.push(this.subscribeToChangeCountryName());
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  transformDataForSelect(data: ICountry[] | IRegion[]) {
    return data.map(({ name }) => {
      return {
        id: name,
        label: name.charAt(0).toUpperCase() + name.slice(1),
      };
    });
  }

  getRegions() {
    return this.regionsData$.getValue();
  }

  getCountries() {
    return this.countriesData$.getValue();
  }

  setSelectedRegionName(name: string) {
    this.regionSelectedName$.next(name);
  }

  setSelectedCountryName(name: string) {
    this.countrySelectedName$.next(name);
  }
  getSelectedCountry() {
    return this.selectedCountry$.getValue();
  }

  getTableColumns() {
    return [
      {
        header: 'Name',
        cellField: 'name',
      },
      {
        header: 'Capital',
        cellField: 'capital',
      },
      {
        header: 'Population',
        cellField: 'population',
      },
      {
        header: 'Currencies',
        renderField: (data: ICountry) => {
          return data.currencies
            .map(({ name, symbol }) => {
              return `${name}, ${symbol}`;
            })
            .join(' ');
        },
      },
      {
        header: 'Flag',
        renderField: (data: ICountry) => {
          return `<img src="${data.flag}" alt="" width="30"/>`;
        },
      },
    ];
  }
}
