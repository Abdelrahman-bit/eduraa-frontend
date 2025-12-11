'use client';
import { ArrowRight, Bell, Construction, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function StudentMsgs() {
   const [isNotified, setIsNotified] = useState(false);
   {
      /* Coming Soon Content */
   }
   return (
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center p-8 text-center min-h-[500px]">
         {/* Visual Icon with Pulse Effect */}
         <div className="relative mb-8">
            <div className="absolute inset-0 bg-orange-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
               <MessageCircle
                  size={40}
                  className="text-orange-500"
                  strokeWidth={2}
               />
            </div>
            {/* Small Badge */}
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center border-2 border-white shadow-md">
               <Construction size={14} className="text-white" />
            </div>
         </div>

         {/* Text Content */}
         <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Coming Soon!
         </h2>
         <p className="text-gray-500 max-w-md text-base md:text-lg mb-8 leading-relaxed">
            We are currently building a powerful messaging system to help you
            chat directly with your students. Stay tuned for updates.
         </p>

         {/* Interactive Element (Notification) */}
         <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            {!isNotified ? (
               <button
                  onClick={() => setIsNotified(true)}
                  className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-sm font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
               >
                  <Bell size={18} />
                  Notify Me When Ready
               </button>
            ) : (
               <div className="flex items-center justify-center gap-2 bg-green-50 text-green-600 px-8 py-3 rounded-sm font-medium border border-green-100">
                  <span className="text-xl">✓</span>
                  You&apos;ll be notified!
               </div>
            )}

            <Link
               href="/dashboard"
               className="flex items-center justify-center gap-2 bg-white text-gray-600 hover:text-gray-900 px-8 py-3 rounded-sm font-medium border border-gray-200 hover:border-gray-300 transition-colors"
            >
               Go to Dashboard
               <ArrowRight size={18} />
            </Link>
         </div>

         {/* Footer Info */}
         <p className="mt-12 text-xs text-gray-400 uppercase tracking-widest font-semibold">
            Expected Launch: Q1 2026
         </p>
      </div>
   );
}
