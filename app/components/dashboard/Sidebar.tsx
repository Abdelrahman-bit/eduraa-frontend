// components/dashboard/Sidebar.tsx

import Link from 'next/link';
import { LogOut, GraduationCap } from 'lucide-react';
import { getSidebarItems } from '../dashboard/dashboardData';

interface SidebarProps {
   role: 'instructor' | 'student';
}

export default function Sidebar({ role }: SidebarProps) {
   const navItems = getSidebarItems(role);

   return (
      <aside className="w-64 bg-[#1D2026] text-gray-400 flex flex-col h-screen fixed left-0 top-0 border-r border-gray-800 z-50">
         {/* Logo Area */}
         <div className="h-20 flex items-center px-6 border-b border-gray-800">
            <div className="flex items-center gap-2 text-white font-bold text-xl">
               <span className="text-orange-500 text-2xl">
                  <GraduationCap />
               </span>{' '}
               E-tutor
            </div>
         </div>

         {/* Navigation Items */}
         <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item, index) => (
               <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center justify-between px-6 py-3 hover:bg-gray-800 hover:text-white transition-colors ${
                     item.label === 'Create New Course'
                        ? 'bg-[#ff5b2e] text-white'
                        : ''
                  }`}
               >
                  <div className="flex items-center gap-3">
                     <item.icon size={20} />
                     <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                     <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {item.badge}
                     </span>
                  )}
               </Link>
            ))}
         </nav>

         {/* Footer of Sidebar */}
         <div className="p-6 border-t border-gray-800">
            <button className="flex items-center gap-3 text-sm font-medium hover:text-white transition-colors w-full">
               <LogOut size={20} />
               Sign-out
            </button>
         </div>
      </aside>
   );
}
