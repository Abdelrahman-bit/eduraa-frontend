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

// Utility function to apply Cloudinary transformations to existing URLs
export function getOptimizedCloudinaryUrl(url: string, width?: number): string {
   // Check if it's a Cloudinary URL
   if (!url || !url.includes('cloudinary.com')) {
      return url;
   }

   // If it's already transformed, return as is
   if (url.includes('/w_') || url.includes('/f_auto')) {
      return url;
   }

   try {
      // Parse the Cloudinary URL
      // Format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{path}
      const urlParts = url.split('/upload/');
      if (urlParts.length !== 2) {
         return url;
      }

      const baseUrl = urlParts[0];
      const pathWithVersion = urlParts[1];

      // Determine optimal width based on use case
      const targetWidth = width || 800; // Default to 800px

      // Apply Cloudinary transformations
      // w_800,c_limit: Limit width to 800px, maintain aspect ratio
      // f_auto: Auto format (WebP, AVIF when supported)
      // q_auto: Auto quality based on content
      const transformations = `w_${targetWidth},c_limit,f_auto,q_auto:good`;

      return `${baseUrl}/upload/${transformations}/${pathWithVersion}`;
   } catch (error) {
      console.error('Error transforming Cloudinary URL:', error);
      return url;
   }
}

// Helper for different image sizes
export const CloudinaryPresets = {
   thumbnail: 200,
   small: 400,
   medium: 800,
   large: 1200,
   avatar: 100,
} as const;
