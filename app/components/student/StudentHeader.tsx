'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function StudentHeader() {
   const pathname = usePathname();

   const navigation = [
      { name: 'Dashboard', href: '/student/dashboard' },
      { name: 'Courses', href: '/student/courses' },
      { name: 'Teachers', href: '/student/teachers' },
      { name: 'Messages', href: '/student/studentMsgs' },
      { name: 'Wishlist', href: '/student/wishlist' },
      { name: 'Shopping Cart', href: '/student/shoppingCart' },
      { name: 'Settings', href: '/student/settings' },
   ];

   return (
      <div className="w-full bg-[#FFEEE8] py-12 pb-0">
         <div className="container mx-auto px-4">
            <div className="bg-white shadow-sm px-8 pt-8 ">
               <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                  <div className="flex items-center gap-5">
                     <div className="relative w-16 h-16 rounded-full overflow-hidden">
                        {/* use student name frist chars instead of img */}
                        <img
                           src="https://ui-avatars.com/api/?name=Kevin+Gilbert&background=1D2026&color=fff"
                           alt="Kevin Gilbert"
                           className="w-full h-full object-cover"
                        />
                     </div>
                     <div>
                        <h1 className="text-2xl font-bold text-[#1D2026]">
                           Kevin Gilbert
                        </h1>
                        <p className="text-[#4E5566] text-sm">
                           Web Designer & Best-Selling Instructor
                        </p>
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-8 overflow-x-auto border-t border-gray-100 pt-2">
                  {navigation.map((item) => {
                     const isActive = pathname === item.href;

                     return (
                        <Link
                           key={item.name}
                           href={item.href}
                           className={`relative pb-4 text-sm font-medium transition-colors whitespace-nowrap ${
                              isActive
                                 ? 'text-[#1D2026]'
                                 : 'text-[#6E7485] hover:text-[#1D2026]'
                           }`}
                        >
                           {item.name}

                           {isActive && (
                              <span className="absolute bottom-3 left-0 w-full h-[2px] bg-[#FF6636]" />
                           )}
                        </Link>
                     );
                  })}
               </div>
            </div>
         </div>
      </div>
   );
}
