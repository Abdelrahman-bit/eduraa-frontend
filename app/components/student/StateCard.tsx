import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
   icon: LucideIcon;
   number: string | number;
   label: string;
   bgColor: string;
   iconColor: string;
}

const StatCard = ({
   icon: Icon,
   number,
   label,
   bgColor,
   iconColor,
}: StatCardProps) => {
   return (
      <div className={`${bgColor} p-6 rounded-lg flex items-center gap-4`}>
         <div className="w-12 h-12 flex items-center justify-center rounded bg-white">
            <Icon className={`w-6 h-6 ${iconColor}`} />
         </div>

         <div>
            <h3 className="text-2xl font-bold text-gray-900">{number}</h3>
            <p className="text-sm text-gray-500">{label}</p>
         </div>
      </div>
   );
};

export default StatCard;
