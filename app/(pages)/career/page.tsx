import Image from 'next/image';
import React from 'react';
import { CheckCircle } from 'lucide-react';
import {
   MotionContainer,
   MotionImageRight,
   MotionImageUp,
   MotionItem,
   MotionScale,
} from '../../components/Motion/Motion';
import { BreadcrumbHeader } from '../../components/Breadcrumb/Breadcrumb';

// --- Types ---
type Partner = { name: string; src: string };
const partners: Partner[] = [
   { name: 'Netflix', src: '/netflix.svg' },
   { name: 'YouTube', src: '/youtube.svg' },
   { name: 'Google', src: '/google.svg' },
   { name: 'Lenovo', src: '/lenovo.svg' },
   { name: 'Slack', src: '/slack.svg' },
   { name: 'Verizon', src: '/verizon.svg' },
   { name: 'Lexmark', src: '/lexmark.svg' },
   { name: 'Microsoft', src: '/microsoft.svg' },
];
const BenefitCard: React.FC<{
   title: string;
   subtitle?: string;
   bg?: string;
}> = ({ title, subtitle, bg }) => (
   <div className={`p-6 rounded-lg shadow-sm ${bg ?? 'bg-white'}`}>
      <h4 className="font-semibold text-sm mb-2">{title}</h4>
      {subtitle && <p className="text-xs text-gray-600">{subtitle}</p>}
   </div>
);

export default function CareerPage() {
   return (
      <main className="min-h-screen bg-gray-50 text-gray-800">
         <BreadcrumbHeader title="Career" activePage="Career" />
         {/* HERO */}
         <section className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
               <div className="lg:col-span-6">
                  <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight">
                     Join the most incredible & creative team.
                  </h1>
                  <p className="mt-4 text-gray-600 max-w-xl">
                     Proin gravida enim augue, dapibus ultricies eros feugiat
                     et. Pellentesque bibendum orci felis, sit amet efficitur
                     felis lacinia ac. Mauris gravida justo ac nunc consectetur.
                  </p>
                  <button className="mt-8 inline-block bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded">
                     View Open Positions
                  </button>
               </div>

               <div className="lg:col-span-6 flex justify-center lg:justify-end">
                  <div className="w-full max-w-sm">
                     <Image
                        src="/career/career_hero.png"
                        alt="hero"
                        width={540}
                        height={540}
                        className="rounded-lg shadow-lg object-cover"
                     />
                  </div>
               </div>
            </div>
         </section>

         {/* WHY JOIN */}
         <section className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
               <div className="lg:col-span-6 ">
                  <div className="bg-gray-100 rounded overflow-hidden ">
                     <Image
                        src="/career/career2.png"
                        alt="p1"
                        width={400}
                        height={400}
                        className="object-cover h-full w-full"
                     />
                  </div>
               </div>

               <div className="lg:col-span-6">
                  <h3 className="text-2xl font-semibold">
                     Why you will join our team
                  </h3>
                  <p className="mt-3 text-gray-600">
                     Quisque leo leo, suscipit sed arcu sit amet, iaculis
                     feugiat felis. Vestibulum non consectetur tortor.
                  </p>

                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                        <div>
                           <h3 className="font-semibold mb-2">
                              Ut justo ligula, vehicula sed sagittis vel.
                           </h3>
                           <p className="text-gray-600 text-sm">
                              Lorem elit. Vel facilisis nunc aliquet quis enim.
                              tortor felis tempor felis tempor felis, risus
                              tempor felis, risus tempor at, vestibulum velit.
                           </p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                        <div>
                           <h3 className="font-semibold mb-2">
                              Aenean vitae leo non praesent ullamcorper ac.
                           </h3>
                           <p className="text-gray-600 text-sm">
                              Lorem elit. Vel facilisis nunc aliquet at,
                              praesent ullamcorper ac lorem ut risus lectus
                              gravida justo ac velit, vel et at risque morbi
                              fringilla.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* PERKS & BENEFITS */}
         <section className="max-w-7xl mx-auto px-6 py-12">
            <h3 className="text-center text-2xl font-semibold mb-8">
               Our Perks & Benefits
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               <BenefitCard
                  title="Healthy Food & Snacks"
                  subtitle="Enjoy healthy snacks at office"
                  bg="bg-rose-50"
               />
               <BenefitCard
                  title="Personal Career Growth"
                  subtitle="Training & mentorships"
                  bg="bg-violet-50"
               />
               <BenefitCard
                  title="Vacation & Paid Time Off"
                  subtitle="Flexible vacation policy"
                  bg="bg-emerald-50"
               />
               <BenefitCard
                  title="Special Allowance & Bonuse"
                  subtitle="Performance bonuses"
                  bg="bg-amber-50"
               />

               <BenefitCard
                  title="Competitive Salary"
                  subtitle="Market competitive"
                  bg="bg-green-50"
               />
               <BenefitCard
                  title="Well-being memberships"
                  subtitle="Gym & wellness"
                  bg="bg-rose-50"
               />
               <BenefitCard
                  title="Maternity/Paternity Benefits"
                  subtitle="Family-friendly"
                  bg="bg-gray-50"
               />
               <BenefitCard
                  title="Eduguard Annual Events"
                  subtitle="Team events"
                  bg="bg-violet-50"
               />
            </div>
         </section>

         {/* GALLERY / ABOUT */}
         <section className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
               <div className="lg:col-span-5">
                  <p className="text-sm text-orange-500 font-semibold">
                     OUR GALLERY
                  </p>
                  <h3 className="text-2xl font-semibold mt-2">
                     We have been here almost 17 years
                  </h3>
                  <p className="mt-4 text-gray-600">
                     Fusce lobortis leo augue, sit amet tristique nisi commodo
                     in. Aliquam ac libero quis tellus venenatis imperdiet.
                  </p>
               </div>

               <div className="lg:col-span-7 grid grid-cols-3 gap-3">
                  <div className="col-span-4 row-span-2 overflow-hidden rounded">
                     <Image
                        src="/about3.svg"
                        width={300}
                        height={300}
                        alt="g1"
                        className="object-cover h-full w-full"
                     />
                  </div>
               </div>
            </div>
         </section>

         {/* COMPANIES / TRUST */}
         <section className=" mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               <MotionContainer className="lg:col-span-4 space-y-2">
                  <MotionItem>
                     <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                        We Just keep growing with 6.3k Companies
                     </h2>
                  </MotionItem>
                  <MotionItem>
                     <p className="text-gray-500 text-sm">
                        Nullam egestas tellus at enim ornare tristique.
                     </p>
                  </MotionItem>
               </MotionContainer>
               <div className="lg:col-span-8">
                  <MotionContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {partners.map((partner, index) => (
                        <MotionScale
                           key={index}
                           className="relative flex items-center justify-center h-20 bg-white border border-gray-100 shadow-sm rounded-lg hover:shadow-md transition-shadow p-4"
                        >
                           <Image
                              src={partner.src}
                              alt={partner.name}
                              width={120}
                              height={60}
                              className="object-contain p-2  transition-all duration-300"
                           />
                        </MotionScale>
                     ))}
                  </MotionContainer>
               </div>
            </div>
         </section>

         {/* OPEN POSITIONS */}
         <section className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-6">
               <h3 className="text-center text-xl font-semibold mb-8">
                  Our all open positions (04)
               </h3>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                     {
                        title: 'Product Designer (UI/UX Designer)',
                        location: 'Tokyo, Japan',
                        type: 'Full-Time',
                        deadline: '30 June, 2021',
                     },
                     {
                        title: 'Social Media Manager',
                        location: 'Moscow, Russia',
                        type: 'Full-Time',
                        deadline: '30 June, 2021',
                     },
                     {
                        title: 'Director of Accounting',
                        location: 'Mumbai, India',
                        type: 'Full-Time',
                        deadline: '30 June, 2021',
                     },
                     {
                        title: 'Principal Software Engineer',
                        location: 'Tokyo, Japan',
                        type: 'Full-Time',
                        deadline: '30 June, 2021',
                     },
                  ].map((job, idx) => (
                     <div
                        key={idx}
                        className="bg-white border rounded-lg p-5 shadow-sm"
                     >
                        <h4 className="font-semibold">{job.title}</h4>
                        <div className="mt-3 text-sm text-gray-600 flex flex-wrap gap-3">
                           <span>{job.location}</span>
                           <span>•</span>
                           <span>{job.type}</span>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                           <div className="text-sm text-rose-500">
                              Deadline: {job.deadline}
                           </div>
                           <button className="px-3 py-2 bg-orange-500 text-white rounded">
                              Apply
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>
      </main>
   );
}
