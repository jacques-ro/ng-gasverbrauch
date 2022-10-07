import { Entity } from './entity';

export enum ReadingType {
  Regular = 'Regular',
  StartOfHeatingPeriod = 'StartOfHeatingPeriod',
  EndOfHeatingPeriod = 'EndOfHeatingPeriod',
}

export interface Reading extends Entity {
  contractId: string;
  date: Date;
  value: number;
  type: ReadingType;
}
