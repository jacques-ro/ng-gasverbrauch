import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IReadingsApi } from '../abstractions/api';
import { ApiActionResult, ApiQueryResult, ApiResultStatus } from '../models/api';
import { Reading } from '../models/reading';


/**
 * Stores readings per contract
 */
 type ReadingStorage = Record<string, Reading[]>;

@Injectable({
  providedIn: 'root'
})
export class ApiService implements IReadingsApi {

  constructor() {
    if(!window.localStorage) {
      throw new Error(`No localstorage found`)
    }
  }

  public saveReadings(readings: Reading[]): Observable<ApiActionResult> {
    return new Observable((subscriber) => {
      try {
        this._assertOneContract(readings);
        this._assertNotEmpty(readings);

        const currentReadings = this._getReadingStorage();

        const contractId = readings[0].contractId;

        // clear readings of the context contract
        currentReadings[contractId] = readings;

        this._setReadingStorage(currentReadings);

        subscriber.next({
          status: ApiResultStatus.Success,
        });
        subscriber.complete();
      } catch (error) {
        subscriber.next({
          status: ApiResultStatus.Error,
          error: error as Error
        })
        subscriber.complete();
      }
    });
  }
  public getReadings(): Observable<ApiQueryResult<Reading[]>> {

    return new Observable((subscriber) => {
      try {
        const readings = this._getReadingStorage();

        const flat: Reading[] = [];

        for (const contract of Object.values(readings)) {
          flat.push(...contract);
        }

        subscriber.next({
          status: ApiResultStatus.Success,
          data: flat,
        });
        subscriber.complete();

      } catch (error) {
        subscriber.next({
          status: ApiResultStatus.Error,
          error: error as Error
        });
        subscriber.complete();
      }
    });
  }
  public getReadingsByContract(contractId: string): Observable<ApiQueryResult<Reading[]>> {
    return new Observable((subscriber) => {
      const contractReadings = this._getReadingStorage()[contractId] || [];

      subscriber.next({
        status: ApiResultStatus.Success,
        data: contractReadings,
      });
      subscriber.complete();
    });
  }
  public getReadingById(contractId: string, id: string): Observable<ApiQueryResult<Reading>> {
    return new Observable((subscriber) => {

      try {
        const readings = this._getReadingStorage()[contractId];

        if(!readings) {
          throw new Error(`No readings for contract '${contractId}'`);
        }

        const reading = readings.find((r) => r.id === id);

        if(!reading) {
          throw new Error(`Reading with id '${id}' does not exist in contract '${contractId}'`);
        }

        subscriber.next({
          status: ApiResultStatus.Success,
          data: reading,
        });
        subscriber.complete();

      } catch (error) {
        subscriber.next({
          status: ApiResultStatus.Error,
          error: error as Error,
        });
        subscriber.complete();
      }

    });
  }
  public getReadingsByRange(contractId: string, from: Date, to: Date): Observable<ApiQueryResult<Reading[]>> {
    return new Observable((subscriber) => {
      const contractReadings = this._getReadingStorage()[contractId] || [];

      const rangeReadings: Reading[] = contractReadings.filter((r) => r.date >= from && r.date <= to);

      subscriber.next({
        status: ApiResultStatus.Success,
        data: rangeReadings,
      });
      subscriber.complete();
    });
  }

  private _assertOneContract(readings: Reading[]): void {
    let firstContractId: string = '';

      for (const reading of readings) {
        if(firstContractId) {
          if(reading.contractId !== firstContractId) {
            throw new Error(`Cannot store readings for multiple contracts at once`);
          }
        } else {
          firstContractId = reading.contractId;
        }
      }
  }

  private _assertNotEmpty(readings: Reading[]): void {
    if(!Array.isArray(readings) || !readings.length) {
      throw new Error(`No readings in list`);
    }
  }

  private _getReadingStorage(): ReadingStorage {
    const ls = window.localStorage;
    const rawStorage = ls.getItem('readings');
    return rawStorage ? JSON.parse(rawStorage) as ReadingStorage : {};
  }

  private _setReadingStorage(storage: ReadingStorage): void {
    const ls = window.localStorage;
    const rawStorage = ls.setItem('readings', JSON.stringify(storage));
  }
}
