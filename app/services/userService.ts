import { apiClient } from '@/lib/http';
import { uploadToCloudinary } from '@/lib/cloudinary';

export interface UserProfile {
   id: number;
   email: string;
   firstname: string;
   lastname: string;
   phone?: string;
   headline?: string;
   biography?: string;
   avatar?: string;
   role: 'student' | 'instructor' | 'admin';
}

export interface UpdateProfileData {
   firstname: string;
   lastname: string;
   phone?: string;
   title?: string;
   biography?: string;
}

export interface UpdatePasswordData {
   currentPassword: string;
   newPassword: string;
   confirmPassword: string;
}

export interface UserProfileResponse {
   success: boolean;
   user: UserProfile;
}

export interface UpdateAvatarResponse {
   success: boolean;
   message: string;
   user: UserProfile;
}

// ============================================================================
// Service Functions
// ============================================================================

/**
 * Fetch the current user's profile data
 * @returns User profile data
 */
export const getUserProfile = async (): Promise<UserProfile> => {
   try {
      const { data } =
         await apiClient.get<UserProfileResponse>('/user/profile');
      return data.user;
   } catch (error: any) {
      throw new Error(
         error.response?.data?.message || 'Failed to fetch user profile'
      );
   }
};

/**
 * Update user profile information (name, phone, title, biography)
 * @param profileData - The profile data to update
 * @returns Updated user profile
 */
export const updateUserProfile = async (
   profileData: UpdateProfileData
): Promise<UserProfile> => {
   try {
      const { data } = await apiClient.patch<UserProfileResponse>(
         '/user/profile',
         profileData
      );
      return data.user;
   } catch (error: any) {
      throw new Error(
         error.response?.data?.message || 'Failed to update profile'
      );
   }
};

/**
 * Update user password
 * @param passwords - Current and new password
 * @returns Success message
 */
export const updateUserPassword = async (
   passwords: UpdatePasswordData
): Promise<{ message: string }> => {
   try {
      const { data } = await apiClient.patch('/user/profile/updatePassword', {
         currentPassword: passwords.currentPassword,
         newPassword: passwords.newPassword,
         confirmPassword: passwords.confirmPassword,
      });
      return data;
   } catch (error: any) {
      throw new Error(
         error.response?.data?.message || 'Failed to update password'
      );
   }
};

/**
 * Validate image file before upload
 * @param file - The file to validate
 * @throws Error if validation fails
 */
const validateImageFile = (file: File): void => {
   // Check if it's an image
   if (!file.type.startsWith('image/')) {
      throw new Error('Please select an image file');
   }

   // Check file size (max 1MB)
   const maxSize = 1024 * 1024; // 1MB in bytes
   if (file.size > maxSize) {
      throw new Error('Image size must be less than 1MB');
   }

   // Accepted image types
   const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
   if (!acceptedTypes.includes(file.type)) {
      throw new Error('Please upload a JPG, PNG, or WebP image');
   }
};

/**
 * Validate image aspect ratio (should be close to 1:1 for profile pictures)
 * @param file - The image file to check
 * @returns Promise that resolves if aspect ratio is acceptable
 */
const validateImageAspectRatio = (file: File): Promise<void> => {
   return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
         URL.revokeObjectURL(objectUrl);
         const aspectRatio = img.width / img.height;

         // Allow some tolerance (between 0.8 and 1.2 is acceptable)
         if (aspectRatio < 0.8 || aspectRatio > 1.2) {
            reject(
               new Error(
                  'Image should have a square aspect ratio (1:1) for best results'
               )
            );
         } else {
            resolve();
         }
      };

      img.onerror = () => {
         URL.revokeObjectURL(objectUrl);
         reject(new Error('Failed to load image'));
      };

      img.src = objectUrl;
   });
};

/**
 * Upload profile picture to Cloudinary and update user avatar
 * @param file - The image file to upload
 * @returns Updated user profile with new avatar URL
 */
export const updateUserAvatar = async (file: File): Promise<UserProfile> => {
   try {
      // Validate file
      validateImageFile(file);

      // Validate aspect ratio (warning only, doesn't block upload)
      try {
         await validateImageAspectRatio(file);
      } catch (aspectError: any) {
         console.warn(aspectError.message);
         // Continue with upload even if aspect ratio is not perfect
      }

      // Upload to Cloudinary
      const uploadResponse = await uploadToCloudinary(file, 'image');

      // Update user profile with new avatar URL
      const { data } = await apiClient.patch<UpdateAvatarResponse>(
         '/user/profile/updateProfilePic',
         {
            avatar: uploadResponse.secure_url,
            // avatarPublicId: uploadResponse.public_id,
         }
      );

      return data.user;
   } catch (error: any) {
      // If it's already a formatted error, throw it as is
      if (error.message) {
         throw error;
      }
      // Otherwise format it
      throw new Error(
         error.response?.data?.message || 'Failed to upload profile picture'
      );
   }
};
