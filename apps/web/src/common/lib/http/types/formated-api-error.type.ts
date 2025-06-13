export interface FormattedApiError<X = undefined> {
  statusCode: number
  error: string
  custom?: X
}
