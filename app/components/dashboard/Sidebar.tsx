'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut, GraduationCap } from 'lucide-react';
import { getSidebarItems } from '../dashboard/dashboardData';
import { useQuery } from '@tanstack/react-query';
import {
   getJoinRequests,
   getInReviewCourses,
} from '@/app/services/adminService';

interface SidebarProps {
   role: 'instructor' | 'student' | 'admin';
   onLinkClick?: () => void;
}

export default function Sidebar({ role, onLinkClick }: SidebarProps) {
   const { data: joinRequests } = useQuery({
      queryKey: ['joinRequests'],
      queryFn: getJoinRequests,
      enabled: role === 'admin',
   });

   const { data: courseRequests } = useQuery({
      queryKey: ['inReviewCourses'],
      queryFn: getInReviewCourses,
      enabled: role === 'admin',
   });

   const navItems = getSidebarItems(role, {
      joinRequests: joinRequests?.length,
      courseRequests: courseRequests?.length,
   });
   const pathname = usePathname();

   return (
      <aside className="w-64 bg-[#1D2026] text-gray-400 flex flex-col h-screen overflow-y-auto border-r border-gray-800">
         {/* Logo Area */}
         <Link href="/" className="no-underline">
            <div className="h-20 flex items-center px-6 border-b border-gray-800 cursor-pointer">
               <div className="flex items-center gap-2 text-white font-bold text-xl">
                  <span className="text-orange-500 text-2xl">
                     <GraduationCap />
                  </span>{' '}
                  E-tutor
               </div>
            </div>
         </Link>

         {/* Navigation Items */}
         <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item, index) => (
               <Link
                  key={index}
                  href={item.href}
                  onClick={onLinkClick}
                  className={`flex items-center justify-between px-6 py-3 hover:bg-gray-800 hover:text-white transition-colors ${
                     pathname === item.href ? 'bg-[#ff5b2e] text-white' : ''
                  }`}
               >
                  <div className="flex items-center gap-3">
                     <item.icon size={20} />
                     <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {'badge' in item && item.badge && (
                     <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {item.badge}
                     </span>
                  )}
               </Link>
            ))}
         </nav>

         {/* Footer of Sidebar */}
         <div className="p-6 border-t border-gray-800 shrink-0">
            <button className="flex items-center gap-3 text-sm font-medium hover:text-white transition-colors w-full">
               <LogOut size={20} />
               Sign-out
            </button>
         </div>
      </aside>
   );
}
