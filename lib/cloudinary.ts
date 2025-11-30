// Cloudinary configuration and utilities
const CLOUDINARY_CLOUD_NAME =
   process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_UPLOAD_PRESET =
   process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

export interface CloudinaryUploadResponse {
   public_id: string;
   url: string;
   secure_url: string;
   resource_type: string;
   type: string;
   bytes: number;
   duration?: number;
   width?: number;
   height?: number;
}

export const uploadToCloudinary = async (
   file: File,
   resourceType: 'image' | 'video' = 'image'
): Promise<CloudinaryUploadResponse> => {
   const formData = new FormData();
   formData.append('file', file);
   formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
   formData.append('resource_type', resourceType);

   const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      {
         method: 'POST',
         body: formData,
      }
   );

   if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${response.statusText}`);
   }

   return response.json();
};

// export const deleteFromCloudinary = async (publicId: string) => {
//    // This would typically be done from the backend for security
//    // For now, we'll just log it
//    console.log('Delete from Cloudinary:', publicId);
// };

export const getCloudinaryUrl = (
   publicId: string,
   options?: Record<string, any>
) => {
   const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;
   const transformations = options
      ? Object.entries(options)
           .map(([k, v]) => `${k}_${v}`)
           .join(',')
      : '';
   return `${baseUrl}${transformations ? `/${transformations}` : ''}/${publicId}`;
};
