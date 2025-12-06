'use client';
import { Star } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

interface RatingCardProps {
   rating: number;
   totalRating: number;
   data: Array<{ stars: number; percent: number }>;
   chartData: Array<{ value: number }>;
   title?: string;
}

export function RatingCard({
   rating,
   totalRating,
   data,
   chartData,
   title = 'Overall Course Rating',
}: RatingCardProps) {
   return (
      <div className="bg-white p-6 shadow-sm rounded-sm h-full">
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <span className="text-xs text-gray-400">This week ▼</span>
         </div>

         <div className="flex gap-4 mb-8 items-stretch bg-orange-50/60 p-5 rounded-md border border-orange-100">
            <div className="text-center flex flex-col justify-center min-w-[80px]">
               <h3 className="text-4xl font-extrabold text-gray-900">
                  {rating}
               </h3>
               <div className="flex text-orange-400 justify-center text-[10px] gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                     <Star
                        key={i}
                        size={10}
                        fill="currentColor"
                        className={
                           i <= Math.round(rating)
                              ? 'text-orange-400'
                              : 'text-gray-300'
                        }
                     />
                  ))}
               </div>
               <p className="text-[11px] text-gray-500 mt-1">Course Rating</p>
            </div>

            {/* Mini Chart */}
            <div className="flex-1 h-20 w-full relative">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                     <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#FF6636"
                        strokeWidth={2}
                        dot={false}
                     />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Progress Bars */}
         <div className="space-y-3">
            {data.map((r) => (
               <div key={r.stars} className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1.5 w-14 text-gray-500 font-medium text-xs">
                     <Star
                        size={12}
                        className="text-orange-400 fill-orange-400"
                     />
                     {r.stars} Star
                  </div>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                     <div
                        className="h-full bg-orange-400 rounded-full"
                        style={{ width: `${r.percent}%` }}
                     ></div>
                  </div>
                  <span className="w-8 text-right text-gray-700 font-semibold text-xs">
                     {r.percent}%
                  </span>
               </div>
            ))}
         </div>
      </div>
   );
}
