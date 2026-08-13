'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, ShieldCheck, AlertCircle, ArrowRight, RefreshCcw, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

interface Props {
  onVerified: () => void
  onPrev: () => void
}

type Step = 'phone' | 'otp'

export function StepPhoneVerify({ onVerified, onPrev }: Props) {
  const [step, setStep] = useState<Step>('phone')
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

  function startCooldown() {
    setResendCooldown(30)
    const timer = setInterval(() => {
      setResendCooldown((c) => {
        if (c <= 1) { clearInterval(timer); return 0 }
        return c - 1
      })
    }, 1000)
  }

  async function sendOTP(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number.')
      return
    }
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: formatPhone(phone),
        options: { shouldCreateUser: true },
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
      // Verified — proceed to review
      onVerified()
    } catch {
      setError('Unable to verify OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  async function resendOTP() {
    if (resendCooldown > 0) return
    setError(null)
    setIsLoading(true)
    try {
      const supabase = createClient()
      await supabase.auth.signInWithOtp({
        phone: formatPhone(phone),
        options: { shouldCreateUser: true },
      })
      startCooldown()
    } catch {
      setError('Unable to resend OTP.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="pb-28 md:pb-0"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5EDD6] border border-[#E8D9A8] mb-5">
          <Sparkles size={13} className="text-[#C5A85C]" />
          <span className="text-xs font-bold tracking-widest text-[#A08040] uppercase">Almost there!</span>
        </div>
        <h2 className="text-headline mb-2">Confirm Your Number</h2>
        <p className="text-body text-[#737373]">
          Verify your mobile number to see your personalised quotation and submit your booking request.
        </p>
      </div>

      {/* Card */}
      <div className="max-w-md rounded-2xl border border-[#E8E2D8] bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F0EDE9] bg-[#FDFCFA] flex items-center gap-2.5">
          <ShieldCheck size={16} className="text-[#C5A85C]" />
          <span className="text-xs font-bold tracking-widest uppercase text-[#737373]">Mobile Verification</span>
        </div>

        <div className="px-6 py-6">
          <AnimatePresence mode="wait">
            {step === 'phone' ? (
              <motion.form
                key="phone"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                onSubmit={sendOTP}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#737373] mb-2">
                    Mobile Number <span className="text-red-400">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-sm font-semibold text-[#C5A85C] select-none pointer-events-none">
                      +91
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      autoComplete="tel"
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      disabled={isLoading}
                      className="w-full pl-12 pr-10 py-3 rounded-xl border border-[#E8E2D8] text-sm font-medium text-[#1A1A1A] placeholder:text-[#C0B9B0] focus:outline-none focus:border-[#C5A85C] transition-colors"
                    />
                    <Phone size={15} className="absolute right-3 text-[#C0B9B0]" />
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-semibold text-red-600 flex items-center gap-1.5"
                    role="alert"
                  >
                    <AlertCircle size={13} className="shrink-0" />
                    {error}
                  </motion.p>
                )}

                <Button type="submit" loading={isLoading} size="lg" className="w-full">
                  Send OTP <ArrowRight size={14} />
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                onSubmit={verifyOTP}
                className="space-y-4"
              >
                {/* Sent-to hint */}
                <div className="rounded-xl bg-[#F5EDD6] border border-[#E8D9A8] px-4 py-3 flex items-start gap-2.5 text-sm">
                  <ShieldCheck size={15} className="text-[#C5A85C] mt-0.5 shrink-0" />
                  <span className="text-[#A08040]">
                    OTP sent to <strong className="text-[#1A1A1A]">+91 {phone}</strong>.{' '}
                    <button
                      type="button"
                      onClick={() => { setStep('phone'); setOtp(''); setError(null) }}
                      className="underline underline-offset-2 hover:text-[#C5A85C] transition-colors"
                    >
                      Change?
                    </button>
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#737373] mb-2">
                    Enter OTP <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="one-time-code"
                    placeholder="• • • • • •"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E2D8] text-center text-2xl font-bold text-[#1A1A1A] placeholder:text-[#D8D3CB] focus:outline-none focus:border-[#C5A85C] transition-colors tracking-[0.4em]"
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-semibold text-red-600 flex items-center gap-1.5"
                    role="alert"
                  >
                    <AlertCircle size={13} className="shrink-0" />
                    {error}
                  </motion.p>
                )}

                <Button type="submit" loading={isLoading} size="lg" variant="gold" className="w-full">
                  Verify &amp; See My Quote
                </Button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={resendOTP}
                    disabled={resendCooldown > 0 || isLoading}
                    className={cn(
                      'text-xs font-semibold flex items-center gap-1.5 mx-auto transition-colors',
                      resendCooldown > 0 ? 'text-[#C0B9B0] cursor-default' : 'text-[#C5A85C] hover:text-[#A08040]'
                    )}
                  >
                    <RefreshCcw size={11} />
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav */}
      <div className="hidden md:flex justify-start mt-10 pt-6 border-t border-[#E8E2D8]">
        <Button variant="secondary" size="lg" onClick={onPrev}>Previous</Button>
      </div>
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E2D8] bg-white/95 backdrop-blur-md px-4 py-3">
        <div className="max-w-lg mx-auto">
          <Button variant="secondary" size="lg" onClick={onPrev} className="w-full">Previous</Button>
        </div>
      </div>
    </motion.div>
  )
}
