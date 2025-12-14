import Image from 'next/image';
import { MotionImageRight } from '@/app/components/global/Motion/Motion';
import LoginForm from '../../../components/auth/LoginForm/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
   title: 'Sign In',
};

const Login = () => {
   return (
      <main className="flex flex-col md:flex-row h-screen md:h-[88vh]">
         <div className="w-full md:w-[45%] flex justify-center items-center bg-secondary p-4 md:p-0">
            <MotionImageRight>
               <Image
                  src={'/login/login.png'}
                  alt="login Image"
                  width={500}
                  height={500}
               />
            </MotionImageRight>
         </div>
         <div className="w-full md:w-1/2 flex justify-center items-center bg-white p-4 md:p-0">
            <LoginForm />
         </div>
      </main>
   );
};

export default Login;
