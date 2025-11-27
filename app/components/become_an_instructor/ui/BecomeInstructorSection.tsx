import RegistrationDialog from './RegistrationDialog';
export default function BecomeInstructorSection() {
   return (
      <section
         id="become_an_instructor"
         className="bg-[#1D2026] text-white py-20 px-6 md:px-12 lg:px-24"
      >
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
               <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Start teaching with us and inspire others
               </h2>
               <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
                  Become an instructor & start teaching with 26k certified
                  instructors. Create a success story with 67.1k Students — Grow
                  yourself with 71 countries.
               </p>
            </div>

            {/* Dialog with Registration Form */}
            <RegistrationDialog />
         </div>
         <hr className="mt-20 border border-gray-700" />
      </section>
   );
}
