'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function InstructorRequestItem({ name, email, phone }) {
   return (
      <Card className="w-full p-4 shadow-sm border border-gray-200 rounded-xl  hover:translate-y-1 duration-300 ">
         <CardContent className="flex items-center justify-between p-0">
            {/* Left Section - Instructor Info */}
            <div className="flex flex-col gap-1">
               <h3 className="text-lg font-semibold text-gray-scale-900">
                  {name}
               </h3>
               <p className="text-sm text-gray-scale-600">{email}</p>
               <p className="text-sm text-gray-scale-600">{phone}</p>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-3">
               <Button className="bg-primary-500 hover:bg-primary-600 text-white px-4 rounded-lg cursor-pointer">
                  Approve
               </Button>
               <Button
                  className="bg-gray-scale-900 bg-gray-scale-900 text-white px-4 rounded-lg cursor-pointer"
                  variant="destructive"
               >
                  Reject
               </Button>
            </div>
         </CardContent>
      </Card>
   );
}
