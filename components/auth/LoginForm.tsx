'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { toast } from 'sonner'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackError = searchParams.get('error') === 'auth_callback_error'

  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [mobileError, setMobileError] = useState('')
  const [otpError, setOtpError] = useState('')

  const [isSending, setIsSending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [otpSent, setOtpSent] = useState(false)

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
      setMobileError(msg)
      toast.error(msg)
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

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
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

    if (error) {
      setIsVerifying(false)
      let msg = 'Network error'
      if (error.message.toLowerCase().includes('expired')) {
        msg = 'OTP expired'
      } else if (error.message.toLowerCase().includes('invalid') || error.message.toLowerCase().includes('token')) {
        msg = 'Invalid OTP. Please try again.'
      } else if (error.message) {
        msg = error.message
      }
      setOtpError(msg)
      toast.error(msg)
      return
    }

    toast.success('Signed in successfully.')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="space-y-5">
        <AnimatePresence mode="wait">
          {callbackError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-[10px] border-red-200 bg-red-50/50 px-4 py-3.5 flex items-start gap-3 text-sm text-red-700"
              role="alert"
            >
              <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
              <span>Authentication error. Please try again.</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <Label htmlFor="mobile" required variant="dark">
            Mobile Number
          </Label>
          <div className="relative mt-1.5 flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737373] font-medium select-none z-10">
                +91
              </span>
              <Input
                id="mobile"
                type="tel"
                placeholder="Enter 10-digit number"
                className="pl-12"
                value={mobile}
                maxLength={10}
                onChange={(e) => {
                  setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))
                  setMobileError('')
                }}
                disabled={otpSent || isSending}
                variant="dark"
              />
            </div>
          </div>
          {mobileError && (
             <p className="text-xs text-red-500 font-medium mt-1">{mobileError}</p>
          )}
        </div>

        {!otpSent ? (
          <Button
            type="button"
            onClick={handleSendOtp}
            disabled={isSending || mobile.length !== 10}
            loading={isSending}
            className="w-full shadow-sm hover:shadow"
            size="lg"
          >
            {isSending ? 'Sending OTP...' : 'Send OTP'}
          </Button>
        ) : (
          <form onSubmit={handleVerify} className="space-y-5 pt-2 border-t border-[#E8E5E0]">
            <div>
              <Label htmlFor="otp" required variant="dark">
                Enter OTP
              </Label>
              <Input
                id="otp"
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
                disabled={isVerifying}
                variant="dark"
                className="pl-10"
                rightElement={
                  <ShieldCheck className="h-4 w-4 text-[#A8A8A8]" />
                }
              />
              {otpError && (
                <p className="text-xs text-red-500 font-medium mt-1">{otpError}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={otp.length !== 6 || isVerifying}
              loading={isVerifying}
              className="w-full shadow-sm hover:shadow"
              size="lg"
            >
              {isVerifying ? 'Verifying...' : 'Verify & Sign In'}
            </Button>

            <div className="text-center text-sm text-[#737373] mt-4">
              Didn't receive the OTP?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0 || isSending}
                className="text-[#C9A84C] font-semibold hover:underline disabled:opacity-50 disabled:hover:no-underline transition-all"
              >
                {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  )
}
