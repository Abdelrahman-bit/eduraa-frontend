import Image from 'next/image';

export default function BecomeInstructor() {
   return (
      <section className="p-20 bg-gray-50">
         <div className="flex gap-8 section-boundary-lg">
            {/* Left Card */}
            <div className="flex-3 bg-gradient-to-r from-[#CC522B] to-[#FF6636]  p-10 text-white flex items-center justify-between">
               <div className="flex flex-col items-start gap-2">
                  <h2 className="text-heading-3 font-semibold">
                     Become an instructor
                  </h2>
                  <p className="text-white/90 leading-relaxed text-sm">
                     Instructors from around the world teach millions of
                     students on Udemy. We provide the tools and skills to teach
                     what you love.
                  </p>

                  <button className="bg-white text-button-medium text-primary-500 font-semibold mt-4 py-2.5 px-5  flex items-center gap-2 shadow-sm hover:shadow-md transition">
                     Start Teaching →
                  </button>
               </div>

               <Image
                  src="/instructor.png"
                  width={250}
                  height={220}
                  alt="Instructor"
               />
            </div>

            {/* Right Card */}
            <div className="flex-2 bg-[#F8FAFC] rounded-xl px-10 py-12">
               <h2 className="text-2xl font-bold mb-6">
                  Your teaching & earning steps
               </h2>

               <div className="grid grid-cols-2  gap-5">
                  {/* Step 1 */}
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                        1
                     </div>
                     <p className="text-gray-700 font-medium">
                        Apply to become instructor
                     </p>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                        2
                     </div>
                     <p className="text-gray-700 font-medium">
                        Build & edit your profile
                     </p>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                        3
                     </div>
                     <p className="text-gray-700 font-medium">
                        Create your new course
                     </p>
                  </div>

                  {/* Step 4 */}
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                        4
                     </div>
                     <p className="text-gray-700 font-medium">
                        Start teaching & earning
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
