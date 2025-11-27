import Image from 'next/image';
import SignupForm from '../../../components/auth/SignupForm/SignupForm';
import { MotionImageRight } from '@/app/components/global/Motion/Motion';

const SignUp = () => {
   return (
      <main className="flex flex-col md:flex-row h-screen md:h-[88vh]">
         <div className="w-full md:w-[45%] flex justify-center items-center bg-secondary p-4 md:p-0">
            <MotionImageRight>
               <Image
                  src={'/login/register.png'}
                  alt="register Image"
                  width={500}
                  height={500}
               />
            </MotionImageRight>
         </div>
         <div className="w-full md:w-1/2 flex justify-center items-center bg-white p-4 md:p-0">
            <SignupForm />
         </div>
      </main>
   );
};

export default SignUp;
