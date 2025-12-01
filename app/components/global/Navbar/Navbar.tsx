// NEXT
import Link from 'next/link';
import Image from 'next/image';

// Components
import Button from '../Button/Button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Icons
import { IoIosMoon } from 'react-icons/io';
import { IoMdNotificationsOutline } from 'react-icons/io';

export default function Navbar() {
   return (
      <>
         {/* Secondary NavBar  */}
         <nav className="flex justify-between bg-gray-scale-900 text-gray-scale-500 px-6 text-body-md font-medium">
            <ul className="flex gap-8 p-4">
               <li>
                  <Link href="/">Home</Link>
               </li>
               <li>
                  <Link href="/courses">Courses</Link>
               </li>
               <li>
                  <Link href="/about">About</Link>
               </li>
               <li>
                  <Link href="/contact">Contact</Link>
               </li>
            </ul>
            <ul className="flex gap-8 p-4">
               <li>
                  {/* //TODO */}
                  <Link href="/mode">Dark</Link>
               </li>
               <li>
                  {/* //TODO */}
                  <Link href="/language">English</Link>
               </li>
            </ul>
         </nav>
         {/* Main NavBar  */}
         <nav className="flex justify-between px-8 py-4 border-b-2 border-gray-scale-100">
            <ul className="flex gap-6 items-center">
               {/* Todo  */}
               <li>
                  <Image
                     src="/GraduationCap.png"
                     alt="eTutor Logo"
                     width={40}
                     height={40}
                  />
               </li>
               <li>
                  <DropdownMenu>
                     <DropdownMenuTrigger className="font-semibold ">
                        Browse
                     </DropdownMenuTrigger>
                     <DropdownMenuContent>
                        <DropdownMenuItem className="text-md p-4">
                           <Link href="/instructors">Instructors</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-md p-4">
                           <Link href="/instructors">Courses</Link>
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </li>
               <li>
                  <input
                     type="text"
                     placeholder="What do you want to learn"
                     className="w-106 h-12 border-2 border-gray-scale-100 px-2"
                  />
               </li>
            </ul>
            <ul className="flex gap-3 items-center">
               {/* Icons */}
               <li>
                  <ul className="flex gap-3 text-gray-scale-900">
                     <li>
                        <IoIosMoon size={24} />
                     </li>
                     <li>
                        <IoMdNotificationsOutline size={24} />
                     </li>
                  </ul>
               </li>
               <li>
                  <Link href="/auth/signup">
                     <Button text="Create an Account" type="secondary" />
                  </Link>
               </li>
               <li>
                  <Link href="/auth/login">
                     <Button text="Sign In" type="primary" />
                  </Link>
               </li>
            </ul>
         </nav>
      </>
   );
}
