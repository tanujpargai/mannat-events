'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { BookingFormData } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle2, Phone, ShieldCheck } from 'lucide-react'

interface Props {
  data: BookingFormData
  onPrev: () => void
  onSubmit: () => void
  isSubmitting: boolean
}

const RESEND_COOLDOWN = 60 // seconds

export function StepMobileVerification({ data, onPrev, onSubmit, isSubmitting }: Props) {
  const [mobile, setMobile] = useState(data.phone ?? '')
  const [otp, setOtp] = useState('')

  const [isSending, setIsSending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  const [otpSent, setOtpSent] = useState(false)
  const [verified, setVerified] = useState(false)

  const [mobileError, setMobileError] = useState('')
  const [otpError, setOtpError] = useState('')

  // Resend countdown
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const supabase = createClient()

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  function startCountdown() {
    setCountdown(30)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  function formatPhone(raw: string): string {
    const digits = raw.replace(/\D/g, '')
    // Already has country code
    if (digits.startsWith('91') && digits.length === 12) return `+${digits}`
    return `+91${digits}`
  }

  async function handleSendOtp() {
    const digits = mobile.replace(/\D/g, '')
    if (!/^\d{10}$/.test(digits)) {
      setMobileError('Invalid phone number')
      return
    }
    setMobileError('')
    setIsSending(true)

    const phone = formatPhone(digits)

    const { error } = await supabase.auth.signInWithOtp({ 
      phone,
      options: { channel: 'sms' }
    })

    setIsSending(false)

    if (error) {
      let msg = 'Network error'
      if (error.message.toLowerCase().includes('rate')) {
        msg = 'Too many requests'
      } else if (error.message) {
        msg = error.message
      }
      toast.error(msg)
      setMobileError(msg)
      return
    }

    setOtpSent(true)
    startCountdown()
    toast.success('OTP has been sent successfully.')
  }

  async function handleResend() {
    if (countdown > 0) return
    await handleSendOtp()
  }

  async function handleVerify() {
    if (!otp || otp.length !== 6) {
      setOtpError('Invalid OTP. Please try again.')
      return
    }
    setOtpError('')
    setIsVerifying(true)

    const phone = formatPhone(mobile.replace(/\D/g, ''))

    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms',
    })

    setIsVerifying(false)

    if (error) {
      let msg = 'Network error'
      if (error.message.toLowerCase().includes('expired')) {
        msg = 'OTP expired'
      } else if (error.message.toLowerCase().includes('invalid') || error.message.toLowerCase().includes('token')) {
        msg = 'Invalid OTP. Please try again.'
      } else if (error.message) {
        msg = error.message
      }
      toast.error(msg)
      setOtpError(msg)
      return
    }

    setVerified(true)
    toast.success('Phone number verified successfully.')
    // Delay to let the user see the green success message before auto-advancing
    setTimeout(() => {
      onSubmit()
    }, 1200)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="pb-28 md:pb-0"
    >
      <div className="mb-6 flex items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-[#F5EDD6] border border-[#E8D9A8] text-xs font-bold tracking-widest text-[#A08040] uppercase">
          Step 5
        </span>
      </div>

      <h2 className="text-headline mb-3">Mobile Verification</h2>
      <p className="text-body text-[#737373] mb-8">
        Please verify your mobile number to view prices and complete your booking request.
      </p>

      <div className="space-y-6 max-w-md">

        {/* ── Mobile Input ── */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-[#1A1A1A] flex items-center gap-1.5">
            <Phone size={14} className="text-[#C5A85C]" /> Mobile Number
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737373] font-medium select-none">+91</span>
              <Input
                type="tel"
                placeholder="Enter 10-digit number"
                className="pl-12"
                value={mobile}
                maxLength={10}
                onChange={(e) => {
                  setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))
                  setMobileError('')
                }}
                disabled={otpSent || isSending || verified}
              />
            </div>
            {!otpSent ? (
              <Button
                type="button"
                onClick={handleSendOtp}
                disabled={isSending || verified || mobile.length !== 10}
                className="whitespace-nowrap sm:w-auto w-full"
              >
                {isSending ? 'Sending...' : 'Send OTP'}
              </Button>
            ) : (
              <Button
                type="button"
                disabled
                className="whitespace-nowrap sm:w-auto w-full opacity-70"
              >
                OTP Sent
              </Button>
            )}
          </div>
          {mobileError && (
            <p className="text-xs text-red-600 font-medium mt-1" role="alert">{mobileError}</p>
          )}
        </div>

        {/* ── OTP Input (revealed after send) ── */}
        {otpSent && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-1.5 overflow-hidden"
          >
            <label className="text-sm font-semibold text-[#1A1A1A] flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#C5A85C]" /> Enter OTP
            </label>
            <Input
              type="text"
              inputMode="numeric"
              pattern="\d*"
              placeholder="6-digit OTP"
              value={otp}
              maxLength={6}
              autoFocus
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                setOtpError('')
              }}
              disabled={verified || isVerifying}
            />
            {otpError && (
              <p className="text-xs text-red-600 font-medium mt-1" role="alert">{otpError}</p>
            )}
            
            {/* Verify Button & Resend below input */}
            {!verified && (
              <div className="pt-3 flex flex-col gap-3">
                <Button
                  type="button"
                  onClick={handleVerify}
                  disabled={otp.length !== 6 || isVerifying}
                  variant="gold"
                  className="w-full"
                >
                  {isVerifying ? 'Verifying...' : 'Verify OTP'}
                </Button>

                <div className="text-center text-sm text-[#737373]">
                  Didn't receive the OTP?{' '}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={countdown > 0 || isSending}
                    className="text-[#C5A85C] font-semibold hover:underline disabled:opacity-50 disabled:hover:no-underline transition-all"
                  >
                    {countdown > 0 ? `Resend OTP (available after ${countdown}s)` : 'Resend OTP'}
                  </button>
                </div>
              </div>
            )}
            
            {verified && (
              <p className="text-sm text-emerald-600 font-semibold pt-2 flex items-center gap-1.5">
                <CheckCircle2 size={16} />
                Phone number verified successfully.
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* ── Desktop Nav ── */}
      <div className="hidden md:flex justify-between mt-10 pt-6 border-t border-[#E8E2D8]">
        <Button variant="secondary" size="lg" onClick={onPrev} disabled={isVerifying || isSending || isSubmitting}>
          Previous
        </Button>
        <Button
           size="lg"
           onClick={onSubmit}
           disabled={!verified || isSubmitting}
        >
           Next Step
        </Button>
      </div>

      {/* ── Mobile Nav ── */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E2D8] bg-white/95 backdrop-blur-md px-4 py-3">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button
            variant="secondary"
            size="lg"
            onClick={onPrev}
            disabled={isVerifying || isSending || isSubmitting}
            className="flex-1"
          >
            Previous
          </Button>
          <Button
            size="lg"
            onClick={onSubmit}
            disabled={!verified || isSubmitting}
            className="flex-1"
          >
            Next Step
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
