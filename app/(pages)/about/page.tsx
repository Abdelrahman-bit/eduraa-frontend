import React from 'react';
import Image from 'next/image';
import {
   Users,
   FileText,
   Globe,
   CheckCircle,
   Layers,
   ArrowRight,
   Quote,
} from 'lucide-react';
import {
   MotionContainer,
   MotionImageRight,
   MotionImageUp,
   MotionItem,
   MotionScale,
} from '../../components/global/Motion/Motion';
import { BreadcrumbHeader } from '../../components/global/Breadcrumb/Breadcrumb';

// --- Types ---
type Partner = { name: string; src: string };
type Stat = { icon: React.ReactNode; value: string; label: string };
type Testimonial = {
   quote: string;
   name: string;
   title: string;
   company: string;
   companyColor: string;
};

const partners: Partner[] = [
   { name: 'Netflix', src: '/about/netflix.svg' },
   { name: 'YouTube', src: '/about/youtube.svg' },
   { name: 'Google', src: '/about/google.svg' },
   { name: 'Lenovo', src: '/about/lenovo.svg' },
   { name: 'Slack', src: '/about/slack.svg' },
   { name: 'Verizon', src: '/about/verizon.svg' },
   { name: 'Lexmark', src: '/about/lexmark.svg' },
   { name: 'Microsoft', src: '/about/microsoft.svg' },
];

const stats: Stat[] = [
   {
      icon: <Users className="w-6 h-6 text-orange-400" />,
      value: '67.1k',
      label: 'Students',
   },
   {
      icon: <FileText className="w-6 h-6 text-blue-400" />,
      value: '26k',
      label: 'Certified Instructor',
   },
   {
      icon: <Globe className="w-6 h-6 text-red-400" />,
      value: '72',
      label: 'Country Language',
   },
   {
      icon: <CheckCircle className="w-6 h-6 text-green-400" />,
      value: '99.9%',
      label: 'Success Rate',
   },
   {
      icon: <Layers className="w-6 h-6 text-yellow-500" />,
      value: '57',
      label: 'Trusted Companies',
   },
];

const testimonials: Testimonial[] = [
   {
      quote: 'Eduguard fit us like a glove. Their team curates fresh, up-to-date courses from their marketplace and makes them available to customers.',
      name: 'Sundar Pichai',
      title: 'Chief Chairman of',
      company: 'Google',
      companyColor: 'text-blue-600',
   },
   {
      quote: "Eduguard responds to the needs of the business in an agile and global manner. It's truly the best solution for our employees and their careers.",
      name: 'Satya Nadella',
      title: 'CEO of',
      company: 'Microsoft',
      companyColor: 'text-blue-700',
   },
   {
      quote: 'In total, it was a big success, I would get emails about what a fantastic resource it was.',
      name: 'Ted Sarandos',
      title: 'Chief Executive Officer of',
      company: 'Netflix',
      companyColor: 'text-red-600',
   },
];

export default function AboutPage() {
   return (
      <main className="min-h-screen bg-white overflow-hidden font-sans">
         <BreadcrumbHeader title="About" activePage="About" />
         {/* 1. Hero Section */}
         <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
               <MotionContainer className="space-y-6">
                  <MotionItem>
                     <h2 className="text-6xl md:text-8xl font-bold text-gray-100 select-none">
                        2007-2021
                     </h2>
                  </MotionItem>
                  <div className="-mt-8 relative z-10">
                     <MotionItem>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                           We share knowledge with the world
                        </h1>
                     </MotionItem>
                     <MotionItem>
                        <p className="text-gray-500 text-lg leading-relaxed">
                           Interdum et malesuada fames ac ante ipsum primis in
                           faucibus. Praesent fermentum quam mauris. Fusce
                           tempor et augue a aliquet.
                        </p>
                     </MotionItem>
                  </div>
               </MotionContainer>
               <MotionImageRight className="relative h-[400px] lg:h-[500px] w-full rounded-lg overflow-hidden shadow-xl">
                  <Image
                     src="/about/about.jpg"
                     alt="Team"
                     fill
                     className="object-cover"
                  />
               </MotionImageRight>
            </div>
         </section>

         {/* 2. Partners & Stats Section */}
         <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
               <MotionContainer className="lg:col-span-4 space-y-4">
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
                              fill
                              className="object-contain p-2 grayscale hover:grayscale-0 transition-all duration-300"
                           />
                        </MotionScale>
                     ))}
                  </MotionContainer>
               </div>
            </div>
            <MotionContainer className="grid grid-cols-2 md:grid-cols-5 gap-8 border-t border-gray-100 pt-12">
               {stats.map((stat, index) => (
                  <MotionItem
                     key={index}
                     className="flex flex-col items-center text-center space-y-2"
                  >
                     <div className="mb-2">{stat.icon}</div>
                     <span className="text-3xl font-bold text-gray-900">
                        {stat.value}
                     </span>
                     <span className="text-xs text-gray-500 uppercase tracking-wide">
                        {stat.label}
                     </span>
                  </MotionItem>
               ))}
            </MotionContainer>
         </section>

         {/* 3. Mission Section (Already Existed) */}
         <section className="bg-primary-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <MotionImageUp className="relative h-[400px] w-full">
                     <Image
                        src="/about/about2.png"
                        alt="Mission"
                        fill
                        className="object-contain object-bottom"
                     />
                  </MotionImageUp>
                  <MotionContainer className="space-y-6">
                     <MotionItem>
                        <span className="text-orange-500 font-bold tracking-wider text-sm uppercase block">
                           Our One Billion Mission
                        </span>
                     </MotionItem>
                     <MotionItem>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                           Our one billion mission sounds bold, We agree.
                        </h2>
                     </MotionItem>
                     <MotionItem>
                        <p className="text-gray-600 leading-relaxed">
                           &ldquo;We cannot solve our problems with the same
                           thinking we used when we created them.&rdquo; —
                           Albert Einstein.
                        </p>
                     </MotionItem>
                  </MotionContainer>
               </div>
            </div>
         </section>
         {/* 4. Gallery Section */}
         <section className="bg-gray-scale-50 py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  {/* 1. Text Content (Left Side - takes 5 columns) */}
                  <MotionContainer className="lg:col-span-5 space-y-6">
                     <MotionItem>
                        <span className="text-orange-500 font-bold tracking-wider text-sm uppercase">
                           OUR GALLERY
                        </span>
                     </MotionItem>
                     <MotionItem>
                        <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                           We’ve been here almost 17 years
                        </h2>
                     </MotionItem>
                     <MotionItem>
                        <p className="text-gray-500 leading-relaxed">
                           Fusce lobortis leo augue, sit amet tristique nisi
                           commodo in. Aliquam ac libero quis tellus venenatis
                           imperdiet. Sed sed nunc libero. Curabitur in urna
                           ligula.
                        </p>
                     </MotionItem>
                     <MotionItem>
                        <button className="bg-[#FF5A1F] hover:bg-[#e04f1a] text-white px-8 py-3 rounded-md font-medium transition-colors flex items-center gap-2 group">
                           Join Our Team
                           <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                     </MotionItem>
                  </MotionContainer>

                  {/* 2. Image Content (Right Side - takes 7 columns) */}
                  <div className="lg:col-span-7">
                     <MotionScale className="relative w-full h-[400px] lg:h-[500px]">
                        <Image
                           src="/about/about3.svg"
                           alt="Gallery illustration"
                           fill
                           className="object-contain object-right"
                           priority
                        />
                     </MotionScale>
                  </div>
               </div>
            </div>
         </section>

         {/* 5. Testimonials Section */}
         <section className="bg-white py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <MotionContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {testimonials.map((testi, index) => (
                     <MotionItem key={index} className="flex flex-col h-full">
                        {/* Card Box */}
                        <div className="bg-gray-scale-50 p-8 rounded-lg relative mb-6 flex-1">
                           <Quote className="w-5 h-5 text-orange-500 mb-4 opacity-80" />
                           <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                              {testi.quote}
                           </p>
                           <div className="absolute -bottom-3 left-8 w-6 h-6 bg-gray-50 rotate-45 transform"></div>
                        </div>
                        <div className="pl-4 mt-4">
                           <h4 className="font-bold text-gray-900">
                              {testi.name}
                           </h4>
                           <p className="text-gray-500 text-sm">
                              {testi.title}{' '}
                              <span
                                 className={`font-semibold ${testi.companyColor}`}
                              >
                                 {testi.company}
                              </span>
                           </p>
                        </div>
                     </MotionItem>
                  ))}
               </MotionContainer>
            </div>
         </section>
      </main>
   );
}
