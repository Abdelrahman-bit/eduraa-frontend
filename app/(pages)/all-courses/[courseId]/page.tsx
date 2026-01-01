'use client';
import { use, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
   Globe,
   Play,
   Clock,
   BarChart,
   FileText,
   Award,
   AlertCircle,
   CheckCircle,
   ChevronRight,
   Monitor,
   ChevronDown,
   ChevronUp,
   Star,
   X,
   Ticket,
   Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Shadcn Components Imports
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
   fetchCourseById,
   fetchPublishedCourses,
   checkEnrollment,
   requestCourseEnrollment,
   getEnrollmentRequestStatus,
   redeemAccessCode,
} from '@/app/services/courses';
import { getCourseRatingStats } from '@/app/services/ratingService';
import CourseDetailsSkeleton from '@/app/components/all-courses/ui/CourseDetailsSkeleton';
import CourseListCard from '@/app/components/all-courses/ui/CourseListCard';
import useBearStore from '@/app/store/useStore';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';

export default function CourseDetailsPage({
   params,
}: {
   params: Promise<{ courseId: string }>;
}) {
   // Unwrap params Promise
   const { courseId } = use(params);
   const {
      isAuthenticated,
      addToWishlist,
      removeFromWishlist,
      isCourseInWishlist,
      user,
   } = useBearStore();
   const isWishlisted = isCourseInWishlist(courseId);
   const isStudent = user?.role === 'student';
   const router = useRouter();

   const [openSections, setOpenSections] = useState<string[]>([]);
   const [initialSectionOpened, setInitialSectionOpened] = useState(false);
   const [isEnrolled, setIsEnrolled] = useState(false);
   const [showTrailerModal, setShowTrailerModal] = useState(false);
   const [requesting, setRequesting] = useState(false);
   const [showAccessCodeInput, setShowAccessCodeInput] = useState(false);
   const [accessCode, setAccessCode] = useState('');
   const [redeemingCode, setRedeemingCode] = useState(false);

   // Fetch course details
   const { data, isLoading, isError, error } = useQuery({
      queryKey: ['course', courseId],
      queryFn: () => fetchCourseById(courseId),
   });

   // Fetch related courses based on category
   const { data: relatedCoursesData } = useQuery({
      queryKey: ['relatedCourses', data?.data?.basicInfo.category],
      queryFn: async () => {
         const category = data?.data?.basicInfo.category;
         if (!category) {
            return { status: 'success', results: 0, data: [] };
         }
         try {
            return await fetchPublishedCourses({
               category,
               limit: 3,
            });
         } catch (error) {
            // Silently fail for related courses - it's not critical
            console.log('Could not load related courses');
            return { status: 'success', results: 0, data: [] };
         }
      },
      enabled: !!data?.data?.basicInfo.category,
      retry: false,
      staleTime: 5 * 60 * 1000,
   });

   // Check enrollment status
   const { data: enrollmentStatus, refetch: refetchEnrollment } = useQuery({
      queryKey: ['enrollment', courseId],
      queryFn: () => checkEnrollment(courseId),
      enabled: isAuthenticated && isStudent && !!courseId,
      retry: false,
      staleTime: 5 * 60 * 1000,
   });

   // Check enrollment request status
   const { data: requestStatusData, refetch: refetchRequestStatus } = useQuery({
      queryKey: ['enrollmentRequest', courseId],
      queryFn: () => getEnrollmentRequestStatus(courseId),
      enabled: isAuthenticated && isStudent && !!courseId,
      retry: false,
      staleTime: 5 * 60 * 1000,
   });

   const requestStatus = requestStatusData?.data?.requestStatus;

   // Fetch course rating stats
   const { data: ratingStats } = useQuery({
      queryKey: ['courseRatingStats', courseId],
      queryFn: () => getCourseRatingStats(courseId),
      enabled: !!courseId,
      staleTime: 5 * 60 * 1000,
   });

   // Update isEnrolled state when enrollment status changes
   useEffect(() => {
      if (enrollmentStatus !== undefined) {
         setIsEnrolled(enrollmentStatus);
      }
   }, [enrollmentStatus]);

   // Handle enrollment request
   const handleRequestEnroll = async () => {
      if (!isAuthenticated) {
         router.push('/login');
         return;
      }

      if (!isStudent) {
         toast.error('Only students can enroll in courses');
         return;
      }

      setRequesting(true);
      try {
         await requestCourseEnrollment(courseId);
         toast.success(
            'Enrollment request submitted! You will receive an email once approved.'
         );
         refetchRequestStatus();
      } catch (error: any) {
         console.error('Request error:', error);
         toast.error(
            error?.response?.data?.message || 'Failed to submit request'
         );
      } finally {
         setRequesting(false);
      }
   };

   // Handle access code redemption
   const handleRedeemCode = async () => {
      if (!accessCode.trim()) {
         toast.error('Please enter an access code');
         return;
      }

      setRedeemingCode(true);
      try {
         await redeemAccessCode(accessCode.trim());
         toast.success('Access code redeemed! You are now enrolled.');
         setIsEnrolled(true);
         setShowAccessCodeInput(false);
         setAccessCode('');
         refetchEnrollment();
      } catch (error: any) {
         console.error('Redeem error:', error);
         toast.error(
            error?.response?.data?.message || 'Invalid or expired access code'
         );
      } finally {
         setRedeemingCode(false);
      }
   };

   if (isLoading) {
      return <CourseDetailsSkeleton />;
   }

   if (isError) {
      return (
         <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
               <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
               <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Course Not Found
               </h1>
               <p className="text-gray-600 mb-4">
                  {error?.message ||
                     'The course you are looking for does not exist.'}
               </p>
               <Link
                  href="/all-courses"
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
               >
                  Back to Courses
               </Link>
            </div>
         </div>
      );
   }

   const course = data?.data;
   if (course) {
      console.log('Course Data:', course);
      console.log('Instructor Data:', course.instructor);
   }
   if (!course) return null;

   // Open first section by default
   if (
      course.curriculum?.sections &&
      course.curriculum.sections.length > 0 &&
      !initialSectionOpened
   ) {
      setOpenSections([course.curriculum.sections[0].clientId]);
      setInitialSectionOpened(true);
   }

   // Helper functions
   const getLevelLabel = (level: string) => {
      const labels: Record<string, string> = {
         'all-levels': 'All Levels',
         beginner: 'Beginner',
         intermediate: 'Intermediate',
         expert: 'Expert',
      };
      return labels[level] || level;
   };

   const formatDuration = (value: number, unit: string) => {
      return `${value} ${unit}${value > 1 ? 's' : ''}`;
   };

   // Helper to safely get avatar URL
   const getInstructorAvatar = () => {
      if (typeof course.instructor !== 'object' || !course.instructor) {
         return 'https://github.com/shadcn.png';
      }
      const inst = course.instructor as any;
      return (
         inst.avatar || inst.profilePicture || 'https://github.com/shadcn.png'
      );
   };

   return (
      <div className="min-h-screen bg-white font-sans text-slate-800 pb-20">
         {/* --- Breadcrumb (Working Links) --- */}
         <div className="bg-gray-50 py-4 border-b border-gray-100">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-wrap items-center gap-2 text-sm text-gray-500">
               <Link
                  href="/"
                  className="hover:text-orange-500 transition-colors"
               >
                  Home
               </Link>
               <ChevronRight className="w-4 h-4" />

               <Link
                  href="/all-courses"
                  className="hover:text-orange-500 transition-colors"
               >
                  Courses
               </Link>
               <ChevronRight className="w-4 h-4" />

               <Link
                  href={`/all-courses?category=${course.basicInfo.category}`}
                  className="hover:text-orange-500 transition-colors"
               >
                  {course.basicInfo.category}
               </Link>
               <ChevronRight className="w-4 h-4" />

               <span className="text-orange-500 font-medium">
                  {course.basicInfo.subCategory}
               </span>
            </div>
         </div>

         <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* === Left Column: Main Content === */}
            <div className="lg:col-span-8">
               {/* Title Section */}
               <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {course.basicInfo.title}
               </h1>
               <p className="text-gray-600 text-lg mb-6">
                  {course.basicInfo.subtitle}
               </p>

               <div className="flex flex-wrap items-center gap-6 mb-8">
                  {/* Single Instructor Avatar */}
                  <Link
                     href={
                        course.instructor &&
                        typeof course.instructor === 'object'
                           ? `/student/instructors/${(course.instructor as any)._id}`
                           : '#'
                     }
                     className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                     <Avatar className="w-10 h-10 border-2 border-white shadow-sm cursor-pointer">
                        <AvatarImage
                           src={getInstructorAvatar()}
                           alt="Instructor"
                        />
                        <AvatarFallback className="bg-orange-100 text-orange-600">
                           {typeof course.instructor === 'object' &&
                           (course.instructor as any).firstname
                              ? (course.instructor as any).firstname.charAt(0)
                              : 'I'}
                        </AvatarFallback>
                     </Avatar>
                     <div className="text-sm">
                        <span className="text-gray-500 block text-xs">
                           Created by:
                        </span>
                        <span className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                           {typeof course.instructor === 'object' &&
                           (course.instructor as any).firstname &&
                           (course.instructor as any).lastname
                              ? `${(course.instructor as any).firstname} ${(course.instructor as any).lastname}`
                              : 'Instructor'}
                        </span>
                     </div>
                  </Link>

                  {/* Level Badge */}
                  <div className="flex items-center gap-2">
                     <BarChart className="w-5 h-5 text-orange-500" />
                     <span className="font-medium text-gray-900">
                        {getLevelLabel(course.basicInfo.level)}
                     </span>
                  </div>
               </div>

               {/* Video / Hero Image Section */}
               <div
                  onClick={() =>
                     course.advancedInfo.trailerUrl && setShowTrailerModal(true)
                  }
                  className="relative w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden mb-8 group cursor-pointer shadow-lg"
               >
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10"></div>
                  {course.advancedInfo.thumbnailUrl ? (
                     <Image
                        src={course.advancedInfo.thumbnailUrl}
                        alt={course.basicInfo.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 800px"
                        priority
                     />
                  ) : (
                     <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                        <span className="text-gray-400">
                           Course Preview Image
                        </span>
                     </div>
                  )}

                  {course.advancedInfo.trailerUrl && (
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-6 h-6 text-orange-500 fill-orange-500 ml-1" />
                     </div>
                  )}
               </div>

               {/* === Shadcn Tabs === */}
               <Tabs defaultValue="overview" className="w-full mb-10">
                  <TabsList className="w-full justify-start border-b border-gray-200 bg-transparent p-0 h-auto rounded-none gap-8 overflow-x-auto">
                     {['Overview', 'Curriculum', 'Instructor', 'Review'].map(
                        (tab) => (
                           <TabsTrigger
                              key={tab}
                              value={tab.toLowerCase()}
                              className="rounded-none border-b-2 border-transparent px-0 py-3 text-gray-500 data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 data-[state=active]:shadow-none data-[state=active]:bg-transparent font-semibold text-sm hover:text-gray-800 transition-colors"
                           >
                              {tab}
                           </TabsTrigger>
                        )
                     )}
                  </TabsList>

                  {/* Content: Overview */}
                  <TabsContent
                     value="overview"
                     className="mt-8 space-y-10 animate-in fade-in-50 duration-300"
                  >
                     {/* Description */}
                     <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                           Description
                        </h2>
                        <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
                           <p className="whitespace-pre-wrap">
                              {course.advancedInfo.description}
                           </p>
                        </div>
                     </div>

                     {/* What you will learn */}
                     {course.advancedInfo.whatYouWillLearn &&
                        course.advancedInfo.whatYouWillLearn.length > 0 && (
                           <div className="bg-green-50 border border-green-100 rounded-2xl p-8">
                              <h3 className="text-xl font-bold text-gray-900 mb-6">
                                 What you will learn in this course
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                 {course.advancedInfo.whatYouWillLearn.map(
                                    (item: string, index: number) => (
                                       <div
                                          key={index}
                                          className="flex items-start gap-3"
                                       >
                                          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                          <p className="text-sm text-gray-700 leading-relaxed">
                                             {item}
                                          </p>
                                       </div>
                                    )
                                 )}
                              </div>
                           </div>
                        )}

                     {/* Requirements */}
                     {course.advancedInfo.requirements &&
                        course.advancedInfo.requirements.length > 0 && (
                           <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-4">
                                 Requirements:
                              </h3>
                              <ul className="space-y-3">
                                 {course.advancedInfo.requirements.map(
                                    (req: string, index: number) => (
                                       <li
                                          key={index}
                                          className="flex items-start gap-3 text-gray-600"
                                       >
                                          <span className="text-orange-500 mt-1.5">
                                             →
                                          </span>
                                          {req}
                                       </li>
                                    )
                                 )}
                              </ul>
                           </div>
                        )}

                     {/* Who this course is for */}
                     {course.advancedInfo.targetAudience &&
                        course.advancedInfo.targetAudience.length > 0 && (
                           <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-4">
                                 Who this course is for:
                              </h3>
                              <ul className="space-y-3">
                                 {course.advancedInfo.targetAudience.map(
                                    (audience: string, index: number) => (
                                       <li
                                          key={index}
                                          className="flex items-start gap-3 text-gray-600"
                                       >
                                          <span className="text-orange-500 mt-1.5">
                                             →
                                          </span>
                                          {audience}
                                       </li>
                                    )
                                 )}
                              </ul>
                           </div>
                        )}
                  </TabsContent>

                  {/* Curriculum Tab */}
                  <TabsContent
                     value="curriculum"
                     className="mt-8 animate-in fade-in-50 duration-300"
                  >
                     {course.curriculum?.sections &&
                     course.curriculum.sections.length > 0 ? (
                        <div className="space-y-4">
                           <div className="mb-6">
                              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                 Course Curriculum
                              </h2>
                              <p className="text-gray-600">
                                 {course.curriculum.sections.length} sections •{' '}
                                 {course.curriculum.sections.reduce(
                                    (acc: number, section: any) =>
                                       acc + section.lectures.length,
                                    0
                                 )}{' '}
                                 lectures
                              </p>
                           </div>

                           {course.curriculum.sections.map(
                              (section: any, sectionIndex: number) => {
                                 const isOpen = openSections.includes(
                                    section.clientId
                                 );
                                 const totalDuration = section.lectures.reduce(
                                    (acc: number, lecture: any) =>
                                       acc + (lecture.video?.duration || 0),
                                    0
                                 );
                                 const formatTime = (seconds: number) => {
                                    const hours = Math.floor(seconds / 3600);
                                    const minutes = Math.floor(
                                       (seconds % 3600) / 60
                                    );
                                    if (hours > 0)
                                       return `${hours}h ${minutes}m`;
                                    return `${minutes}m`;
                                 };

                                 return (
                                    <div
                                       key={section.clientId}
                                       className="border border-gray-200 rounded-lg overflow-hidden"
                                    >
                                       {/* Section Header */}
                                       <button
                                          onClick={() => {
                                             setOpenSections((prev) =>
                                                prev.includes(section.clientId)
                                                   ? prev.filter(
                                                        (id) =>
                                                           id !==
                                                           section.clientId
                                                     )
                                                   : [...prev, section.clientId]
                                             );
                                          }}
                                          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                                       >
                                          <div className="flex items-center gap-3">
                                             {isOpen ? (
                                                <ChevronUp className="w-5 h-5 text-gray-600" />
                                             ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-600" />
                                             )}
                                             <div className="text-left">
                                                <h3 className="font-semibold text-gray-900">
                                                   Section {sectionIndex + 1}:{' '}
                                                   {section.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                   {section.lectures.length}{' '}
                                                   lectures •{' '}
                                                   {formatTime(totalDuration)}
                                                </p>
                                             </div>
                                          </div>
                                       </button>

                                       {/* Lectures List */}
                                       {isOpen && (
                                          <div className="bg-white">
                                             {section.lectures.map(
                                                (
                                                   lecture: any,
                                                   lectureIndex: number
                                                ) => (
                                                   <div
                                                      key={lecture.clientId}
                                                      className="flex items-center justify-between p-4 border-t border-gray-100 hover:bg-gray-50 transition-colors"
                                                   >
                                                      <div className="flex items-center gap-3 flex-1">
                                                         <Play className="w-4 h-4 text-gray-400" />
                                                         <div className="flex-1">
                                                            <p className="font-medium text-gray-900">
                                                               {lectureIndex +
                                                                  1}
                                                               . {lecture.title}
                                                            </p>
                                                            {lecture.description && (
                                                               <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                                                                  {
                                                                     lecture.description
                                                                  }
                                                               </p>
                                                            )}
                                                         </div>
                                                      </div>
                                                      <div className="flex items-center gap-4 text-sm text-gray-600">
                                                         {lecture.video
                                                            ?.duration && (
                                                            <span className="flex items-center gap-1">
                                                               <Clock className="w-4 h-4" />
                                                               {formatTime(
                                                                  lecture.video
                                                                     .duration
                                                               )}
                                                            </span>
                                                         )}
                                                      </div>
                                                   </div>
                                                )
                                             )}
                                          </div>
                                       )}
                                    </div>
                                 );
                              }
                           )}
                        </div>
                     ) : (
                        <div className="p-8 border rounded-xl text-center text-gray-500">
                           No curriculum available yet
                        </div>
                     )}
                  </TabsContent>
                  <TabsContent
                     value="instructor"
                     className="mt-8 animate-in fade-in-50 duration-300"
                  >
                     {course.instructor &&
                     typeof course.instructor === 'object' ? (
                        <div className="bg-white border border-gray-100 rounded-2xl p-8">
                           <Link
                              href={
                                 course.instructor &&
                                 typeof course.instructor === 'object'
                                    ? `/student/instructors/${(course.instructor as any)._id}`
                                    : '#'
                              }
                              className="flex items-start gap-6 group"
                           >
                              <Avatar className="w-24 h-24 border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                                 <AvatarImage
                                    src={getInstructorAvatar()}
                                    alt={
                                       (course.instructor as any).firstname ||
                                       'Instructor'
                                    }
                                 />
                                 <AvatarFallback className="bg-orange-100 text-orange-600 text-2xl">
                                    {typeof course.instructor === 'object' &&
                                    (course.instructor as any).firstname
                                       ? (
                                            course.instructor as any
                                         ).firstname.charAt(0)
                                       : 'I'}
                                 </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                 <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                    {typeof course.instructor === 'object' &&
                                       `${(course.instructor as any).firstname} ${(course.instructor as any).lastname}`}
                                 </h2>
                                 <p className="text-gray-600 mb-4">
                                    {course.instructor.email}
                                 </p>
                                 <div className="flex items-center gap-6 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                       <Award className="w-4 h-4 text-orange-500" />
                                       <span>Professional Instructor</span>
                                    </div>
                                 </div>
                              </div>
                           </Link>
                        </div>
                     ) : (
                        <div className="p-8 border rounded-xl text-center text-gray-500">
                           Instructor information not available
                        </div>
                     )}
                  </TabsContent>
                  <TabsContent value="review" className="mt-8">
                     <div className="p-8 border rounded-xl text-center text-gray-500">
                        Reviews Component Placeholder
                     </div>
                  </TabsContent>
               </Tabs>
            </div>

            {/* === Right Column: Sticky Sidebar === */}
            <div className="lg:col-span-4">
               <div className="sticky top-24 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden p-6 md:p-8">
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-6">
                     <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                           <Star
                              key={star}
                              className={`w-5 h-5 ${
                                 star <=
                                 Math.round(ratingStats?.averageRating || 0)
                                    ? 'fill-orange-500 text-orange-500'
                                    : 'fill-gray-200 text-gray-200'
                              }`}
                           />
                        ))}
                     </div>
                     <span className="text-lg font-bold text-gray-900">
                        {ratingStats?.averageRating
                           ? ratingStats.averageRating.toFixed(1)
                           : 'N/A'}
                     </span>
                     <span className="text-sm text-gray-500">
                        ({ratingStats?.totalRatings || 0} reviews)
                     </span>
                  </div>

                  {/* Course Meta Data List */}
                  <div className="space-y-4 mb-8">
                     <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3 text-gray-500">
                           <Clock className="w-4 h-4" />
                           <span>Course Duration</span>
                        </div>
                        <span className="text-gray-900 font-medium">
                           {formatDuration(
                              course.basicInfo.durationValue,
                              course.basicInfo.durationUnit
                           )}
                        </span>
                     </div>

                     <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3 text-gray-500">
                           <BarChart className="w-4 h-4" />
                           <span>Course Level</span>
                        </div>
                        <span className="text-gray-900 font-medium">
                           {getLevelLabel(course.basicInfo.level)}
                        </span>
                     </div>

                     {course.basicInfo.primaryLanguage && (
                        <div className="flex items-center justify-between text-sm">
                           <div className="flex items-center gap-3 text-gray-500">
                              <Globe className="w-4 h-4" />
                              <span>Language</span>
                           </div>
                           <span className="text-gray-900 font-medium">
                              {course.basicInfo.primaryLanguage}
                           </span>
                        </div>
                     )}

                     {course.basicInfo.subtitleLanguage && (
                        <div className="flex items-center justify-between text-sm">
                           <div className="flex items-center gap-3 text-gray-500">
                              <FileText className="w-4 h-4" />
                              <span>Subtitles</span>
                           </div>
                           <span className="text-gray-900 font-medium">
                              {course.basicInfo.subtitleLanguage}
                           </span>
                        </div>
                     )}
                  </div>

                  {/* Enrollment Section */}
                  {!isEnrolled && (
                     <div className="mb-8 flex flex-col gap-3">
                        {/* Guest User - Login to Enroll */}
                        {!isAuthenticated && (
                           <button
                              onClick={() => router.push('/login')}
                              className="w-full py-4 px-6 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-lg transition-colors cursor-pointer shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                           >
                              Login to Enroll
                           </button>
                        )}

                        {/* Non-Student - Disabled */}
                        {isAuthenticated && !isStudent && (
                           <button
                              disabled
                              className="w-full py-4 px-6 bg-gray-300 text-gray-500 font-bold text-lg rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                              title="Only students can enroll in courses"
                           >
                              Students Only
                           </button>
                        )}

                        {/* Student with Pending Request */}
                        {isAuthenticated &&
                           isStudent &&
                           requestStatus === 'pending' && (
                              <button
                                 disabled
                                 className="w-full py-4 px-6 bg-yellow-100 text-yellow-700 font-bold text-lg rounded-lg cursor-not-allowed flex items-center justify-center gap-2 border border-yellow-300"
                              >
                                 <Clock className="w-5 h-5" />
                                 Waiting for Approval
                              </button>
                           )}

                        {/* Student with Approved Request - Prompt to use access code */}
                        {isAuthenticated &&
                           isStudent &&
                           requestStatus === 'approved' && (
                              <div className="w-full py-4 px-6 bg-green-100 text-green-700 font-bold text-lg rounded-lg flex items-center justify-center gap-2 border border-green-300">
                                 <CheckCircle className="w-5 h-5" />
                                 Approved - Use Access Code Below
                              </div>
                           )}

                        {/* Student - Can Request Enrollment (only if no request or rejected) */}
                        {isAuthenticated &&
                           isStudent &&
                           (!requestStatus || requestStatus === 'rejected') && (
                              <button
                                 onClick={handleRequestEnroll}
                                 disabled={requesting}
                                 className="w-full py-4 px-6 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-bold text-lg rounded-lg transition-colors cursor-pointer shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                              >
                                 {requesting ? (
                                    <>
                                       <Loader2 className="w-5 h-5 animate-spin" />
                                       Submitting...
                                    </>
                                 ) : (
                                    'Request Enrollment'
                                 )}
                              </button>
                           )}

                        {/* Access Code section - Show for all students (pending, approved, or no request) */}
                        {isAuthenticated && isStudent && (
                           <>
                              {/* Access Code Toggle */}
                              <button
                                 onClick={() =>
                                    setShowAccessCodeInput(!showAccessCodeInput)
                                 }
                                 className="w-full py-3 px-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-base rounded-lg transition-colors flex items-center justify-center gap-2"
                              >
                                 <Ticket className="w-5 h-5 text-orange-500" />
                                 {showAccessCodeInput
                                    ? 'Hide Access Code'
                                    : 'Have an Access Code?'}
                              </button>

                              {/* Access Code Input */}
                              {showAccessCodeInput && (
                                 <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                                    <input
                                       type="text"
                                       value={accessCode}
                                       onChange={(e) =>
                                          setAccessCode(
                                             e.target.value.toUpperCase()
                                          )
                                       }
                                       placeholder="Enter your access code"
                                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-center font-mono text-lg tracking-wider uppercase"
                                       maxLength={12}
                                    />
                                    <button
                                       onClick={handleRedeemCode}
                                       disabled={
                                          redeemingCode || !accessCode.trim()
                                       }
                                       className="w-full py-3 px-6 bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                       {redeemingCode ? (
                                          <>
                                             <Loader2 className="w-5 h-5 animate-spin" />
                                             Redeeming...
                                          </>
                                       ) : (
                                          'Redeem Code'
                                       )}
                                    </button>
                                 </div>
                              )}
                           </>
                        )}

                        {/* Wishlist Button for Students */}
                        {isStudent && (
                           <button
                              onClick={() => {
                                 if (!isAuthenticated)
                                    return toast.error('Please login first');
                                 if (isWishlisted)
                                    removeFromWishlist(course._id);
                                 else addToWishlist(course._id);
                              }}
                              className="w-full py-3 px-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-base rounded-lg transition-colors flex items-center justify-center gap-2"
                           >
                              {isWishlisted ? (
                                 <>
                                    <IoMdHeart className="w-5 h-5 text-red-500" />
                                    <span>Remove from Wishlist</span>
                                 </>
                              ) : (
                                 <>
                                    <IoMdHeartEmpty className="w-5 h-5" />
                                    <span>Add to Wishlist</span>
                                 </>
                              )}
                           </button>
                        )}
                     </div>
                  )}

                  {isEnrolled && (
                     <div className="mb-8">
                        <Link
                           href={`/student/courses/${courseId}`}
                           className="w-full py-4 px-6 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-lg transition-colors shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                        >
                           <Play className="w-5 h-5" />
                           Watch Now
                        </Link>
                     </div>
                  )}

                  {/* Sidebar Footer */}
                  <div className="border-t border-gray-100 pt-6">
                     <h4 className="font-bold text-gray-900 mb-4">
                        This course includes:
                     </h4>
                     <ul className="space-y-3 text-sm text-gray-600">
                        <li className="flex items-center gap-3">
                           <Award className="w-4 h-4 text-orange-500" />
                           Lifetime access
                        </li>
                        <li className="flex items-center gap-3">
                           <AlertCircle className="w-4 h-4 text-orange-500" />
                           30-days money-back guarantee
                        </li>
                        <li className="flex items-center gap-3">
                           <FileText className="w-4 h-4 text-orange-500" />
                           Resources & Files
                        </li>
                        <li className="flex items-center gap-3">
                           <Monitor className="w-4 h-4 text-orange-500" />
                           Access on mobile & TV
                        </li>
                     </ul>
                  </div>

                  {/* Requirements Section */}
                  {course.advancedInfo.requirements &&
                     course.advancedInfo.requirements.length > 0 && (
                        <div className="border-t border-gray-100 pt-6 mt-6">
                           <h4 className="font-bold text-gray-900 mb-4">
                              Requirements:
                           </h4>
                           <ul className="space-y-3 text-sm text-gray-600">
                              {course.advancedInfo.requirements.map(
                                 (req: string, index: number) => (
                                    <li
                                       key={index}
                                       className="flex items-start gap-3"
                                    >
                                       <CheckCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                                       <span>{req}</span>
                                    </li>
                                 )
                              )}
                           </ul>
                        </div>
                     )}
               </div>
            </div>
         </div>

         {/* Related Courses Section */}
         {relatedCoursesData?.data && relatedCoursesData.data.length > 0 && (
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-16 mb-12">
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">
                     Related Courses
                  </h2>
                  <Link
                     href={`/all-courses?category=${course.basicInfo.category}`}
                     className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-2 transition-colors"
                  >
                     View All
                     <ChevronRight className="w-4 h-4" />
                  </Link>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedCoursesData.data
                     .filter((relatedCourse) => relatedCourse._id !== courseId)
                     .slice(0, 3)
                     .map((relatedCourse) => (
                        <Link
                           key={relatedCourse._id}
                           href={`/all-courses/${relatedCourse._id}`}
                           className="block h-full hover:opacity-95 transition-opacity"
                        >
                           <CourseListCard course={relatedCourse} />
                        </Link>
                     ))}
               </div>
            </div>
         )}

         {/* Video Trailer Modal */}
         {showTrailerModal && course.advancedInfo.trailerUrl && (
            <div
               className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
               onClick={() => setShowTrailerModal(false)}
            >
               <div
                  className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
               >
                  {/* Close Button */}
                  <button
                     onClick={() => setShowTrailerModal(false)}
                     className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                  >
                     <X className="w-6 h-6 text-white" />
                  </button>

                  {/* Video Player */}
                  <video
                     src={course.advancedInfo.trailerUrl}
                     controls
                     autoPlay
                     className="w-full h-full"
                  >
                     Your browser does not support the video tag.
                  </video>
               </div>
            </div>
         )}
      </div>
   );
}
