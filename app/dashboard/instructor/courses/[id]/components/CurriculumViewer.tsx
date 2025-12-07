'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, PlayCircle } from 'lucide-react';
import { SectionDTO, LectureDTO } from '@/app/services/courseService';

interface CurriculumViewerProps {
   sections: SectionDTO[];
}

const LectureItem = ({ lecture }: { lecture: LectureDTO }) => (
   <div className="flex items-center gap-3 py-3 px-4 border-b last:border-0 hover:bg-gray-50 bg-white">
      <div className="text-gray-400">
         {lecture.video ? <PlayCircle size={16} /> : <FileText size={16} />}
      </div>
      <div className="flex-1">
         <p className="text-sm font-medium text-gray-800">{lecture.title}</p>
         {lecture.video && lecture.video.duration && (
            <span className="text-xs text-gray-500">
               {(lecture.video.duration / 60).toFixed(2)} min
            </span>
         )}
      </div>
   </div>
);

const SectionItem = ({
   section,
   defaultOpen = false,
}: {
   section: SectionDTO;
   defaultOpen?: boolean;
}) => {
   const [isOpen, setIsOpen] = useState(defaultOpen);

   return (
      <div className="border border-gray-200 rounded-sm mb-3 last:mb-0 overflow-hidden">
         <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
         >
            <div>
               <h4 className="font-semibold text-gray-900 text-left">
                  {section.title}
               </h4>
               <p className="text-xs text-gray-500 text-left mt-0.5">
                  {section.lectures?.length || 0} Lectures
               </p>
            </div>
            {isOpen ? (
               <ChevronUp size={18} className="text-gray-500" />
            ) : (
               <ChevronDown size={18} className="text-gray-500" />
            )}
         </button>

         {isOpen && (
            <div className="border-t border-gray-200">
               {section.lectures && section.lectures.length > 0 ? (
                  section.lectures.map((lecture, idx) => (
                     <LectureItem
                        key={lecture.clientId || idx}
                        lecture={lecture}
                     />
                  ))
               ) : (
                  <div className="p-4 text-sm text-gray-400 text-center italic">
                     No lectures in this section
                  </div>
               )}
            </div>
         )}
      </div>
   );
};

export default function CurriculumViewer({ sections }: CurriculumViewerProps) {
   if (!sections || sections.length === 0) {
      return (
         <div className="text-gray-500 italic">
            No curriculum available yet.
         </div>
      );
   }

   return (
      <div className="bg-white p-6 rounded-sm shadow-sm mt-6">
         <h3 className="font-bold text-gray-900 mb-4 text-lg">Curriculum</h3>
         <div>
            {sections.map((section, idx) => (
               <SectionItem
                  key={section.clientId || idx}
                  section={section}
                  defaultOpen={idx === 0}
               />
            ))}
         </div>
      </div>
   );
}
