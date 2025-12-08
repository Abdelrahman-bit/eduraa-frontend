import React from 'react';
import Link from 'next/link';

export interface InstructorProps {
   id: number | string;
   name: string;
   title: string;
   image: string;
}

const InstructorCard = ({ id, name, title, image }: InstructorProps) => {
   return (
      <div className="bg-white border border-gray-100 rounded-lg p-4 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300 h-full">
         <div className="relative w-full aspect-[3/4] mb-4 rounded-lg overflow-hidden bg-gray-100">
            <img
               src={image}
               alt={name}
               className="w-full h-full object-cover"
            />
         </div>

         <h3 className="text-lg font-bold text-[#1D2026] mb-1">{name}</h3>
         <p className="text-[#8C94A3] text-sm mb-6">{title}</p>

         <div className="w-full mt-auto flex gap-3">
            <Link
               href={`/student/instructorProfile/${id}`}
               className="flex-1 bg-[#FF6636] text-white py-3 rounded-md font-semibold text-sm hover:bg-[#fa8662] transition-colors duration-300 flex items-center justify-center"
            >
               Profile
            </Link>

            <button className="flex-1 bg-[#FFEEE8] text-[#FF6636] py-3 rounded-md font-semibold text-sm hover:bg-[#FF6636] hover:text-white transition-colors duration-300">
               Message
            </button>
         </div>
      </div>
   );
};

export default InstructorCard;
