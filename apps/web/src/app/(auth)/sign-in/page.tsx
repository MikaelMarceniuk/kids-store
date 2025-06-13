import { Suspense } from 'react'
import { LoginForm } from './_components/login-form'

export default function SignInPage() {
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Suspense fallback={<div>Carregando...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
