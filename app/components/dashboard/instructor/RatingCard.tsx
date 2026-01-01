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

         {/* Top Section: Score & Chart */}
         <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Score Box */}
            <div className="bg-[#FFF8F0] p-4 rounded-md flex flex-col items-center justify-center h-28">
               <span className="text-3xl font-bold text-gray-900 mb-1">
                  {rating > 0 ? rating.toFixed(1) : 'N/A'}
               </span>
               <div className="flex gap-0.5 mb-1 text-[#FD8E1F]">
                  {[1, 2, 3, 4, 5].map((i) => (
                     <Star
                        key={i}
                        size={14}
                        fill={i <= Math.round(rating) ? 'currentColor' : 'none'}
                        strokeWidth={i <= Math.round(rating) ? 0 : 2}
                     />
                  ))}
               </div>
               <span className="text-xs text-gray-500 font-medium">
                  {totalRating > 0
                     ? `${totalRating} Reviews`
                     : 'No Reviews Yet'}
               </span>
            </div>

            {/* Chart Box */}
            <div className="bg-[#FFF8F0] p-0 rounded-md h-28 overflow-hidden relative">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                     <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#FD8E1F"
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
                  <div className="flex items-center gap-1 w-16 shrink-0 text-[#FD8E1F]">
                     <Star size={16} fill="currentColor" strokeWidth={0} />
                     <span className="text-gray-600 font-medium ml-1">
                        {r.stars} Star
                     </span>
                  </div>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                     <div
                        className="h-full bg-[#FD8E1F] rounded-full"
                        style={{ width: `${r.percent}%` }}
                     ></div>
                  </div>
                  <span className="w-8 text-right text-gray-600 font-medium">
                     {r.percent}%
                  </span>
               </div>
            ))}
         </div>
      </div>
   );
}
