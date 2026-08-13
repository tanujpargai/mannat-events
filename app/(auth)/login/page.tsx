import type { Metadata } from 'next'
import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Sign In — Mannat Events',
  description: 'Sign in to your Mannat Events account to manage your destination wedding.',
}

export default function LoginPage() {
  return (
    <>
      <h2
        className="text-3xl font-light mb-2"
        style={{ fontFamily: 'Cormorant Garamond, serif', color: '#FAF3E8' }}
      >
        Welcome back
      </h2>
      <p className="text-sm mb-8 font-light" style={{ color: 'rgba(250,243,232,0.45)' }}>
        Enter your mobile number to receive a one-time passcode.
      </p>

      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <span
              className="h-6 w-6 animate-spin rounded-full border-2"
              style={{ borderColor: 'rgba(201,168,76,0.3)', borderTopColor: '#C9A84C' }}
            />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </>
  )
}
