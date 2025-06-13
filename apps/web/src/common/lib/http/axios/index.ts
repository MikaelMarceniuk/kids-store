import axios from 'axios'
import { setupInterceptors } from './interceptors'

export const api = axios.create({
  // TODO Implement .env
  baseURL: 'http://localhost:3333',
  withCredentials: true,
})

setupInterceptors(api)
