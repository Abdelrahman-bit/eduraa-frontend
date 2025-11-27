import React from 'react';
import Image from 'next/image';
import {
   Users,
   FileText,
   Globe,
   CheckCircle,
   Layers,
   Check,
   ClipboardList,
   UserCog,
   PlayCircle,
   Handshake,
   ArrowRight,
   Mail,
   Quote,
   ArrowLeft,
} from 'lucide-react';
import {
   MotionContainer,
   MotionImageRight,
   MotionImageLeft, // Assuming you have this or use MotionImageUp/Right
   MotionItem,
   MotionScale,
} from '../../components/global/Motion/Motion';
import { BreadcrumbHeader } from '../../components/global/Breadcrumb/Breadcrumb';
import BecomeInstructorSection from '@/app/components/become_an_instructor/ui/BecomeInstructorSection';
import Link from 'next/link';

// --- Types ---
type Stat = {
   icon: React.ReactNode;
   value: string;
   label: string;
};

type Feature = {
   title: string;
   description: string;
};

type Step = {
   id: number;
   icon: React.ReactNode;
   bgColor: string;
   title: string;
   description: string;
};

// --- Data ---
const stats: Stat[] = [
   {
      icon: <Users className="w-6 h-6 text-orange-500" />,
      value: '67.1k',
      label: 'Students',
   },
   {
      icon: <FileText className="w-6 h-6 text-purple-500" />,
      value: '26k',
      label: 'Certified Instructor',
   },
   {
      icon: <Globe className="w-6 h-6 text-red-500" />,
      value: '72',
      label: 'Country Language',
   },
   {
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      value: '99.9%',
      label: 'Success Rate',
   },
   {
      icon: <Layers className="w-6 h-6 text-yellow-500" />,
      value: '57',
      label: 'Trusted Companies',
   },
];

const features: Feature[] = [
   {
      title: 'Tech your students as you want.',
      description:
         'Morbi quis lorem non orci fermentum euismod. Nam sapien tellus, aliquam nec porttitor vel, pellentesque at metus.',
   },
   {
      title: 'Manage your course, payment in one place',
      description:
         'Sed et mattis urna. Sed tempus fermentum est, eu lobortis nibh consequat eu. Nullam vel libero pharetra, euismod turpis et, elementum enim.',
   },
   {
      title: 'Chat with your students',
      description:
         'Nullam mattis lectus ac diam egestas posuere. Praesent auctor massa orci, ut fermentum eros dictum id.',
   },
];

const steps: Step[] = [
   {
      id: 1,
      icon: <ClipboardList className="w-6 h-6 text-purple-600" />,
      bgColor: 'bg-purple-100',
      title: '1. Apply to become instructor.',
      description:
         'Sed et mattis urna. Sed tempus fermentum est, eu lobortis nibh consequat eu.',
   },
   {
      id: 2,
      icon: <UserCog className="w-6 h-6 text-red-500" />,
      bgColor: 'bg-red-100',
      title: '2. Setup & edit your profile.',
      description:
         'Duis non ipsum at leo efficitur pulvinar. Morbi semper nisi eget accumsan ullamcorper.',
   },
   {
      id: 3,
      icon: <PlayCircle className="w-6 h-6 text-orange-500" />,
      bgColor: 'bg-orange-100',
      title: '3. Create your new course',
      description:
         'Praesent congue ornare nibh sed ullamcorper. Proin venenatis tellus non turpis scelerisque.',
   },
   {
      id: 4,
      icon: <Handshake className="w-6 h-6 text-green-600" />,
      bgColor: 'bg-green-100',
      title: '4. Start teaching & earning',
      description:
         'Praesent congue ornare nibh sed ullamcorper. Proin venenatis tellus non turpis scelerisque.',
   },
];

export default function BecomeInstructorPage() {
   return (
      <main className="min-h-screen bg-white overflow-hidden font-sans">
         <BreadcrumbHeader
            title="Become an Instructor"
            activePage="Become an Instructor"
         />

         {/* 1. Hero Section */}
         <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
               <MotionContainer className="space-y-6 max-w-lg">
                  <MotionItem>
                     <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                        Become an Instructor
                     </h1>
                  </MotionItem>
                  <MotionItem>
                     <p className="text-gray-500 text-lg leading-relaxed">
                        Become an instructor & start teaching with 26k certified
                        instructors. Create a success story with 67.1k Students
                        — Grow yourself with 71 countries.
                     </p>
                  </MotionItem>
                  <MotionItem>
                     <Link href={'#become_an_instructor'}>
                        <button className="bg-[#FF5A1F] hover:bg-[#e04f1a] text-white px-8 py-3.5 rounded-md font-semibold transition-all shadow-lg hover:shadow-orange-200 cursor-pointer">
                           Get Started
                        </button>
                     </Link>
                  </MotionItem>
               </MotionContainer>

               <MotionImageRight className="relative h-[500px] w-full flex justify-center lg:justify-end">
                  <Image
                     src="/become_an_instructor/girl.png"
                     alt="Happy Instructor"
                     fill
                     className="object-contain object-right"
                     priority
                  />
               </MotionImageRight>
            </div>
         </section>

         {/* 2. Stats Strip */}
         <section className="bg-[#FFF4EB] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <MotionContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                  {stats.map((stat, index) => (
                     <MotionItem
                        key={index}
                        className="flex flex-col items-center lg:items-start space-y-2"
                     >
                        <div className="flex items-center gap-3">
                           <div className="bg-white p-2 rounded-full shadow-sm">
                              {stat.icon}
                           </div>
                           <div className="flex flex-col">
                              <span className="text-2xl font-bold text-gray-900">
                                 {stat.value}
                              </span>
                              <span className="text-xs text-gray-500 font-medium">
                                 {stat.label}
                              </span>
                           </div>
                        </div>
                     </MotionItem>
                  ))}
               </MotionContainer>
            </div>
         </section>

         {/* 3. Feature Split Section */}
         <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <MotionScale className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
                  <Image
                     src="/become_an_instructor/screen.png"
                     alt="Eduguard Dashboard on Laptop"
                     fill
                     className="object-contain object-center lg:object-left"
                  />
               </MotionScale>

               <MotionContainer className="space-y-8">
                  <div className="space-y-4">
                     <MotionItem>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                           Why you’ll start teaching on Eduguard
                        </h2>
                     </MotionItem>
                     <MotionItem>
                        <p className="text-gray-500 leading-relaxed">
                           Praesent congue ornare nibh sed ullamcorper. Proin
                           venenatis tellus non turpis scelerisque, vitae auctor
                           arcu ornare. Cras vitae nulla a purus mollis
                           venenatis.
                        </p>
                     </MotionItem>
                  </div>

                  <div className="space-y-6">
                     {features.map((feature, index) => (
                        <MotionItem key={index} className="flex gap-4">
                           <div className="shrink-0 mt-1">
                              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                 <Check className="w-4 h-4 text-white" />
                              </div>
                           </div>
                           <div className="space-y-1">
                              <h3 className="font-bold text-gray-900 text-lg">
                                 {feature.title}
                              </h3>
                              <p className="text-gray-500 text-sm leading-relaxed">
                                 {feature.description}
                              </p>
                           </div>
                        </MotionItem>
                     ))}
                  </div>
               </MotionContainer>
            </div>
         </section>

         {/* 4. Steps Section */}
         <section className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <MotionContainer className="text-center mb-16">
                  <MotionItem>
                     <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        How you'll become <br className="hidden md:block" />
                        successful instructor
                     </h2>
                  </MotionItem>
               </MotionContainer>

               <MotionContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {steps.map((step) => (
                     <MotionItem
                        key={step.id}
                        className="bg-white p-8 rounded-lg text-center hover:shadow-lg transition-shadow duration-300 group"
                     >
                        <div
                           className={`w-14 h-14 mx-auto mb-6 rounded-lg flex items-center justify-center ${step.bgColor} group-hover:scale-110 transition-transform duration-300`}
                        >
                           {step.icon}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                           {step.title}
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                           {step.description}
                        </p>
                     </MotionItem>
                  ))}
               </MotionContainer>
            </div>
         </section>

         {/* 5. Support Section */}
         <section className="bg-[#FFF4EB] py-20 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <MotionContainer className="relative h-[400px] lg:h-[500px] w-full flex gap-4">
                     <div className="relative w-full h-full rounded-lg overflow-hidden">
                        <Image
                           src="/become_an_instructor/callcenter.jpg"
                           alt="Support Agent"
                           fill
                           className="object-cover"
                        />
                     </div>
                  </MotionContainer>

                  <MotionContainer className="space-y-8 pl-0 lg:pl-10">
                     <MotionItem>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                           Don’t worry we’re always here to help you
                        </h2>
                     </MotionItem>
                     <MotionItem>
                        <p className="text-gray-500 leading-relaxed">
                           Mauris aliquet ornare tortor, ut mollis arcu luctus
                           quis. Phasellus nec augue malesuada, sagittis ligula
                           vel, faucibus metus. Nam viverra metus eget nunc
                           dignissim.
                        </p>
                     </MotionItem>

                     <MotionItem>
                        <ul className="space-y-4">
                           {[
                              'Sed nec dapibus orci integer nisi turpis, eleifend sit amet aliquam vel.',
                              'Those who are looking to reboot their work life and try a new profession that.',
                              'Nunc auctor consequat lorem, in posuere enim hendrerit sed.',
                              'Duis ornare enim ullamcorper congue.',
                           ].map((text, i) => (
                              <li
                                 key={i}
                                 className="flex gap-3 text-sm text-gray-700"
                              >
                                 <ArrowRight className="w-5 h-5 text-orange-500 shrink-0" />
                                 <span>{text}</span>
                              </li>
                           ))}
                        </ul>
                     </MotionItem>

                     <MotionItem>
                        <div className="flex items-center gap-4 pt-4">
                           <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                              <Mail className="w-6 h-6 text-orange-500" />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                 Email Us, Anytime Anywhere
                              </span>
                              <a
                                 href="mailto:help.eduguard@gamil.com"
                                 className="text-gray-900 font-bold hover:text-orange-500 transition-colors"
                              >
                                 help.eduguard@gamil.com
                              </a>
                           </div>
                        </div>
                     </MotionItem>
                  </MotionContainer>
               </div>
            </div>
         </section>

         {/* 6. Rules & Regulations Section */}
         <section className="bg-white py-20 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <MotionContainer className="space-y-6 order-2 lg:order-1">
                     <MotionItem>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                           Instructor rules & regulations
                        </h2>
                     </MotionItem>
                     <MotionItem>
                        <p className="text-gray-500 leading-relaxed">
                           Sed auctor, nisl non elementum ornare, turpis orci
                           consequat arcu, at iaculis quam leo nec libero.
                           Aenean mollis turpis velit, id laoreet sem luctus in.
                           Etiam et egestas lorem.
                        </p>
                     </MotionItem>
                     <MotionItem>
                        <ul className="space-y-3 mt-4 list-disc list-inside text-gray-600 marker:text-gray-400">
                           <li>
                              Sed ullamcorper libero quis condimentum
                              pellentesque.
                           </li>
                           <li>Nam leo tortor, tempus et felis non.</li>
                           <li>
                              Porttitor faucibus erat. Integer eget purus non
                              massa ultricies pretium ac sed eros.
                           </li>
                           <li>
                              Vestibulum ultrices commodo tellus. Etiam eu
                              lectus sit amet turpi.
                           </li>
                        </ul>
                     </MotionItem>
                  </MotionContainer>

                  <MotionContainer className="relative h-[400px] lg:h-[500px] w-full flex gap-4 order-1 lg:order-2">
                     <div className="relative w-full h-full rounded-lg overflow-hidden">
                        <Image
                           src="/become_an_instructor/teacher.jpg"
                           alt="Student"
                           fill
                           className="object-cover"
                        />
                     </div>
                  </MotionContainer>
               </div>
            </div>
         </section>

         {/* 7. Success Section */}
         <section className="bg-white py-20 lg:py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                  <MotionContainer className="space-y-8 lg:sticky lg:top-24">
                     <MotionItem>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-[1.15]">
                           20k+ Instructor created their success story with
                           eduguard
                        </h2>
                     </MotionItem>

                     <MotionItem>
                        <p className="text-gray-500 text-lg leading-relaxed">
                           Nunc euismod sapien non felis eleifend porttitor.
                           Maecenas dictum eros justo, id commodo ante laoreet
                           nec. Phasellus aliquet, orci id pellentesque mollis.
                        </p>
                     </MotionItem>

                     <MotionItem>
                        <div className="bg-[#FFF4EB] p-6 md:p-8 rounded-xl relative mt-4">
                           <Quote className="w-5 h-5 text-[#FF5A1F] mb-6 opacity-80 fill-current" />
                           <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
                              Nulla sed malesuada augue. Morbi interdum
                              vulputate imperdiet. Pellentesque ullamcorper
                              auctor ante, egestas interdum quam facilisis
                              commodo.
                           </p>
                           <div className="absolute -bottom-3 left-10 w-6 h-6 bg-[#FFF4EB] rotate-45 transform"></div>
                        </div>
                     </MotionItem>

                     <MotionItem>
                        <div className="flex items-center gap-4 pt-4">
                           <button className="w-12 h-12 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
                              <ArrowLeft className="w-5 h-5" />
                           </button>
                           <button className="w-12 h-12 flex items-center justify-center rounded-md bg-[#FF5A1F] hover:bg-[#e04f1a] text-white shadow-lg shadow-orange-200 transition-all">
                              <ArrowRight className="w-5 h-5" />
                           </button>
                        </div>
                     </MotionItem>
                  </MotionContainer>

                  <MotionContainer>
                     <MotionItem className="relative w-full h-[400px] md:h-[500px] lg:h-[650px] rounded-lg overflow-hidden">
                        <Image
                           src="/become_an_instructor/teachers.svg"
                           alt="Instructors success stories"
                           fill
                           className="object-contain lg:object-right"
                           priority
                        />
                     </MotionItem>
                  </MotionContainer>
               </div>
            </div>
         </section>

         {/* 8. Become Instructor Section Section */}
         <BecomeInstructorSection />
      </main>
   );
}
