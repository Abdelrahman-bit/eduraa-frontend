import InstructorRequestItem from '@/app/components/dashboard/InstructorRequestItem';

export default function InstructorRequestsPage() {
   return (
      <div className="w-full flex flex-col gap-6">
         <h1 className="text-2xl font-bold text-gray-900">
            Instructor Requests
         </h1>

         <InstructorRequestItem
            name="Ahmed Ali"
            email="ahmed@example.com"
            phone="01023456789"
         />

         <InstructorRequestItem
            name="Ahmed Ali"
            email="ahmed@example.com"
            phone="01023456789"
         />
      </div>
   );
}
