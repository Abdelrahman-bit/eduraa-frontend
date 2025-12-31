'use client';
import React from 'react';
import Button from '../../global/Button/Button';
import Image from 'next/image';
import Link from 'next/link';
import useBearStore from '@/app/store/useStore';

export default function Hero() {
   const { isAuthenticated } = useBearStore();
   return (
      <section className="bg-gray-scale-50 py-16 md:py-24 lg:min-h-[70vh] flex items-center">
         <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-12 lg:gap-8 items-center justify-between">
            <div className="flex flex-col gap-6 lg:gap-8 items-start w-full lg:w-1/2 text-center lg:text-left">
               <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-scale-900 mx-auto lg:mx-0">
                  Learn with expert <br className="hidden md:block" /> Anytime
                  anywhere
               </h1>

               <p className="text-base md:text-xl font-light text-gray-scale-700 mx-auto lg:mx-0">
                  Our mission is to help people to find the best course{' '}
                  <br className="hidden md:block" />
                  online and learn with expert anytime, anywhere.
               </p>
               {!isAuthenticated && (
                  <div className="w-full flex justify-center lg:justify-start">
                     <Link href="/auth/signup">
                        <Button text="Create Account" type="primary" />
                     </Link>
                  </div>
               )}
            </div>

            {/* Image Section */}
            <div className="w-full lg:w-1/2 hidden md:block">
               <Image
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  width={700}
                  height={500}
                  src="/hero.jpg"
                  alt="hero"
                  priority
                  className=" w-full h-auto"
               />
            </div>
         </div>
      </section>
   );
}
