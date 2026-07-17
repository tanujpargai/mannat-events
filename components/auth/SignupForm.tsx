'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, User, Mail, ShieldAlert, Sparkles, Check, CheckCircle2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { SignupSchema, SignupFormValues } from '@/lib/validators/auth'
import { getAuthCallbackUrl, parseAuthError } from '@/lib/utils/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { cn } from '@/lib/utils/cn'

export function SignupForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      confirm_password: '',
    }
  })

  const passwordValue = watch('password') || ''

  // Password strength logic
  const hasMinLength = passwordValue.length >= 8
  const hasUppercase = /[A-Z]/.test(passwordValue)
  const hasNumber = /[0-9]/.test(passwordValue)

  let strengthScore = 0
  if (passwordValue.length > 0) {
    if (!hasMinLength) {
      strengthScore = 1 // Weak
    } else if (hasUppercase && hasNumber) {
      strengthScore = 3 // Strong
    } else {
      strengthScore = 2 // Medium
    }
  }

  const strengthLabels = ['', 'Weak', 'Medium', 'Strong']
  const strengthColors = [
    'bg-[#E8E5E0]', 
    'bg-red-500', 
    'bg-amber-500', 
    'bg-[#C5A85C]'
  ]

  async function onSubmit(values: SignupFormValues) {
    setServerError(null)
    setIsLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.full_name,
          },
          emailRedirectTo: getAuthCallbackUrl('/login?verified=1'),
        },
      })

      if (error) {
        setServerError(parseAuthError(error.message).message)
        return
      }

      router.push(
        `/verify-email?email=${encodeURIComponent(values.email)}`
      )
    } catch {
      setServerError('Unable to create your account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <div>
          <Label htmlFor="full_name" required variant="dark">
            Full name
          </Label>
          <Input
            id="full_name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            error={errors.full_name?.message}
            disabled={isLoading}
            className="pl-10"
            variant="dark"
            rightElement={<User className="h-4 w-4 text-[#A8A8A8]" />}
            {...register('full_name')}
          />
        </div>

        <div>
          <Label htmlFor="email" required variant="dark">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            disabled={isLoading}
            className="pl-10"
            variant="dark"
            rightElement={<Mail className="h-4 w-4 text-[#A8A8A8]" />}
            {...register('email')}
          />
        </div>

        <div>
          <Label htmlFor="password" required variant="dark">
            Password
          </Label>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            error={errors.password?.message}
            disabled={isLoading}
            className="pl-10 pr-12"
            variant="dark"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#A8A8A8] hover:text-[#1A1A1A] transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            {...register('password')}
          />

          {/* Luxury password strength feedback */}
          {passwordValue.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }} 
              animate={{ opacity: 1, y: 0 }}
              className="mt-2.5 space-y-2"
            >
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                <span className="text-[#737373]">Security Strength</span>
                <span className={cn(
                  strengthScore === 1 && 'text-red-500',
                  strengthScore === 2 && 'text-amber-500',
                  strengthScore === 3 && 'text-[#C5A85C]'
                )}>
                  {strengthLabels[strengthScore]}
                </span>
              </div>
              
              <div className="flex gap-1 h-1 w-full bg-[#E8E5E0] rounded-full overflow-hidden">
                <div className={cn('h-full transition-all duration-300 rounded-full', strengthColors[strengthScore])} style={{ width: `${(strengthScore / 3) * 100}%` }} />
              </div>

              {/* Requirement Checkpoints */}
              <div className="grid grid-cols-3 gap-2 pt-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#A8A8A8]">
                <span className={cn('flex items-center gap-1 transition-colors', hasMinLength ? 'text-[#C5A85C]' : '')}>
                  {hasMinLength ? <Check size={8} className="stroke-[3]" /> : '•'} 8+ Chars
                </span>
                <span className={cn('flex items-center gap-1 transition-colors', hasUppercase ? 'text-[#C5A85C]' : '')}>
                  {hasUppercase ? <Check size={8} className="stroke-[3]" /> : '•'} Uppercase
                </span>
                <span className={cn('flex items-center gap-1 transition-colors', hasNumber ? 'text-[#C5A85C]' : '')}>
                  {hasNumber ? <Check size={8} className="stroke-[3]" /> : '•'} Number
                </span>
              </div>
            </motion.div>
          )}
        </div>

        <div>
          <Label htmlFor="confirm_password" required variant="dark">
            Confirm password
          </Label>
          <Input
            id="confirm_password"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Repeat your password"
            error={errors.confirm_password?.message}
            disabled={isLoading}
            className="pl-10 pr-12"
            variant="dark"
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-[#A8A8A8] hover:text-[#1A1A1A] transition-colors focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            {...register('confirm_password')}
          />
        </div>

        {/* Terms & Conditions Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              className={cn(
                "rounded-md border-[#E8E5E0] text-[#C9A84C] focus:ring-[#C9A84C] h-4 w-4 mt-0.5 accent-[#C9A84C]",
                errors.accept_terms && "border-red-400"
              )}
              {...register('accept_terms')}
            />
            <span className="text-xs font-semibold text-[#737373] group-hover:text-[#1A1A1A] transition-colors select-none leading-normal">
              I accept the{' '}
              <Link href="#" className="font-bold text-[#1A1A1A] hover:underline underline-offset-2">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="#" className="font-bold text-[#1A1A1A] hover:underline underline-offset-2">
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.accept_terms && (
            <p className="mt-1 text-xs text-red-600" role="alert">
              {errors.accept_terms.message}
            </p>
          )}
        </div>

        <AnimatePresence>
          {serverError && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-semibold text-red-600 flex items-center gap-1.5"
              role="alert"
            >
              <AlertCircle size={14} className="shrink-0" />
              {serverError}
            </motion.p>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          loading={isLoading}
          className="w-full shadow-sm hover:shadow"
          size="lg"
        >
          Create Account
        </Button>

        <p className="text-center text-xs text-[#737373] font-medium pt-2">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-bold text-[#1A1A1A] hover:text-[#C9A84C] transition-colors underline underline-offset-2"
          >
            Sign in
          </Link>
        </p>
      </form>
    </motion.div>
  )
}
