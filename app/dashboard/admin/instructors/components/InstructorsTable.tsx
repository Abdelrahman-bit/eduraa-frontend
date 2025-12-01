'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchInstructors } from '@/app/services/adminService';
import { Input } from '@/components/ui/input';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { Instructor } from '@/app/services/adminService';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
   DialogPortal,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const InstructorsTable = () => {
   const [searchQuery, setSearchQuery] = useState('');
   const { data: instructors, isLoading } = useQuery({
      queryKey: ['instructors', searchQuery],
      queryFn: () => searchInstructors(searchQuery),
   });
   const [selectedInstructor, setSelectedInstructor] =
      useState<Instructor | null>(null);

   return (
      <div>
         <Input
            placeholder="Search for instructors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
         />
         {isLoading && <div>Loading...</div>}
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Courses</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {instructors?.map((instructor) => (
                  <TableRow key={instructor._id}>
                     <TableCell>{instructor.name}</TableCell>
                     <TableCell>{instructor.email}</TableCell>
                     <TableCell>
                        <Button
                           variant="outline"
                           onClick={() => setSelectedInstructor(instructor)}
                        >
                           View Courses
                        </Button>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
         {selectedInstructor && (
            <Dialog
               open={!!selectedInstructor}
               onOpenChange={() => setSelectedInstructor(null)}
            >
               <DialogPortal>
                  <DialogContent className="max-w-4xl">
                     <DialogHeader>
                        <DialogTitle>
                           {selectedInstructor.name}'s Courses
                        </DialogTitle>
                        <DialogDescription>
                           A list of courses taught by {selectedInstructor.name}
                           .
                        </DialogDescription>
                     </DialogHeader>
                     <div className="max-h-[60vh] overflow-y-auto p-4">
                        <Table>
                           <TableHeader>
                              <TableRow>
                                 <TableHead>Title</TableHead>
                                 <TableHead>Price</TableHead>
                                 <TableHead>Status</TableHead>
                              </TableRow>
                           </TableHeader>
                           <TableBody>
                              {selectedInstructor.courses.map((course) => (
                                 <TableRow key={course._id}>
                                    <TableCell>
                                       {course.basicInfo?.title}
                                    </TableCell>
                                    <TableCell>
                                       {course.price?.amount}
                                    </TableCell>
                                    <TableCell>{course.status}</TableCell>
                                 </TableRow>
                              ))}
                           </TableBody>
                        </Table>
                     </div>
                  </DialogContent>
               </DialogPortal>
            </Dialog>
         )}
      </div>
   );
};

export default InstructorsTable;
