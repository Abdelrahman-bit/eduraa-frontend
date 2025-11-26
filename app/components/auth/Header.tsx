'use client';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Button from '../Button/Button';
import Link from 'next/link';

const Header = () => {
   const pathName = usePathname();
   const signupPath = pathName.includes('signup');
   const loginPath = pathName.includes('login');
   console.log(pathName);

   return (
      <div className="w-full flex justify-center">
         <header className="flex w-7/10 py-4 justify-between items-center ">
            <div className="flex">
               <Image
                  src={'/GraduationCap.png'}
                  alt="eTutor Logo"
                  width={40}
                  height={40}
               />
               <h1 className="text-2xl font-bold ml-2">ETutor</h1>
            </div>
            <div className="flex">
               <nav className="flex justify-center items-center gap-6">
                  {!signupPath && <p>Don't have an account?</p>}
                  {!loginPath && <p>Already have an account?</p>}
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
