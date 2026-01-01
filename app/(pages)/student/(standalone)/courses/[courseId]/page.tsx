/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { use, useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
   fetchCourseById,
   getCourseProgress,
   updateLectureProgress,
   checkEnrollment,
   Lecture,
   Section,
} from '@/app/services/courses';
import { useRouter } from 'next/navigation'; // Import useRouter
import RouteGuard from '@/app/components/auth/RouteGuard'; // Import RouteGuard
import {
   CheckCircle,
   ChevronDown,
   ChevronRight,
   Play,
   Clock,
   ArrowLeft,
   FileText,
   MessageSquare,
   Paperclip,
   Menu,
   X,
   ChevronLeft,
} from 'lucide-react';
import Link from 'next/link';
import { RatingForm } from '@/app/components/student/RatingForm';
import { getMyRating } from '@/app/services/ratingService';
import { Star } from 'lucide-react';

export default function WatchCoursePage({
   params,
}: {
   params: Promise<{ courseId: string }>;
}) {
   const { courseId } = use(params);
   const queryClient = useQueryClient();
   const router = useRouter(); // Initialize router
   const [openSections, setOpenSections] = useState<string[]>([]); // Changed to array
   const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
   const [activeTab, setActiveTab] = useState<
      'description' | 'notes' | 'attachments' | 'comments'
   >('description');
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [completedLectures, setCompletedLectures] = useState<string[]>([]);
   const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null); // State for enrollment status

   const [videoTime, setVideoTime] = useState<number>(0);
   const videoRef = useRef<HTMLVideoElement>(null);
   const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

   // Check Enrollment on Mount
   useEffect(() => {
      const verifyEnrollment = async () => {
         try {
            const enrolled = await checkEnrollment(courseId);
            if (!enrolled) {
               // Redirect to public course page if not enrolled
               router.replace(`/all-courses/${courseId}`);
            } else {
               setIsEnrolled(true);
            }
         } catch (error) {
            console.error('Enrollment check failed:', error);
            router.replace(`/all-courses/${courseId}`);
         }
      };
      if (courseId) {
         verifyEnrollment();
      }
   }, [courseId, router]);

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

   // Fetch student's own rating for this course
   const { data: myRating, refetch: refetchMyRating } = useQuery({
      queryKey: ['myRating', courseId],
      queryFn: () => getMyRating(courseId),
      enabled: !!courseId && isEnrolled === true,
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

   // Sync API progress to state
   useEffect(() => {
      if (progressData?.data) {
         const enrollment = progressData.data;
         // completedLectures is now array of objects { lectureId, completedAt }
         if (enrollment.completedLectures) {
            const completedIds = enrollment.completedLectures.map(
               (l: any) => l.lectureId
            );
            setCompletedLectures(completedIds);
         }
      }
   }, [progressData]);

   // Initialize Current Lecture
   useEffect(() => {
      if (!course?.curriculum?.sections || currentLecture) return;

      // Logic to find first uncompleted lecture, or default to first lecture
      let firstLecture: Lecture | null = null;
      let firstSectionId: string | null = null;

      if (course.curriculum.sections.length > 0) {
         const firstSection = course.curriculum.sections[0];
         if (firstSection.lectures?.length > 0) {
            firstLecture = firstSection.lectures[0];
            firstSectionId = firstSection.clientId;
         }
      }

      if (firstLecture) {
         // eslint-disable-next-line react-hooks/set-state-in-effect
         setCurrentLecture(firstLecture);
         if (firstSectionId) {
            setOpenSections((prev) =>
               prev.includes(firstSectionId!)
                  ? prev
                  : [...prev, firstSectionId!]
            );
         }
      }
   }, [course, currentLecture]);

   const toggleSection = (sectionId: string) => {
      setOpenSections((prev) =>
         prev.includes(sectionId)
            ? prev.filter((id) => id !== sectionId)
            : [...prev, sectionId]
      );
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

      setCompletedLectures(newCompleted); // Optimistic Update
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

   const playPreviousLecture = () => {
      if (!course?.curriculum?.sections || !currentLecture) return;

      let currentSectionIndex = -1;
      let currentLectureIndex = -1;

      // Find current position
      course.curriculum.sections.forEach((section: Section, sIndex: number) => {
         section.lectures?.forEach((lecture: Lecture, lIndex: number) => {
            if (lecture.clientId === currentLecture.clientId) {
               currentSectionIndex = sIndex;
               currentLectureIndex = lIndex;
            }
         });
      });

      if (currentSectionIndex === -1) return;

      // Try previous lecture in current section
      if (currentLectureIndex > 0) {
         const currentSection = course.curriculum.sections[currentSectionIndex];
         setCurrentLecture(currentSection.lectures![currentLectureIndex - 1]);
         return;
      }

      // Try last lecture of previous section
      if (currentSectionIndex > 0) {
         const prevSection =
            course.curriculum.sections[currentSectionIndex - 1];
         if (prevSection.lectures && prevSection.lectures.length > 0) {
            setCurrentLecture(
               prevSection.lectures[prevSection.lectures.length - 1]
            );
            // Ensure previous section is open
            if (!openSections.includes(prevSection.clientId)) {
               setOpenSections([...openSections, prevSection.clientId]);
            }
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
         if (nextSectionId) {
            setOpenSections((prev) =>
               prev.includes(nextSectionId!) ? prev : [...prev, nextSectionId!]
            ); // Ensure section is open
         }
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

   if (isLoading || isEnrolled === null) {
      return (
         <>
            <RouteGuard type="protected" role="student" />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
               <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-600">Verifying access...</p>
               </div>
            </div>
         </>
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
         <RouteGuard type="protected" role="student" />
         {/* Top Header */}
         <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
            <div className="max-w-[1800px] mx-auto flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <Link
                     href="/student/courses"
                     className="text-gray-600 hover:text-gray-900"
                  >
                     <ArrowLeft className="w-5 h-5" />
                  </Link>
                  <div>
                     <h1 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-1">
                        {course.basicInfo.title}
                     </h1>
                     <div className="hidden sm:flex items-center gap-4 text-xs sm:text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                           <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                           {course.curriculum?.sections?.length || 0} Sections
                        </span>
                        <span className="flex items-center gap-1">
                           <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                           {totalLectures} lectures
                        </span>
                        <span className="flex items-center gap-1">
                           <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                           {totalHours}h {totalMinutes}m
                        </span>
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-2 sm:gap-3">
                  {/* Mobile Sidebar Toggle */}
                  <button
                     onClick={() => setIsSidebarOpen(true)}
                     className="xl:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                  >
                     <Menu className="w-6 h-6" />
                  </button>

                  <button
                     onClick={() => setIsRatingModalOpen(true)}
                     className={`hidden sm:block px-3 py-1.5 sm:px-4 sm:py-2 text-sm border rounded transition-colors ${
                        myRating
                           ? 'text-green-600 border-green-500 hover:bg-green-50'
                           : 'text-orange-500 border-orange-500 hover:bg-orange-50'
                     }`}
                  >
                     {myRating ? 'View Review' : 'Write A Review'}
                  </button>
                  <button
                     onClick={playNextLecture}
                     className="hidden sm:flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                  >
                     <span>Next</span>
                     <ChevronRight className="w-4 h-4" />
                  </button>
               </div>
            </div>
         </div>

         {/* Content Area - Responsive Layout */}
         {/* Mobile: Stacked (Video -> Info -> Sidebar/Curriculum) */}
         {/* Desktop (xl): Split (Video/Info | Sidebar/Curriculum) */}
         {/* Content Area - Responsive Layout */}
         <div className="max-w-[1800px] mx-auto min-h-[calc(100vh-140px)] relative">
            <div className="flex flex-col xl:flex-row h-full">
               {/* Main Content (Video + Description) */}
               <div className="flex-1 p-4 xl:p-6 w-full">
                  {/* Video Player */}
                  <div className="bg-black rounded-lg overflow-hidden mb-4 xl:mb-6 shadow-lg">
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

                  {/* Mobile Navigation Controls */}
                  <div className="flex xl:hidden justify-between gap-4 mb-6">
                     <button
                        onClick={playPreviousLecture}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                     >
                        <ChevronLeft className="w-5 h-5" />
                        Previous
                     </button>
                     <button
                        onClick={playNextLecture}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 active:scale-95 transition-all shadow-sm"
                     >
                        Next
                        <ChevronRight className="w-5 h-5" />
                     </button>
                  </div>

                  {/* Lecture Title & Info */}
                  <div className="bg-white rounded-lg p-6 mb-6">
                     <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {currentLecture?.title || 'Select a lecture'}
                     </h2>
                     <div className="flex items-center gap-4 mb-4">
                        <span className="text-sm text-gray-600">
                           Last updated:{' '}
                           {course.updatedAt
                              ? new Date(course.updatedAt).toLocaleDateString()
                              : 'N/A'}
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
                              {(currentLecture?.attachments?.length ?? 0) >
                              0 ? (
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
                              <h3 className="font-bold text-lg mb-4">
                                 Reviews & Comments
                              </h3>
                              {myRating ? (
                                 <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-lg p-4 mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                       <span className="font-semibold text-gray-900">
                                          Your Review
                                       </span>
                                       <div className="flex items-center gap-1">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                             <Star
                                                key={star}
                                                size={16}
                                                className={
                                                   star <= myRating.rating
                                                      ? 'text-yellow-400 fill-yellow-400'
                                                      : 'text-gray-300'
                                                }
                                             />
                                          ))}
                                          <span className="ml-2 text-sm font-medium text-gray-700">
                                             {myRating.rating}.0
                                          </span>
                                       </div>
                                    </div>
                                    {myRating.review ? (
                                       <p className="text-gray-700 italic">
                                          "{myRating.review}"
                                       </p>
                                    ) : (
                                       <p className="text-gray-500 text-sm">
                                          No written review provided.
                                       </p>
                                    )}
                                    <button
                                       onClick={() =>
                                          setIsRatingModalOpen(true)
                                       }
                                       className="mt-3 text-sm text-orange-500 hover:text-orange-600 font-medium"
                                    >
                                       Edit Review
                                    </button>
                                 </div>
                              ) : (
                                 <div className="text-center py-8">
                                    <p className="text-gray-500 mb-3">
                                       You haven't reviewed this course yet.
                                    </p>
                                    <button
                                       onClick={() =>
                                          setIsRatingModalOpen(true)
                                       }
                                       className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                    >
                                       Write A Review
                                    </button>
                                 </div>
                              )}
                           </div>
                        )}
                     </div>
                  </div>
               </div>

               {/* Mobile Sidebar Overlay */}
               {isSidebarOpen && (
                  <div
                     className="fixed inset-0 bg-black/50 z-40 xl:hidden"
                     onClick={() => setIsSidebarOpen(false)}
                  />
               )}

               {/* Application Sidebar / Drawer */}
               <div
                  className={`
               fixed inset-y-0 right-0 z-50 w-[85vw] sm:w-[400px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
               xl:sticky xl:top-[72px] xl:transform-none xl:w-[400px] xl:shadow-none xl:border-l border-gray-200 xl:block xl:h-[calc(100vh-72px)]
               ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'}
            `}
               >
                  <div className="h-full flex flex-col">
                     {/* Sidebar Header Mobile */}
                     <div className="flex items-center justify-between p-4 border-b border-gray-100 xl:hidden">
                        <h3 className="font-bold text-gray-900">
                           Course Content
                        </h3>
                        <button
                           onClick={() => setIsSidebarOpen(false)}
                           className="p-2 hover:bg-gray-100 rounded-full"
                        >
                           <X className="w-5 h-5 text-gray-500" />
                        </button>
                     </div>

                     {/* Sidebar Header Desktop */}
                     <div className="hidden xl:block p-6 border-b border-gray-200 bg-white">
                        <div className="flex items-center justify-between mb-2">
                           <h3 className="text-lg font-bold text-gray-900">
                              Course Contents
                           </h3>
                           <span className="text-sm text-green-600 font-medium">
                              {getProgressPercentage()}% Completed
                           </span>
                        </div>
                        {/* Progress Bar Visual */}
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                           <div
                              className="h-full bg-green-500 transition-all duration-500"
                              style={{ width: `${getProgressPercentage()}%` }}
                           />
                        </div>
                     </div>

                     {/* Scrollable Content */}
                     <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                        {course.curriculum?.sections?.map(
                           (section: Section) => {
                              const isOpen = openSections.includes(
                                 section.clientId
                              );
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
                                       onClick={() =>
                                          toggleSection(section.clientId)
                                       }
                                       className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group"
                                    >
                                       <div className="flex items-center gap-3 flex-1 text-left min-w-0">
                                          {isOpen ? (
                                             <ChevronDown className="w-4 h-4 text-orange-500 shrink-0" />
                                          ) : (
                                             <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 shrink-0" />
                                          )}
                                          <div className="flex flex-col truncate">
                                             <span className="font-medium text-gray-900 text-sm truncate">
                                                {section.title}
                                             </span>
                                             <span className="text-xs text-gray-500 mt-0.5">
                                                {sectionCompletedCount}/
                                                {section.lectures?.length || 0}{' '}
                                                |{' '}
                                                {Math.floor(
                                                   sectionDuration / 60
                                                )}
                                                m
                                             </span>
                                          </div>
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
                                                      onClick={() => {
                                                         if (
                                                            lecture.video?.url
                                                         ) {
                                                            setCurrentLecture(
                                                               lecture
                                                            );
                                                            // On mobile, close sidebar when selecting a lecture
                                                            if (
                                                               window.innerWidth <
                                                               1280
                                                            ) {
                                                               setIsSidebarOpen(
                                                                  false
                                                               );
                                                            }
                                                         }
                                                      }}
                                                      className={`w-full flex items-start p-3 pl-10 hover:bg-white transition-colors cursor-pointer border-l-4 ${
                                                         isActive
                                                            ? 'bg-orange-50 border-orange-500'
                                                            : 'border-transparent'
                                                      }`}
                                                   >
                                                      <div className="flex-1 min-w-0 mr-3">
                                                         <div className="flex items-start gap-3">
                                                            <button
                                                               onClick={(e) => {
                                                                  e.stopPropagation();
                                                                  toggleLectureComplete(
                                                                     lecture.clientId
                                                                  );
                                                               }}
                                                               className="mt-0.5 shrink-0 hover:scale-110 transition-transform"
                                                            >
                                                               {isCompleted ? (
                                                                  <CheckCircle className="w-5 h-5 text-orange-500 fill-orange-500/10" />
                                                               ) : (
                                                                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full hover:border-orange-500 transition-colors" />
                                                               )}
                                                            </button>
                                                            <div className="flex flex-col">
                                                               <span
                                                                  className={`text-sm leading-snug ${isActive ? 'text-orange-600 font-medium' : 'text-gray-700'}`}
                                                               >
                                                                  {lectureIndex +
                                                                     1}
                                                                  .{' '}
                                                                  {
                                                                     lecture.title
                                                                  }
                                                               </span>
                                                               <div className="flex items-center gap-2 mt-1">
                                                                  <span className="text-xs text-gray-400 flex items-center gap-1">
                                                                     <Play className="w-3 h-3" />
                                                                     {lecture
                                                                        .video
                                                                        ?.duration
                                                                        ? formatDuration(
                                                                             lecture
                                                                                .video
                                                                                .duration
                                                                          )
                                                                        : '00:00'}
                                                                  </span>
                                                               </div>
                                                            </div>
                                                         </div>
                                                      </div>
                                                   </div>
                                                );
                                             }
                                          )}
                                       </div>
                                    )}
                                 </div>
                              );
                           }
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Rating Modal */}
         {isRatingModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
               {/* Backdrop */}
               <div
                  className="absolute inset-0 bg-black/50"
                  onClick={() => setIsRatingModalOpen(false)}
               />
               {/* Modal Content */}
               <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 z-10">
                  <button
                     onClick={() => setIsRatingModalOpen(false)}
                     className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                     <X className="w-5 h-5" />
                  </button>
                  <RatingForm
                     courseId={courseId}
                     onSuccess={() => {
                        setIsRatingModalOpen(false);
                        refetchMyRating();
                     }}
                  />
               </div>
            </div>
         )}
      </div>
   );
}
