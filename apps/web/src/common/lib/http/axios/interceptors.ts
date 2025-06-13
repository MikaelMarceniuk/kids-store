import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'

type CustomAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

export function setupInterceptors(api: AxiosInstance) {
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as
        | CustomAxiosRequestConfig
        | undefined

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !originalRequest.url?.includes('auth/refresh')
      ) {
        originalRequest._retry = true

        try {
          await api.post('/auth/refresh')
          return api(originalRequest)
        } catch (refreshError) {
          console.error('Erro ao renovar token:', refreshError)
          // Pode adicionar lógica de logout ou redirecionamento aqui
        }
      }

      return Promise.reject(error)
    }
  )
}
