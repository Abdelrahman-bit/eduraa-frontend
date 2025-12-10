/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { use, useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
   fetchCourseById,
   getCourseProgress,
   updateLectureProgress,
   Lecture,
   Section,
} from '@/app/services/courses';
import {
   ChevronDown,
   ChevronRight,
   Play,
   Clock,
   ArrowLeft,
   FileText,
   MessageSquare,
   Paperclip,
} from 'lucide-react';
import Link from 'next/link';

export default function WatchCoursePage({
   params,
}: {
   params: Promise<{ courseId: string }>;
}) {
   const { courseId } = use(params);
   const queryClient = useQueryClient();
   const [openSection, setOpenSection] = useState<string | null>(null);
   const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
   const [activeTab, setActiveTab] = useState<
      'description' | 'notes' | 'attachments' | 'comments'
   >('description');
   const [completedLectures, setCompletedLectures] = useState<string[]>([]);

   const [videoTime, setVideoTime] = useState<number>(0);
   const videoRef = useRef<HTMLVideoElement>(null);

   // Fetch course details
   const { data, isLoading } = useQuery({
      queryKey: ['watchCourse', courseId],
      queryFn: () => fetchCourseById(courseId),
   });

   // Fetch progress (API)
   const { data: progressData } = useQuery({
      queryKey: ['courseProgress', courseId],
      queryFn: () => getCourseProgress(courseId),
      enabled: !!courseId,
   });

   // Update progress mutation
   const updateProgressMutation = useMutation({
      mutationFn: ({
         lectureId,
         completed,
      }: {
         lectureId: string;
         completed: boolean;
      }) => updateLectureProgress(courseId, lectureId, completed),
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: ['courseProgress', courseId],
         });
      },
   });

   const course = data?.data;

   // Load state from LocalStorage on mount
   // Load state from LocalStorage on mount
   useEffect(() => {
      if (typeof window !== 'undefined') {
         const storedCompleted = localStorage.getItem(
            `course_${courseId}_completed`
         );
         if (storedCompleted) {
            try {
               const parsedCalls = JSON.parse(storedCompleted);
               setCompletedLectures((prev) => {
                  // Avoid re-render if the value is the same
                  if (JSON.stringify(prev) === storedCompleted) {
                     return prev;
                  }
                  return parsedCalls;
               });
            } catch (error) {
               console.error('Error parsing completed lectures', error);
            }
         }
      }
   }, [courseId]);

   // Sync API progress with LocalStorage
   useEffect(() => {
      if (progressData?.completedLectures) {
         setCompletedLectures((prev) => {
            const combined = Array.from(
               new Set([...prev, ...progressData.completedLectures])
            );
            localStorage.setItem(
               `course_${courseId}_completed`,
               JSON.stringify(combined)
            );
            return combined;
         });
      }
   }, [progressData, courseId]);

   // Initialize Current Lecture (Priority: LocalStorage > First Lecture)
   useEffect(() => {
      if (!course?.curriculum?.sections || currentLecture) return;

      const storedLectureId =
         typeof window !== 'undefined'
            ? localStorage.getItem(`course_${courseId}_last_lecture`)
            : null;

      let foundLecture: Lecture | null = null;
      let foundSectionId: string | null = null;

      if (storedLectureId) {
         for (const section of course.curriculum.sections) {
            const lecture = section.lectures?.find(
               (l: Lecture) => l.clientId === storedLectureId
            );
            if (lecture) {
               foundLecture = lecture;
               foundSectionId = section.clientId;
               break;
            }
         }
      }

      if (!foundLecture && course.curriculum.sections.length > 0) {
         const firstSection = course.curriculum.sections[0];
         if (firstSection.lectures?.length > 0) {
            foundLecture = firstSection.lectures[0];
            foundSectionId = firstSection.clientId;
         }
      }

      if (foundLecture) {
         // eslint-disable-next-line react-hooks/set-state-in-effect
         setCurrentLecture(foundLecture);
         setOpenSection(foundSectionId);
      }
   }, [course, currentLecture, courseId]);

   // Save State changes for current lecture
   useEffect(() => {
      if (currentLecture?.clientId) {
         localStorage.setItem(
            `course_${courseId}_last_lecture`,
            currentLecture.clientId
         );

         const savedTime = localStorage.getItem(
            `course_${courseId}_lecture_${currentLecture.clientId}_time`
         );
         if (savedTime) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setVideoTime(parseFloat(savedTime));
         } else {
            setVideoTime(0);
         }
      }
   }, [currentLecture, courseId]);

   const toggleSection = (sectionId: string) => {
      setOpenSection((prev) => (prev === sectionId ? null : sectionId));
   };

   const formatDuration = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${String(secs).padStart(2, '0')}`;
   };

   const getTotalStats = () => {
      const sections = course?.curriculum?.sections || [];
      const totalLectures = sections.reduce(
         (acc: number, section: Section) =>
            acc + (section.lectures?.length || 0),
         0
      );
      const totalDuration = sections.reduce((acc: number, section: Section) => {
         const sectionDuration =
            section.lectures?.reduce(
               (sum: number, lecture: Lecture) =>
                  sum + (lecture.video?.duration || 0),
               0
            ) || 0;
         return acc + sectionDuration;
      }, 0);
      return { totalLectures, totalDuration };
   };

   const isLectureCompleted = (lectureId: string) => {
      return completedLectures.includes(lectureId);
   };

   const toggleLectureComplete = (lectureId: string) => {
      const isCompleted = isLectureCompleted(lectureId);
      const newCompleted = isCompleted
         ? completedLectures.filter((id) => id !== lectureId)
         : [...completedLectures, lectureId];

      setCompletedLectures(newCompleted);
      localStorage.setItem(
         `course_${courseId}_completed`,
         JSON.stringify(newCompleted)
      );
      updateProgressMutation.mutate({ lectureId, completed: !isCompleted });
   };

   const getProgressPercentage = () => {
      const { totalLectures } = getTotalStats();
      if (totalLectures === 0) return 0;
      return Math.round((completedLectures.length / totalLectures) * 100);
   };

   const handleVideoTimeUpdate = (
      e: React.SyntheticEvent<HTMLVideoElement>
   ) => {
      const time = e.currentTarget.currentTime;
      if (currentLecture?.clientId) {
         // Save time every 5 seconds to avoid performance hit
         if (Math.floor(time) % 5 === 0) {
            localStorage.setItem(
               `course_${courseId}_lecture_${currentLecture.clientId}_time`,
               time.toString()
            );
         }
      }
   };

   const playNextLecture = () => {
      if (!course || !currentLecture) return;

      let foundCurrent = false;
      let nextLecture: Lecture | null = null;
      let nextSectionId: string | null = null;

      // Iterate to find the next lecture
      const sections = course.curriculum?.sections || [];
      for (const section of sections) {
         if (foundCurrent && nextLecture) break; // Found it

         for (const lecture of section.lectures) {
            if (foundCurrent) {
               nextLecture = lecture;
               nextSectionId = section.clientId;
               break;
            }
            if (lecture.clientId === currentLecture.clientId) {
               foundCurrent = true;
            }
         }
      }

      if (nextLecture) {
         setCurrentLecture(nextLecture);
         setOpenSection(nextSectionId); // Ensure section is open
      }
   };

   const handleVideoEnd = () => {
      if (currentLecture?.clientId) {
         if (!isLectureCompleted(currentLecture.clientId)) {
            toggleLectureComplete(currentLecture.clientId);
         }
         // Auto play next video
         playNextLecture();
      }
   };

   if (isLoading) {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            Loading...
         </div>
      );
   }

   if (!course) {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            Course not found
         </div>
      );
   }

   const { totalLectures, totalDuration } = getTotalStats();
   const totalHours = Math.floor(totalDuration / 3600);
   const totalMinutes = Math.floor((totalDuration % 3600) / 60);

   return (
      <div className="min-h-screen bg-gray-50">
         {/* Top Header */}
         <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="max-w-[1800px] mx-auto flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <Link
                     href="/my-courses"
                     className="text-gray-600 hover:text-gray-900"
                  >
                     <ArrowLeft className="w-5 h-5" />
                  </Link>
                  <div>
                     <h1 className="text-lg font-semibold text-gray-900">
                        {course.basicInfo.title}
                     </h1>
                     <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                           <FileText className="w-4 h-4" />
                           {course.curriculum?.sections?.length || 0} Sections
                        </span>
                        <span className="flex items-center gap-1">
                           <Play className="w-4 h-4" />
                           {totalLectures} lectures
                        </span>
                        <span className="flex items-center gap-1">
                           <Clock className="w-4 h-4" />
                           {totalHours}h {totalMinutes}m
                        </span>
                     </div>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <button className="px-4 py-2 text-orange-500 border border-orange-500 rounded hover:bg-orange-50 transition-colors">
                     Write A Review
                  </button>
                  <button
                     onClick={playNextLecture}
                     className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                  >
                     Next Lecture
                  </button>
               </div>
            </div>
         </div>

         {/* Main Content */}
         <div className="max-w-[1800px] mx-auto flex gap-6 p-6">
            {/* Left Side - Video & Details */}
            <div className="flex-1">
               {/* Video Player */}
               <div className="bg-black rounded-lg overflow-hidden mb-6">
                  <div className="aspect-video">
                     {currentLecture?.video?.url ? (
                        <video
                           ref={videoRef}
                           key={currentLecture.clientId}
                           controls
                           className="w-full h-full"
                           src={currentLecture.video.url}
                           onEnded={handleVideoEnd}
                           onTimeUpdate={handleVideoTimeUpdate}
                           onLoadedMetadata={() => {
                              if (videoRef.current && videoTime > 0) {
                                 videoRef.current.currentTime = videoTime;
                              }
                           }}
                        >
                           Your browser does not support the video tag.
                        </video>
                     ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-900">
                           <Play className="w-16 h-16 text-gray-600" />
                        </div>
                     )}
                  </div>
               </div>

               {/* Lecture Title & Info */}
               <div className="bg-white rounded-lg p-6 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                     {currentLecture?.title || 'Select a lecture'}
                  </h2>
                  <div className="flex items-center gap-4 mb-4">
                     <div className="flex items-center -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                           <div
                              key={i}
                              className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"
                           ></div>
                        ))}
                     </div>
                     <span className="text-sm text-gray-600">
                        512 students watching
                     </span>
                     <span className="text-sm text-gray-600">
                        Last updated: Oct 20, 2020
                     </span>
                     <span className="text-sm text-gray-600 flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        Comments: 154
                     </span>
                  </div>

                  {/* Tabs */}
                  <div className="border-b border-gray-200 mb-6">
                     <div className="flex gap-8">
                        {[
                           { id: 'description', label: 'Description' },
                           { id: 'notes', label: 'Lectures Notes' },
                           {
                              id: 'attachments',
                              label: 'Attach File',
                              badge: '01',
                           },
                           { id: 'comments', label: 'Comments' },
                        ].map((tab) => (
                           <button
                              key={tab.id}
                              onClick={() =>
                                 setActiveTab(
                                    tab.id as
                                       | 'description'
                                       | 'notes'
                                       | 'attachments'
                                       | 'comments'
                                 )
                              }
                              className={`pb-3 text-sm font-medium transition-colors relative ${
                                 activeTab === tab.id
                                    ? 'text-gray-900 border-b-2 border-orange-500'
                                    : 'text-gray-600 hover:text-gray-900'
                              }`}
                           >
                              {tab.label}
                              {tab.badge && (
                                 <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded">
                                    {tab.badge}
                                 </span>
                              )}
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* Tab Content */}
                  <div className="text-gray-700">
                     {activeTab === 'description' && (
                        <div>
                           <h3 className="font-bold text-lg mb-3">
                              Lectures Description
                           </h3>
                           <p className="leading-relaxed">
                              {currentLecture?.description ||
                                 course.advancedInfo.description}
                           </p>
                        </div>
                     )}
                     {activeTab === 'notes' && (
                        <div>
                           <h3 className="font-bold text-lg mb-3">
                              Lecture Notes
                           </h3>
                           <p className="leading-relaxed">
                              {currentLecture?.notes ||
                                 'No notes available for this lecture.'}
                           </p>
                        </div>
                     )}
                     {activeTab === 'attachments' && (
                        <div>
                           <h3 className="font-bold text-lg mb-3">
                              Attachments
                           </h3>
                           {(currentLecture?.attachments?.length ?? 0) > 0 ? (
                              <div className="space-y-2">
                                 {currentLecture?.attachments?.map(
                                    (attachment, index: number) => (
                                       <a
                                          key={index}
                                          href={attachment.file.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-2 text-orange-500 hover:text-orange-600"
                                       >
                                          <Paperclip className="w-4 h-4" />
                                          {attachment.title}
                                       </a>
                                    )
                                 )}
                              </div>
                           ) : (
                              <p className="text-gray-500">
                                 No attachments available.
                              </p>
                           )}
                        </div>
                     )}
                     {activeTab === 'comments' && (
                        <div>
                           <h3 className="font-bold text-lg mb-3">Comments</h3>
                           <p className="text-gray-500">No comments yet.</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Right Side - Course Contents */}
            <div className="w-[400px]">
               <div className="bg-white rounded-lg overflow-hidden sticky top-6">
                  <div className="p-6 border-b border-gray-200">
                     <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                           Course Contents
                        </h3>
                        <span className="text-sm text-green-600 font-medium">
                           {getProgressPercentage()}% Completed
                        </span>
                     </div>
                  </div>

                  <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                     {course.curriculum?.sections?.map((section: Section) => {
                        const isOpen = openSection === section.clientId;
                        const sectionDuration =
                           section.lectures?.reduce(
                              (acc: number, lecture) =>
                                 acc + (lecture.video?.duration || 0),
                              0
                           ) || 0;
                        const sectionCompletedCount =
                           section.lectures?.filter((l) =>
                              isLectureCompleted(l.clientId)
                           ).length || 0;

                        return (
                           <div
                              key={section.clientId}
                              className="border-b border-gray-100"
                           >
                              <button
                                 onClick={() => toggleSection(section.clientId)}
                                 className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                              >
                                 <div className="flex items-center gap-3 flex-1 text-left">
                                    {isOpen ? (
                                       <ChevronDown className="w-4 h-4 text-orange-500" />
                                    ) : (
                                       <ChevronRight className="w-4 h-4 text-gray-400" />
                                    )}
                                    <span className="font-medium text-gray-900 text-sm">
                                       {section.title}
                                    </span>
                                 </div>
                                 <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                       <Play className="w-3 h-3" />
                                       {section.lectures?.length || 0} lectures
                                    </span>
                                    <span className="flex items-center gap-1">
                                       <Clock className="w-3 h-3" />
                                       {Math.floor(sectionDuration / 60)}m
                                    </span>
                                    <span className="text-orange-500">
                                       {Math.round(
                                          (sectionCompletedCount /
                                             (section.lectures?.length || 1)) *
                                             100
                                       )}
                                       % finish
                                    </span>
                                 </div>
                              </button>

                              {isOpen && (
                                 <div className="bg-gray-50">
                                    {section.lectures?.map(
                                       (
                                          lecture: Lecture,
                                          lectureIndex: number
                                       ) => {
                                          const isActive =
                                             currentLecture?.clientId ===
                                             lecture.clientId;
                                          const isCompleted =
                                             isLectureCompleted(
                                                lecture.clientId
                                             );

                                          return (
                                             <div
                                                key={lecture.clientId}
                                                role="button"
                                                tabIndex={0}
                                                onClick={() =>
                                                   lecture.video?.url &&
                                                   setCurrentLecture(lecture)
                                                }
                                                className={`w-full flex items-center justify-between p-3 pl-12 hover:bg-white transition-colors cursor-pointer ${
                                                   isActive
                                                      ? 'bg-orange-50'
                                                      : ''
                                                }`}
                                             >
                                                <div className="flex items-center gap-3 flex-1 text-left">
                                                   <button
                                                      onClick={(e) => {
                                                         e.stopPropagation();
                                                         toggleLectureComplete(
                                                            lecture.clientId
                                                         );
                                                      }}
                                                      className="w-5 h-5 flex items-center justify-center hover:scale-110 transition-transform"
                                                   >
                                                      {isCompleted ? (
                                                         <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                                                            <svg
                                                               className="w-3 h-3 text-white"
                                                               fill="none"
                                                               viewBox="0 0 24 24"
                                                               stroke="currentColor"
                                                               strokeWidth={3}
                                                            >
                                                               <path
                                                                  strokeLinecap="round"
                                                                  strokeLinejoin="round"
                                                                  d="M5 13l4 4L19 7"
                                                               />
                                                            </svg>
                                                         </div>
                                                      ) : (
                                                         <div className="w-5 h-5 border-2 border-gray-300 rounded-full hover:border-orange-500 transition-colors"></div>
                                                      )}
                                                   </button>
                                                   <span
                                                      className={`text-sm ${isActive ? 'text-orange-500 font-medium' : 'text-gray-700'}`}
                                                   >
                                                      {lectureIndex + 1}.{' '}
                                                      {lecture.title}
                                                   </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                   {isActive && (
                                                      <div className="flex items-center gap-1 text-xs text-gray-600">
                                                         <div className="w-1 h-1 bg-gray-600"></div>
                                                         <div className="w-1 h-1 bg-gray-600"></div>
                                                      </div>
                                                   )}
                                                   <span className="text-xs text-gray-500">
                                                      {lecture.video?.duration
                                                         ? formatDuration(
                                                              lecture.video
                                                                 .duration
                                                           )
                                                         : '00:00'}
                                                   </span>
                                                </div>
                                             </div>
                                          );
                                       }
                                    )}
                                 </div>
                              )}
                           </div>
                        );
                     })}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
