'use client';
import { Button } from '@/components/ui/button';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog';
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';

import { useMutation } from '@tanstack/react-query';
import { formSchema } from '../validation/formSchema';
import { applyForJob } from '@/app/services/instructorService';
export default function RegistrationDialog() {
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         name: '',
         email: '',
         phoneNumber: '',
      },
   });

   const [open, setOpen] = useState(false);
   const { mutate, isPending } = useMutation({
      mutationFn: applyForJob,
      onSuccess: () => {
         setOpen(false);
         form.reset();
         toast.success(
            'Thank you for your request! We will review your application and get back to you soon.',
            {
               style: {
                  fontSize: '14px',
               },
            }
         );
      },
      onError: (error: Error) => {
         toast.error(error.message || 'An error occurred. Please try again.');
      },
   });
   async function onSubmit(values: z.infer<typeof formSchema>) {
      const { phoneNumber, ...rest } = values;
      mutate({ ...rest, phone: phoneNumber });
   }
   return (
      <>
         <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
               <Button className="bg-[#FF6B35] hover:bg-[#e55a2b] text-white px-10 py-7 text-lg font-semibold rounded-md transition-colors cursor-pointer">
                  Register Now
               </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] bg-white text-gray-900 border-none">
               <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                     Become an Instructor
                  </DialogTitle>
                  <DialogDescription className="text-gray-500">
                     Fill out the form below to apply. We'll review your
                     application and get back to you.
                  </DialogDescription>
               </DialogHeader>

               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-5 py-4"
                  >
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className="text-gray-700">
                                 Full Name
                              </FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="Enter your full name"
                                    {...field}
                                    className="bg-gray-50 border-gray-200 focus-visible:ring-[#FF6B35]"
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className="text-gray-700">
                                 Email Address
                              </FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="Enter your email"
                                    type="email"
                                    {...field}
                                    className="bg-gray-50 border-gray-200 focus-visible:ring-[#FF6B35]"
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className="text-gray-700">
                                 Phone Number
                              </FormLabel>
                              <FormControl>
                                 <Input
                                    maxLength={11}
                                    placeholder="e.g., 010xxxxxxxxx"
                                    {...field}
                                    className="bg-gray-50 border-gray-200 focus-visible:ring-[#FF6B35]"
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-[#FF6B35] hover:bg-[#e55a2b] text-white font-semibold py-6 mt-2 text-lg cursor-pointer flex items-center justify-center"
                     >
                        {isPending ? (
                           <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                           </>
                        ) : (
                           'Submit'
                        )}
                     </Button>
                  </form>
               </Form>
            </DialogContent>
         </Dialog>
      </>
   );
}
