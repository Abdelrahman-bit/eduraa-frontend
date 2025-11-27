import z from 'zod';

export const formSchema = z.object({
   name: z.string().min(2, {
      message: 'Name must be at least 2 characters.',
   }),
   email: z.email({
      message: 'Please enter a valid email address.',
   }),
   phoneNumber: z.string().regex(/^01[0125][0-9]{8}$/, {
      message:
         'Please enter a valid Egyptian phone number (e.g., 010xxxxxxxxx)',
   }),
});
