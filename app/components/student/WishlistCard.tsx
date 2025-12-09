'use client';
import React, { useState } from 'react';
import { Star, Heart, ShoppingCart } from 'lucide-react';

interface WishlistCardProps {
   id: number | string;
   image: string;
   title: string;
   rating?: number;
   reviews?: string;
   price?: number;
   originalPrice?: number;
   instructor: string;
   onRemove?: (id: number | string) => void;
}

const WishlistCard = ({
   id,
   image,
   title,
   rating,
   reviews,
   price,
   originalPrice,
   instructor,
   onRemove,
}: WishlistCardProps) => {
   const [isLiked, setIsLiked] = useState(true);

   const handleLikeClick = () => {
      setIsLiked(!isLiked);
      if (isLiked && onRemove) {
         onRemove(id);
      }
   };

   return (
      <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
         <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden shrink-0">
            <img
               src={image || 'https://via.placeholder.com/300'}
               alt={title}
               className="w-full h-full object-cover"
            />
         </div>

         <div className="flex-1 space-y-2 text-center md:text-left">
            <h3 className="font-bold text-gray-900 text-lg line-clamp-2">
               {title}
            </h3>

            <p className="text-sm text-gray-500">
               By{' '}
               <span className="text-gray-800 font-medium">{instructor}</span>
            </p>
         </div>

         <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
            <button
               onClick={handleLikeClick}
               className={`p-3 rounded transition-all duration-300 ${
                  isLiked
                     ? 'bg-[#FFEEE8] text-[#FF6636]'
                     : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
               }`}
            >
               <Heart
                  className={`w-6 h-6 ${isLiked ? 'fill-[#FF6636]' : ''}`}
               />
            </button>
         </div>
      </div>
   );
};

export default WishlistCard;
