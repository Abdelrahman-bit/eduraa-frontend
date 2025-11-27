import {
   Apple,
   ArrowRight,
   Layers,
   Facebook,
   Instagram,
   Linkedin,
   Twitter,
   Youtube,
} from 'lucide-react';

export default function Footer() {
   return (
      <footer className="bg-[#1D2026] text-gray-300 pt-16 pb-8">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
               {/* Brand Column */}
               <div className="lg:col-span-1 space-y-6">
                  <div className="flex items-center gap-2 text-white font-bold text-2xl">
                     <Layers className="text-orange-500 w-8 h-8" />
                     E-tutor
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                     Aliquam rhoncus ligula est, non pulvinar elit convallis
                     nec. Donec mattis odio at.
                  </p>
                  <div className="flex gap-4">
                     {[Facebook, Instagram, Linkedin, Twitter, Youtube].map(
                        (Icon, i) => (
                           <a
                              key={i}
                              href="#"
                              className="bg-[#2B3038] p-2 rounded hover:bg-orange-500 hover:text-white transition-colors"
                           >
                              <Icon className="w-4 h-4" />
                           </a>
                        )
                     )}
                  </div>
               </div>

               {/* Links Columns */}
               <div className="space-y-4">
                  <h3 className="text-white font-semibold uppercase text-sm tracking-wider">
                     Top 4 Category
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                     <li>
                        <a
                           href="#"
                           className="hover:text-orange-500 transition-colors"
                        >
                           Development
                        </a>
                     </li>
                     <li>
                        <a
                           href="#"
                           className="hover:text-orange-500 transition-colors"
                        >
                           Finance & Accounting
                        </a>
                     </li>
                     <li>
                        <a
                           href="#"
                           className="hover:text-orange-500 transition-colors"
                        >
                           Design
                        </a>
                     </li>
                     <li>
                        <a
                           href="#"
                           className="hover:text-orange-500 transition-colors"
                        >
                           Business
                        </a>
                     </li>
                  </ul>
               </div>

               <div className="space-y-4">
                  <h3 className="text-white font-semibold uppercase text-sm tracking-wider">
                     Quick Links
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                     <li>
                        <a
                           href="#"
                           className="hover:text-orange-500 transition-colors"
                        >
                           About
                        </a>
                     </li>
                     <li>
                        <a
                           href="#"
                           className="hover:text-orange-500 transition-colors flex items-center gap-1 text-white"
                        >
                           Become Instructor <ArrowRight className="w-3 h-3" />
                        </a>
                     </li>
                     <li>
                        <a
                           href="#"
                           className="hover:text-orange-500 transition-colors"
                        >
                           Contact
                        </a>
                     </li>
                     <li>
                        <a
                           href="#"
                           className="hover:text-orange-500 transition-colors"
                        >
                           Career
                        </a>
                     </li>
                  </ul>
               </div>

               <div className="space-y-4">
                  <h3 className="text-white font-semibold uppercase text-sm tracking-wider">
                     Support
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                     <li>
                        <a
                           href="#"
                           className="hover:text-orange-500 transition-colors"
                        >
                           Help Center
                        </a>
                     </li>
                     <li>
                        <a
                           href="#"
                           className="hover:text-orange-500 transition-colors"
                        >
                           FAQs
                        </a>
                     </li>
                     <li>
                        <a
                           href="#"
                           className="hover:text-orange-500 transition-colors"
                        >
                           Terms & Condition
                        </a>
                     </li>
                     <li>
                        <a
                           href="#"
                           className="hover:text-orange-500 transition-colors"
                        >
                           Privacy Policy
                        </a>
                     </li>
                  </ul>
               </div>

               {/* Download App Column */}
               <div className="space-y-4">
                  <h3 className="text-white font-semibold uppercase text-sm tracking-wider">
                     Download our app
                  </h3>
                  <div className="space-y-3">
                     <button className="flex items-center gap-3 bg-[#2B3038] w-full px-4 py-3 rounded hover:bg-[#363C46] transition-colors group">
                        <div className="text-white">
                           <Apple className="w-6 h-6 fill-current" />
                        </div>
                        <div className="text-left">
                           <div className="text-[10px] text-gray-400">
                              Download now
                           </div>
                           <div className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors">
                              App Store
                           </div>
                        </div>
                     </button>
                     <button className="flex items-center gap-3 bg-[#2B3038] w-full px-4 py-3 rounded hover:bg-[#363C46] transition-colors group">
                        <div className="text-white">
                           <svg
                              className="w-6 h-6 fill-current"
                              viewBox="0 0 24 24"
                           >
                              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.37,13.08L18.3,16.62L15.33,13.65L20.37,13.08M15.33,10.35L18.3,7.38L20.37,10.92L15.33,10.35M16.81,8.88L14.54,11.15L6.05,2.66L16.81,8.88Z" />
                           </svg>
                        </div>
                        <div className="text-left">
                           <div className="text-[10px] text-gray-400">
                              Download now
                           </div>
                           <div className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors">
                              Play Store
                           </div>
                        </div>
                     </button>
                  </div>
               </div>
            </div>

            {/* Bottom Copyright */}
            <div className="border-t border-[#2B3038] pt-8 text-center text-sm text-gray-500">
               © 2025 - All rights reserved
            </div>
         </div>
      </footer>
   );
}
