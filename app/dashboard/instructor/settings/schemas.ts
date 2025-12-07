import * as z from 'zod';

// --- Account Schema ---
export const accountSchema = z.object({
   firstName: z.string().min(1, 'First name is required'),
   lastName: z.string().min(1, 'Last name is required'),
   // username field removed
   phoneCode: z.string(),
   phoneNumber: z
      .string()
      .regex(/^\d+$/, 'Phone must be numbers only')
      .min(8, 'Phone is too short'),
   title: z.string().max(50, 'Title must be less than 50 chars').optional(),
   biography: z.string().optional(),
});

export type AccountFormValues = z.infer<typeof accountSchema>;

// --- Password Schema ---
export const passwordSchema = z
   .object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z
         .string()
         .min(8, 'Password must be at least 8 characters')
         .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
         .regex(/[0-9]/, 'Must contain at least one number'),
      confirmPassword: z.string().min(1, 'Please confirm your password'),
   })
   .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
   });

export type PasswordFormValues = z.infer<typeof passwordSchema>;
