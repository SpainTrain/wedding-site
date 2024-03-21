import { z } from 'zod'

export const Claims = z.object({
  admin: z.boolean().optional(),
})

export const AppUser = z.object({
  id: z.string(),
  email: z.string().email(),
  mobile: z.string().optional(),
  photoURL: z.string().url().optional(),
  displayName: z.string().optional(),
  token: z.string(),
  claims: Claims,
})
