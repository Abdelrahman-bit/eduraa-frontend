'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCourseById } from '@/app/services/courseService';
import { useParams } from 'next/navigation';
import { CourseDTO, LectureDTO } from '@/app/services/courseService';

const CourseContentPage = () => {
   const params = useParams();
   const courseId = params.courseId as string;

   const { data: course, isLoading } = useQuery<CourseDTO>({
      queryKey: ['course', courseId],
      queryFn: () => getCourseById(courseId),
      enabled: !!courseId,
   });

   const [selectedLecture, setSelectedLecture] = React.useState<
      LectureDTO | undefined
   >(undefined);

   React.useEffect(() => {
      if (course) {
         setSelectedLecture(course.curriculum.sections[0]?.lectures[0]);
      }
   }, [course]);

   if (isLoading) {
      return <div>Loading...</div>;
   }

   if (!course) {
      return <div>Course not found</div>;
   }

   return (
      <div className="flex h-screen">
         <div className="w-1/4 border-r overflow-y-auto">
            <h2 className="text-2xl font-bold p-4">{course.basicInfo.title}</h2>
            {course.curriculum.sections.map((section) => (
               <div key={section.clientId} className="p-4">
                  <h3 className="font-semibold">{section.title}</h3>
                  <ul>
                     {section.lectures.map((lecture) => (
                        <li
                           key={lecture.clientId}
                           className={`p-2 cursor-pointer ${
                              selectedLecture?.clientId === lecture.clientId
                                 ? 'bg-gray-200'
                                 : ''
                           }`}
                           onClick={() => setSelectedLecture(lecture)}
                        >
                           {lecture.title}
                        </li>
                     ))}
                  </ul>
               </div>
            ))}
         </div>
         <div className="w-3/4 p-4">
            {selectedLecture && (
               <div>
                  <h1 className="text-3xl font-bold mb-4">
                     {selectedLecture.title}
                  </h1>
                  {selectedLecture.video?.url ? (
                     <video
                        src={selectedLecture.video.url}
                        controls
                        className="w-full"
                     ></video>
                  ) : (
                     <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                        <p>No video for this lecture</p>
                     </div>
                  )}
                  <div className="mt-4">
                     <h2 className="text-xl font-bold">Description</h2>
                     <p>{selectedLecture.description}</p>
                  </div>
                  <div className="mt-4">
                     <h2 className="text-xl font-bold">Notes</h2>
                     <p>{selectedLecture.notes}</p>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

export default CourseContentPage;
