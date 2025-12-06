'use client';

import React, { useState } from 'react';
import { GraduationCap, Menu, X } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import Footer from '../components/dashboard/Footer';

export default function DashboardLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const userRole = 'instructor';

   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   const closeSidebar = () => setIsSidebarOpen(false);

   return (
      <div className="min-h-screen bg-gray-50 flex relative">
         {/* Overlay */}
         {isSidebarOpen && (
            <div
               onClick={closeSidebar}
               className="fixed inset-0 z-40 bg-black/50 md:hidden"
            />
         )}

         {/* Sidebar Container */}
         <div
            className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#1D2026] shadow-lg transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
         >
            <div className="absolute top-4 right-4 md:hidden z-50">
               <button
                  onClick={closeSidebar}
                  className="text-gray-400 hover:text-white"
               >
                  <X size={24} />
               </button>
            </div>

            {/* close sidebar on click */}
            <Sidebar role={userRole} onLinkClick={closeSidebar} />
         </div>

         {/* Main Content Area */}
         <div className="flex-1 flex flex-col min-h-screen w-full transition-all duration-300">
            {/* Mobile Header Bar */}
            <div className="md:hidden bg-white p-4 border-b flex items-center gap-4 sticky top-0 z-30">
               <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
               >
                  <Menu size={24} />
               </button>
               <div className="flex items-center ">
                  <div className="flex items-center gap-2 text-black font-bold text-xl">
                     <span className="text-orange-500 text-2xl">
                        <GraduationCap />
                     </span>{' '}
                     E-tutor
                  </div>
               </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:block">
               <Header />
            </div>

            {/* Content Children */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
               {children}
            </main>

            <Footer />
         </div>
      </div>
   );
}
