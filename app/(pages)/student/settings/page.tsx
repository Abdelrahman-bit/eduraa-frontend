'use client';
import React, { useState, useRef } from 'react';
import { Camera, Eye, EyeOff } from 'lucide-react';

export default function StudentSettings() {
   // save form data in state
   const [formData, setFormData] = useState({
      // default values come from backend in real app (must be ediite)
      firstName: 'Fristname',
      lastName: 'Lastname',
      username: 'username123',
      email: 'user@example.com',
      title: 'Web Designer & Best-Selling Instructor',
   });
   const [imagePreview, setImagePreview] = useState(
      'https://ui-avatars.com/api/?name=Kevin+Gilbert&background=1D2026&color=fff&size=400'
   );

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
   };

   const fileInputRef = useRef<HTMLInputElement>(null);

   const handleImageClick = () => {
      fileInputRef.current?.click();
   };

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (file) {
         const imageUrl = URL.createObjectURL(file);

         setImagePreview(imageUrl);
      }
   };
   return (
      <div className="space-y-10">
         <section className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-8">
               Account Settings
            </h2>

            <div className="flex flex-col md:flex-row gap-10">
               <div className="w-full md:w-64 shrink-0">
                  <div
                     className="relative group cursor-pointer"
                     onClick={handleImageClick}
                  >
                     <div className="w-full aspect-square bg-gray-50 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center p-4 hover:border-[#FF6636] transition-colors">
                        <img
                           src={imagePreview}
                           alt="Profile"
                           className="w-full h-full object-cover absolute inset-0 opacity-50 group-hover:opacity-30 transition-opacity"
                        />
                        <div className="relative z-10 flex flex-col items-center gap-2 text-gray-600 group-hover:text-[#FF6636]">
                           <Camera size={32} />
                           <span className="text-sm font-semibold">
                              Upload Photo
                           </span>
                        </div>
                     </div>

                     <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                     />
                  </div>
                  <p className="text-xs text-center text-gray-400 mt-4 leading-relaxed">
                     Image size should be under 1MB and image ratio needs to be
                     1:1
                  </p>
               </div>

               <div className="flex-1 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                     <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-900">
                           First Name
                        </label>
                        <input
                           type="text"
                           name="firstName"
                           value={formData.firstName}
                           onChange={handleChange}
                           className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-[#FF6636] transition-colors"
                        />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-900">
                           Last Name
                        </label>
                        <input
                           type="text"
                           name="lastName"
                           value={formData.lastName}
                           onChange={handleChange}
                           className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-[#FF6636] transition-colors"
                        />
                     </div>
                  </div>

                  <div className="space-y-1.5">
                     <label className="text-sm font-medium text-gray-900">
                        Username
                     </label>
                     <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-[#FF6636] transition-colors"
                     />
                  </div>

                  <div className="space-y-1.5">
                     <label className="text-sm font-medium text-gray-900">
                        Email
                     </label>
                     <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-[#FF6636] transition-colors"
                     />
                  </div>

                  <div className="space-y-1.5">
                     <label className="text-sm font-medium text-gray-900">
                        Title
                     </label>
                     <div className="relative">
                        <input
                           type="text"
                           name="title"
                           value={formData.title}
                           onChange={handleChange}
                           maxLength={50} // prevent typing more than 50 chars
                           className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-[#FF6636] transition-colors pr-12"
                           placeholder="Your title, profession or small biography"
                        />

                        <span className="absolute right-3 top-3.5 text-xs text-gray-400 font-medium">
                           {formData.title.length}/50
                        </span>
                     </div>
                  </div>

                  {/* زرار الحفظ */}
                  <button className="bg-[#FF6636] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#e55a2f] transition-colors">
                     Save Changes
                  </button>
               </div>
            </div>
         </section>

         {/* ================= القسم الثاني: تغيير كلمة السر ================= */}
         <section className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-8">
               Change password
            </h2>

            <div className="space-y-5 max-w-2xl">
               {/* كلمة السر الحالية */}
               <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-900">
                     Current Password
                  </label>
                  <div className="relative">
                     <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-[#FF6636]"
                     />
                     <Eye className="absolute right-3 top-3.5 text-gray-400 w-5 h-5 cursor-pointer hover:text-gray-600" />
                  </div>
               </div>

               {/* كلمة السر الجديدة */}
               <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-900">
                     New Password
                  </label>
                  <div className="relative">
                     <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-[#FF6636]"
                     />
                     <EyeOff className="absolute right-3 top-3.5 text-gray-400 w-5 h-5 cursor-pointer hover:text-gray-600" />
                  </div>
               </div>

               {/* تأكيد كلمة السر */}
               <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-900">
                     Confirm Password
                  </label>
                  <div className="relative">
                     <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-[#FF6636]"
                     />
                     <EyeOff className="absolute right-3 top-3.5 text-gray-400 w-5 h-5 cursor-pointer hover:text-gray-600" />
                  </div>
               </div>

               <button className="bg-[#FF6636] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#e55a2f] transition-colors mt-2">
                  Change Password
               </button>
            </div>
         </section>
      </div>
   );
}
