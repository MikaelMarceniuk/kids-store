export interface ApiError<X = undefined> {
  message: string
  errors?: string[]
  statusCode: number
  custom?: X
}
