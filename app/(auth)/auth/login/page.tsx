import Image from 'next/image';
import { MotionImageRight } from '@/app/components/Motion/Motion';
import LoginForm from '../../../components/auth/LoginForm/LoginForm';

const Login = () => {
   return (
      <main className="flex h-[88vh]">
         <div className="w-[45%] flex justify-center items-center bg-secondary">
            <MotionImageRight>
               <Image
                  src={'/login/login.png'}
                  alt="login Image"
                  width={500}
                  height={500}
               />
            </MotionImageRight>
         </div>
         <div className="w-1/2 flex justify-center items-center bg-white">
            <LoginForm />
         </div>
      </main>
   );
};

export default Login;
