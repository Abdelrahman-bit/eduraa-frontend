'use client';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Button from '../global/Button/Button';
import Link from 'next/link';

const Header = () => {
   const pathName = usePathname();
   const signupPath = pathName.includes('signup');
   const loginPath = pathName.includes('login');
   console.log(pathName);

   return (
      <div className="w-full flex justify-center px-4 sm:px-6 lg:px-8">
         <header className="flex w-full max-w-7xl py-4 justify-between items-center">
            <div className="flex">
               <Image
                  src={'/GraduationCap.png'}
                  alt="eTutor Logo"
                  width={40}
                  height={40}
               />
               <a href="/" className="text-2xl font-bold ml-2">
                  ETutor
               </a>
            </div>
            <div className="flex">
               <nav className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 text-sm sm:text-base">
                  {!signupPath && (
                     <p className="hidden sm:block">Don't have an account?</p>
                  )}
                  {!loginPath && (
                     <p className="hidden sm:block">Already have an account?</p>
                  )}
                  <Link href={signupPath ? './login' : './signup'}>
                     <Button
                        text={`${signupPath ? 'Login' : 'Create an Account'}`}
                        type="secondary"
                     />
                  </Link>
               </nav>
            </div>
         </header>
      </div>
   );
};

export default Header;
