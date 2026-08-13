'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, User, ShieldCheck, AlertCircle, ArrowRight, RefreshCcw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'

type Step = 'details' | 'otp'

export function SignupForm() {
  const router = useRouter()

  const [step, setStep] = useState<Step>('details')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendCooldown, setResendCooldown] = useState(0)

  function formatPhone(raw: string) {
    const digits = raw.replace(/\D/g, '')
    if (digits.startsWith('91') && digits.length > 10) return `+${digits}`
    return `+91${digits}`
  }

  async function sendOTP(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!fullName.trim()) {
      setError('Please enter your full name.')
      return
    }
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number.')
      return
    }
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: formatPhone(phone),
        options: {
          data: { full_name: fullName.trim() },
          shouldCreateUser: true,
        },
      })
      if (otpError) {
        setError(otpError.message || 'Failed to send OTP. Please try again.')
        return
      }
      setStep('otp')
      startCooldown()
    } catch {
      setError('Unable to send OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  async function verifyOTP(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (otp.length < 4) {
      setError('Please enter the OTP sent to your phone.')
      return
    }
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone: formatPhone(phone),
        token: otp,
        type: 'sms',
      })
      if (verifyError) {
        setError('Invalid or expired OTP. Please try again.')
        return
      }
      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Unable to verify OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  function startCooldown() {
    setResendCooldown(30)
    const timer = setInterval(() => {
      setResendCooldown((c) => {
        if (c <= 1) { clearInterval(timer); return 0 }
        return c - 1
      })
    }, 1000)
  }

  async function resendOTP() {
    if (resendCooldown > 0) return
    setError(null)
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: formatPhone(phone),
        options: { shouldCreateUser: true },
      })
      if (otpError) {
        setError(otpError.message || 'Failed to resend OTP.')
        return
      }
      startCooldown()
    } catch {
      setError('Unable to resend OTP.')
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = "w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-[#6B6B6B] focus:ring-2 focus:ring-[#C9A84C]/40"
  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(201,168,76,0.25)',
    color: '#FAF3E8',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <AnimatePresence mode="wait">
        {step === 'details' ? (
          <motion.form
            key="details-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
            onSubmit={sendOTP}
            className="space-y-5"
          >
            {/* Full name */}
            <div>
              <Label htmlFor="full_name" required variant="dark">
                Full Name
              </Label>
              <div className="relative">
                <input
                  id="full_name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  className={`${inputClass} pr-10`}
                  style={inputStyle}
                />
                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8A8A8]" />
              </div>
            </div>

            {/* Phone number */}
            <div>
              <Label htmlFor="phone" required variant="dark">
                Mobile Number
              </Label>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold select-none pointer-events-none"
                  style={{ color: '#C9A84C' }}
                >
                  +91
                </span>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  autoComplete="tel"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  disabled={isLoading}
                  className={`${inputClass} pl-12 pr-10`}
                  style={inputStyle}
                />
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8A8A8]" />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-semibold text-red-400 flex items-center gap-1.5"
                role="alert"
              >
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </motion.p>
            )}

            <Button type="submit" loading={isLoading} className="w-full" size="lg">
              Send OTP <ArrowRight size={14} />
            </Button>
          </motion.form>
        ) : (
          <motion.form
            key="otp-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
            onSubmit={verifyOTP}
            className="space-y-5"
          >
            {/* Sent-to hint */}
            <div
              className="rounded-xl border px-4 py-3 flex items-start gap-3 text-sm"
              style={{ border: '1px solid rgba(201,168,76,0.2)', background: 'rgba(201,168,76,0.06)', color: 'rgba(250,243,232,0.7)' }}
            >
              <ShieldCheck size={16} className="text-[#C9A84C] mt-0.5 shrink-0" />
              <span>
                OTP sent to <strong className="text-[#FAF3E8]">+91 {phone}</strong>.{' '}
                <button
                  type="button"
                  onClick={() => { setStep('details'); setOtp(''); setError(null) }}
                  className="text-[#C9A84C] underline underline-offset-2 hover:text-[#E8C97A] transition-colors"
                >
                  Change number?
                </button>
              </span>
            </div>

            <div>
              <Label htmlFor="otp" required variant="dark">
                Enter OTP
              </Label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                autoComplete="one-time-code"
                placeholder="• • • • • •"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                disabled={isLoading}
                className="w-full rounded-xl border px-4 py-3 text-center text-2xl font-bold outline-none transition-all duration-200 focus:ring-2 focus:ring-[#C9A84C]/40"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(201,168,76,0.25)',
                  color: '#FAF3E8',
                  letterSpacing: '0.4em',
                }}
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-semibold text-red-400 flex items-center gap-1.5"
                role="alert"
              >
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </motion.p>
            )}

            <Button type="submit" loading={isLoading} className="w-full" size="lg">
              Verify &amp; Create Account
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={resendOTP}
                disabled={resendCooldown > 0 || isLoading}
                className="text-xs flex items-center gap-1.5 mx-auto transition-colors disabled:opacity-40"
                style={{ color: resendCooldown > 0 ? 'rgba(250,243,232,0.35)' : '#C9A84C' }}
              >
                <RefreshCcw size={12} />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
