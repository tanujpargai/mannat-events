import type { Metadata } from 'next'
import { SignupForm } from '@/components/auth/SignupForm'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Create Account — Mannat Events',
  description: 'Create your Mannat Events account and start planning your dream destination wedding.',
}

export default function SignupPage() {
  return (
    <>
      <h2
        className="text-3xl font-light mb-2"
        style={{ fontFamily: 'Cormorant Garamond, serif', color: '#FAF3E8' }}
      >
        Begin your story
      </h2>
      <p className="text-sm mb-8 font-light" style={{ color: 'rgba(250,243,232,0.45)' }}>
        Create your account and start planning your dream wedding.
      </p>

      <SignupForm />

      <p className="mt-6 text-center text-sm" style={{ color: 'rgba(250,243,232,0.4)' }}>
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium transition-colors"
          style={{ color: '#C9A84C' }}
        >
          Sign in
        </Link>
      </p>
    </>
  )
}
