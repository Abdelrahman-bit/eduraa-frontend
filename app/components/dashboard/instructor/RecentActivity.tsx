import React from 'react';
import { BookOpen } from 'lucide-react';

export interface ActivityItem {
   _id: string;
   type: string;
   title: string;
   message: string;
   time: string;
}

interface RecentActivityProps {
   activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
   return (
      <div className="bg-white p-6 rounded-sm shadow-sm">
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
            <span className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
               Today
            </span>
         </div>

         <div className="space-y-6">
            {activities.length > 0 ? (
               activities.map((activity) => (
                  <div key={activity._id} className="flex gap-4 items-start">
                     <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-[#FF6636] text-white">
                        <BookOpen size={18} fill="currentColor" />
                     </div>
                     <div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                           {activity.type === 'enrollment' ? (
                              <>
                                 <span className="font-bold text-gray-900">
                                    {activity.message.split(' enrolled')[0]}
                                 </span>
                                 {' purchase your course '}
                                 <span className="font-bold text-gray-900">
                                    "{activity.message.split(' in ')[1]}"
                                 </span>
                              </>
                           ) : (
                              <span>{activity.message}</span>
                           )}
                        </p>
                        <span className="text-xs text-gray-400 mt-1 block">
                           {new Date(activity.time).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                           })}
                        </span>
                     </div>
                  </div>
               ))
            ) : (
               <div className="text-center text-gray-400 py-4">
                  No recent activity
               </div>
            )}
         </div>
      </div>
   );
}
