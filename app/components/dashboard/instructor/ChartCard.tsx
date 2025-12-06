'use client';

import { ReactNode } from 'react';

interface ChartCardProps {
   title: string;
   filterText?: string;
   children: ReactNode;
   legend?: ReactNode;
}

export function ChartCard({
   title,
   filterText = 'This month',
   children,
   legend,
}: ChartCardProps) {
   return (
      <div className="bg-white p-6 shadow-sm rounded-sm h-full min-h-[400px] flex flex-col p-1">
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <div className="flex items-center gap-4">
               {/* Optional legend component */}
               {legend}
               <span className="text-xs text-gray-400 cursor-pointer">
                  {filterText} ▼
               </span>
            </div>
         </div>
         <div className="flex-1 w-full h-[300px]">{children}</div>
      </div>
   );
}
