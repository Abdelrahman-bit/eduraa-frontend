// Icons
import { VscSettings } from 'react-icons/vsc';
import { FaSearch } from 'react-icons/fa';

// Components
import { Button } from '@/components/ui/button';
import {
   InputGroup,
   InputGroupAddon,
   InputGroupInput,
} from '@/components/ui/input-group';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from '@/components/ui/sheet';

export default function Filter() {
   return (
      <div className="flex items-center justify-between py-10 ">
         <div className="flex gap-6">
            <Sheet>
               <SheetTrigger className="flex gap-2 rounded-none py-3 px-10 border border-primary-500 text-primary-700 text-button-medium font-semibold cursor-pointer hover:bg-primary-500 hover:text-white  items-center ">
                  <VscSettings /> Filters
               </SheetTrigger>
               <SheetContent side="left" className="w-80">
                  <SheetHeader>
                     <SheetTitle>Are you absolutely sure?</SheetTitle>
                     <SheetDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                     </SheetDescription>
                  </SheetHeader>
               </SheetContent>
            </Sheet>

            <InputGroup className="group rounded-none py-6 px-2 focus-within:ring-2 focus-within:ring-primary-500">
               <InputGroupInput
                  placeholder="Search..."
                  className="border-none focus-visible:ring-0"
               />
               <InputGroupAddon>
                  <FaSearch />
               </InputGroupAddon>
            </InputGroup>
         </div>
         <div className="flex items-center gap-6">
            <p className="text-body-md text-gray-scale-700">Sort By</p>
            <DropdownMenu>
               <DropdownMenuTrigger className="font-semibold border border-gray-scale-100 px-10 py-3 ">
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
         </div>
      </div>
   );
}
