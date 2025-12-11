'use client';
import { Upload, Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { updateUserAvatar } from '@/app/services/userService';
import toast from 'react-hot-toast';

interface PhotoUploadProps {
   currentAvatar?: string;
   onUploadSuccess?: (newAvatarUrl: string) => void;
}

export const PhotoUpload = ({
   currentAvatar,
   onUploadSuccess,
}: PhotoUploadProps) => {
   const [isUploading, setIsUploading] = useState(false);
   const [previewUrl, setPreviewUrl] = useState(currentAvatar);
   const fileInputRef = useRef<HTMLInputElement>(null);

   const handleFileSelect = async (
      event: React.ChangeEvent<HTMLInputElement>
   ) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsUploading(true);

      try {
         // Upload and update avatar
         const updatedUser = await updateUserAvatar(file);

         // Update preview
         setPreviewUrl(updatedUser.avatar);

         // Notify parent component
         if (onUploadSuccess && updatedUser.avatar) {
            onUploadSuccess(updatedUser.avatar);
         }

         toast.success('Profile picture updated successfully!');
      } catch (error: any) {
         console.error('Upload error:', error);
         toast.error(error.message || 'Failed to upload profile picture');
      } finally {
         setIsUploading(false);
         // Reset file input
         if (fileInputRef.current) {
            fileInputRef.current.value = '';
         }
      }
   };

   const handleButtonClick = () => {
      fileInputRef.current?.click();
   };

   return (
      <div className="w-full lg:w-[280px] shrink-0">
         <div className="bg-gray-50 border border-dashed border-gray-300 rounded-sm p-6 flex flex-col items-center justify-center text-center h-80 relative overflow-hidden group">
            <div className="w-32 h-32 bg-gray-200 mb-4 overflow-hidden relative rounded-full">
               <img
                  src={previewUrl || '/api/placeholder/150/150'}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
               />
               {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                     <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
               )}
            </div>

            <input
               ref={fileInputRef}
               type="file"
               accept="image/jpeg,image/jpg,image/png,image/webp"
               onChange={handleFileSelect}
               className="hidden"
               disabled={isUploading}
            />

            <button
               type="button"
               onClick={handleButtonClick}
               disabled={isUploading}
               className="flex items-center gap-2 bg-white border border-gray-200 hover:border-orange-500 hover:text-orange-500 text-gray-700 px-4 py-2 rounded-sm text-xs font-semibold transition-all shadow-sm z-10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
               {isUploading ? (
                  <>
                     <Loader2 size={14} className="animate-spin" />
                     Uploading...
                  </>
               ) : (
                  <>
                     <Upload size={14} /> Upload Photo
                  </>
               )}
            </button>

            <p className="text-[10px] text-gray-400 mt-3 max-w-[150px] leading-relaxed">
               Image size should be under 1MB and image ratio needs to be 1:1
            </p>
         </div>
      </div>
   );
};
