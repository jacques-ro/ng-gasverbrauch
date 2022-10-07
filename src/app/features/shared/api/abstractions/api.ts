import { Observable } from 'rxjs';
import { ApiActionResult, ApiQueryResult } from '../models/api';
import { Reading } from '../models/reading';

export interface IReadingsApi {
  saveReadings(readings: Reading[]): Observable<ApiActionResult>;
  getReadings(): Observable<ApiQueryResult<Reading[]>>;
  getReadingsByContract(contractId: string): Observable<ApiQueryResult<Reading[]>>;
  getReadingById(contractId: string, id: string): Observable<ApiQueryResult<Reading>>;
  getReadingsByRange(contractId: string, from: Date, to: Date): Observable<ApiQueryResult<Reading[]>>;
}

export interface IContractsApi {
  // TODO: to be defined
}
