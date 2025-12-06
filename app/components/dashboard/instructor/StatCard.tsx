import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export function StatCard({
   icon: Icon,
   label,
   value,
   subLabel,
   bg,
   color,
}: {
   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
   label: string;
   value: string | number;
   subLabel?: string;
   bg: string;
   color: string;
}) {
   return (
      <div className="bg-white p-5 rounded-sm shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
         <div
            className={cn(
               'w-12 h-12 rounded-sm flex items-center justify-center shrink-0',
               bg
            )}
         >
            <Icon className={cn('w-6 h-6', color)} strokeWidth={2} />
         </div>
         <div>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            <p className="text-gray-500 text-sm font-medium">{label}</p>
            {subLabel && (
               <p className="text-gray-400 text-xs mt-0.5">{subLabel}</p>
            )}
         </div>
      </div>
   );
}
