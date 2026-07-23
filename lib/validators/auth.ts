import { z } from 'zod'

export const LoginSchema = z.object({
  phone: z
    .string()
    .regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number')
})

export type LoginFormValues = z.infer<typeof LoginSchema>
