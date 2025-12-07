'use client';
import { Upload } from 'lucide-react';

interface PhotoUploadProps {
   currentAvatar?: string;
}

export const PhotoUpload = ({ currentAvatar }: PhotoUploadProps) => {
   // Logic for photo upload would go here

   return (
      <div className="w-full lg:w-[280px] shrink-0">
         <div className="bg-gray-50 border border-dashed border-gray-300 rounded-sm p-6 flex flex-col items-center justify-center text-center h-[320px] relative overflow-hidden group">
            <div className="w-32 h-32 bg-gray-200 mb-4 overflow-hidden relative rounded-full">
               {' '}
               {/* Rounded optional based on preference, currently square in original */}
               <img
                  src={currentAvatar || '/api/placeholder/150/150'}
                  alt="User"
                  className="w-full h-full object-cover"
               />
            </div>
            <button
               type="button"
               className="flex items-center gap-2 bg-white border border-gray-200 hover:border-orange-500 hover:text-orange-500 text-gray-700 px-4 py-2 rounded-sm text-xs font-semibold transition-all shadow-sm z-10"
            >
               <Upload size={14} /> Upload Photo
            </button>
            <p className="text-[10px] text-gray-400 mt-3 max-w-[150px] leading-relaxed">
               Image size should be under 1MB and image ratio needs to be 1:1
            </p>
         </div>
      </div>
   );
};
