'use client';
import React from 'react';
import { SectionTitle } from './SharedUI';

export default function NotificationSettings() {
   return (
      <div className="bg-white p-8 rounded-sm shadow-sm h-full flex flex-col">
         <SectionTitle title="Notifications" />
         <div className="flex flex-col gap-4 mb-6 flex-1">
            <label className="flex items-center gap-3 cursor-pointer group">
               <input type="checkbox" className="w-4 h-4 accent-orange-500" />
               <span className="text-sm text-gray-600">
                  I want to know who buy my course.
               </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
               <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 accent-orange-500"
               />
               <span className="text-sm text-gray-600">
                  I want to know who write a review on my course.
               </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
               <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 accent-orange-500"
               />
               <span className="text-sm text-gray-600">
                  Notify me of global announcements.
               </span>
            </label>
         </div>
         <button className="bg-[#FF6636] hover:bg-orange-600 text-white px-6 py-2.5 rounded-sm font-semibold transition-colors text-sm w-fit mt-2">
            Save Changes
         </button>
      </div>
   );
}
