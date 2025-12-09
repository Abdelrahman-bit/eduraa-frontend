import React from 'react';
import { Search } from 'lucide-react';

import InstructorCard, {
   InstructorProps,
} from '@/components/student/InstructorCard';

export default function StudentInstructorsPage() {
   // fetch data from API later
   const instructorsList: InstructorProps[] = [
      {
         id: 1,
         name: 'Wade Warren',
         title: 'Digital Product Designer',
         image: 'https://ui-avatars.com/api/?name=Wade+Warren&background=random&size=400',
      },
      {
         id: 2,
         name: 'Bessie Cooper',
         title: 'Senior Developer',
         image: 'https://ui-avatars.com/api/?name=Bessie+Cooper&background=random&size=400',
      },
      {
         id: 3,
         name: 'Floyd Miles',
         title: 'UI/UX Designer',
         image: 'https://ui-avatars.com/api/?name=Floyd+Miles&background=random&size=400',
      },
      {
         id: 4,
         name: 'Ronald Richards',
         title: 'Lead Developer',
         image: 'https://ui-avatars.com/api/?name=Ronald+Richards&background=random&size=400',
      },
      {
         id: 5,
         name: 'Devon Lane',
         title: 'Senior Developer',
         image: 'https://ui-avatars.com/api/?name=Devon+Lane&background=random&size=400',
      },
      {
         id: 6,
         name: 'Robert Fox',
         title: 'UI/UX Designer',
         image: 'https://ui-avatars.com/api/?name=Robert+Fox&background=random&size=400',
      },
      {
         id: 7,
         name: 'Kathryn Murphy',
         title: 'Adobe Instructor',
         image: 'https://ui-avatars.com/api/?name=Kathryn+Murphy&background=random&size=400',
      },
      {
         id: 8,
         name: 'Jerome Bell',
         title: 'Adobe Instructor',
         image: 'https://ui-avatars.com/api/?name=Jerome+Bell&background=random&size=400',
      },
   ];

   return (
      <div className="space-y-8">
         <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-gray-900">
               Instructors{' '}
               <span className="text-gray-500 font-medium">
                  ({instructorsList.length})
               </span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="relative">
                  <input
                     type="text"
                     placeholder="Search in your teachers..."
                     className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-[#FF6636]"
                  />
                  <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
               </div>

               <select className="px-4 py-3 border border-gray-200 rounded-md bg-white text-gray-600 focus:outline-none cursor-pointer">
                  <option>All Courses</option>
               </select>

               <select className="px-4 py-3 border border-gray-200 rounded-md bg-white text-gray-600 focus:outline-none cursor-pointer">
                  <option>All Teachers</option>
               </select>
            </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {instructorsList.map((instructor) => (
               <InstructorCard key={instructor.id} {...instructor} />
            ))}
         </div>
      </div>
   );
}
