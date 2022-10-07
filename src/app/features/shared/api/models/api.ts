export enum ApiResultStatus {
  Success = 'Success',
  Error = 'Error',
}

export interface ApiActionResult {
  status: ApiResultStatus;
  error?: Error;
}

export interface ApiQueryResult<TData> {
  status: ApiResultStatus;
  error?: Error | undefined;
  data?: TData | undefined
}
