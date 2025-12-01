'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
   getJoinRequests,
   updateJoinRequestStatus,
} from '@/app/services/adminService';
import { Button } from '@/components/ui/button';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { toast } from 'react-hot-toast';
import { CheckCircle, XCircle } from 'lucide-react';

const JoinRequestsTable = () => {
   const queryClient = useQueryClient();

   const { data: joinRequests, isLoading } = useQuery({
      queryKey: ['joinRequests'],
      queryFn: getJoinRequests,
   });

   const mutation = useMutation({
      mutationFn: ({
         id,
         status,
      }: {
         id: string;
         status: 'approved' | 'rejected';
      }) => updateJoinRequestStatus(id, status),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['joinRequests'] });
         toast.success('Request updated successfully');
      },
      onError: () => {
         toast.error('Failed to update request');
      },
   });

   const handleApprove = (id: string) => {
      mutation.mutate({ id, status: 'approved' });
   };

   const handleReject = (id: string) => {
      mutation.mutate({ id, status: 'rejected' });
   };

   if (isLoading) {
      return <div>Loading...</div>;
   }

   return (
      <Table>
         <TableHeader>
            <TableRow>
               <TableHead>Name</TableHead>
               <TableHead>Email</TableHead>
               <TableHead>Phone</TableHead>
               <TableHead>Actions</TableHead>
            </TableRow>
         </TableHeader>
         <TableBody>
            {joinRequests?.map((request) => (
               <TableRow key={request._id}>
                  <TableCell>{request.name}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>{request.phone}</TableCell>
                  <TableCell>
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleApprove(request._id)}
                     >
                        <CheckCircle className="text-green-500" />
                     </Button>
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReject(request._id)}
                     >
                        <XCircle className="text-red-500" />
                     </Button>
                  </TableCell>
               </TableRow>
            ))}
         </TableBody>
      </Table>
   );
};

export default JoinRequestsTable;
