'use client';

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
   submitRating,
   getMyRating,
   Rating,
} from '@/app/services/ratingService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface RatingFormProps {
   courseId: string;
   onSuccess?: () => void;
}

export function RatingForm({ courseId, onSuccess }: RatingFormProps) {
   const queryClient = useQueryClient();
   const [selectedRating, setSelectedRating] = useState(0);
   const [hoverRating, setHoverRating] = useState(0);
   const [review, setReview] = useState('');
   const [isEditing, setIsEditing] = useState(false);

   // Fetch existing rating
   const { data: existingRating, isLoading } = useQuery({
      queryKey: ['myRating', courseId],
      queryFn: () => getMyRating(courseId),
   });

   // Set form state from existing rating
   useEffect(() => {
      if (existingRating) {
         setSelectedRating(existingRating.rating);
         setReview(existingRating.review || '');
      }
   }, [existingRating]);

   // Submit mutation
   const { mutate, isPending } = useMutation({
      mutationFn: (payload: { rating: number; review?: string }) =>
         submitRating(courseId, payload),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['myRating', courseId] });
         queryClient.invalidateQueries({
            queryKey: ['courseRatingStats', courseId],
         });
         setIsEditing(false);
         onSuccess?.();
      },
   });

   const handleSubmit = () => {
      if (selectedRating < 1 || selectedRating > 5) return;
      mutate({
         rating: selectedRating,
         review: review.trim() || undefined,
      });
   };

   const displayRating = hoverRating || selectedRating;

   if (isLoading) {
      return (
         <div className="p-4 bg-gray-50 rounded-lg animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-3"></div>
            <div className="flex gap-1 mb-3">
               {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-8 h-8 bg-gray-200 rounded"></div>
               ))}
            </div>
         </div>
      );
   }

   // If already rated and not editing, show rating display
   if (existingRating && !isEditing) {
      return (
         <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-100">
            <div className="flex items-center justify-between mb-2">
               <h3 className="font-semibold text-gray-900">Your Rating</h3>
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-primary-500 hover:text-primary-600"
               >
                  Edit
               </Button>
            </div>
            <div className="flex items-center gap-2 mb-2">
               <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                     <Star
                        key={star}
                        size={24}
                        className={
                           star <= existingRating.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                        }
                     />
                  ))}
               </div>
               <span className="font-bold text-lg text-gray-900">
                  {existingRating.rating}.0
               </span>
            </div>
            {existingRating.review && (
               <p className="text-sm text-gray-600 mt-2 italic">
                  &ldquo;{existingRating.review}&rdquo;
               </p>
            )}
         </div>
      );
   }

   return (
      <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
         <h3 className="font-semibold text-gray-900 mb-3">
            {existingRating ? 'Update Your Rating' : 'Rate This Course'}
         </h3>

         {/* Star Rating */}
         <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-1">
               {[1, 2, 3, 4, 5].map((star) => (
                  <button
                     key={star}
                     type="button"
                     onClick={() => setSelectedRating(star)}
                     onMouseEnter={() => setHoverRating(star)}
                     onMouseLeave={() => setHoverRating(0)}
                     className="p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                  >
                     <Star
                        size={28}
                        className={`transition-colors ${
                           star <= displayRating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300 hover:text-yellow-200'
                        }`}
                     />
                  </button>
               ))}
            </div>
            {displayRating > 0 && (
               <span className="text-sm text-gray-600">
                  {displayRating === 1 && 'Poor'}
                  {displayRating === 2 && 'Fair'}
                  {displayRating === 3 && 'Good'}
                  {displayRating === 4 && 'Very Good'}
                  {displayRating === 5 && 'Excellent'}
               </span>
            )}
         </div>

         {/* Review Text */}
         <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
               Review (Optional)
            </label>
            <Textarea
               value={review}
               onChange={(e) => setReview(e.target.value)}
               placeholder="Share your experience with this course..."
               rows={3}
               maxLength={1000}
               className="resize-none"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">
               {review.length}/1000
            </p>
         </div>

         {/* Actions */}
         <div className="flex gap-2">
            <Button
               onClick={handleSubmit}
               disabled={selectedRating < 1 || isPending}
               className="flex-1"
            >
               {isPending
                  ? 'Submitting...'
                  : existingRating
                    ? 'Update Rating'
                    : 'Submit Rating'}
            </Button>
            {isEditing && (
               <Button
                  variant="outline"
                  onClick={() => {
                     setIsEditing(false);
                     setSelectedRating(existingRating?.rating || 0);
                     setReview(existingRating?.review || '');
                  }}
               >
                  Cancel
               </Button>
            )}
         </div>
      </div>
   );
}
