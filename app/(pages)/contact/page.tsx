import React from 'react';
import Image from 'next/image';
import { Mail, Phone, ArrowRight } from 'lucide-react';
import {
   MotionContainer,
   MotionImageRight,
   MotionItem,
   MotionScale,
} from '../../components/global/Motion/Motion';
import { BreadcrumbHeader } from '../../components/global/Breadcrumb/Breadcrumb';

// --- Types ---
type Branch = {
   title: string;
   subtitle?: string;
   address: string;
   img: string;
};
type ContactInfo = {
   addressTitle: string;
   address: string;
   phones: string[];
   emails: string[];
};

// --- Data ---
const branches: Branch[] = [
   {
      title: 'Los Angeles, California',
      subtitle: 'MAIN BRANCH',
      address: '1702 Olympic Boulevard, Santa Monica, CA 90404',
      img: '/contact/branch1.webp',
   },
   {
      title: 'Tokyo, Japan',
      subtitle: 'Tokyo Office',
      address: '901 N Pitt St., Suite 170, Tokyo, JP 22134',
      img: '/contact/branch2.webp',
   },
   {
      title: 'Moscow, Russia',
      subtitle: 'Moscow Office',
      address: 'Anjelersstraat 470H, 1015 NL Moscow, Russia',
      img: '/contact/branch3.webp',
   },
   {
      title: 'Mumbai, India',
      subtitle: 'Mumbai Office',
      address: '36 East 20th St, 6th Floor, Mumbai, India',
      img: '/contact/branch4.webp',
   },
];

const contactInfo: ContactInfo = {
   addressTitle: 'ADDRESS',
   address: '1702 Olympic Boulevard\nSanta Monica, CA 90404',
   phones: ['(480) 555-0103', '(219) 555-0114'],
   emails: ['help.eduguard@gmail.com', 'career.eduguard@gmail.com'],
};

// --- Small presentational components ---
const BranchCard: React.FC<{ branch: Branch }> = ({ branch }) => {
   return (
      <MotionScale className="relative overflow-hidden rounded-lg shadow-lg group">
         <div className="relative h-64 w-full">
            <Image
               src={branch.img}
               alt={branch.title}
               fill
               className="object-cover"
            />
         </div>

         <div className="absolute left-6 bottom-6 bg-white/90 backdrop-blur-sm rounded-md p-4 w-[85%] md:w-[60%]">
            <p className="text-xs text-amber-600 font-semibold">
               {branch.subtitle}
            </p>
            <h4 className="font-bold mt-1">{branch.title}</h4>
            <p className="text-xs text-gray-600 mt-1">{branch.address}</p>
         </div>
      </MotionScale>
   );
};

// --- Page ---
export default function ContactPage() {
   return (
      <main className="min-h-screen bg-white overflow-hidden font-sans">
         {/* breadcrumb */}
         <BreadcrumbHeader title="Contact" activePage="Contact" />

         {/* HERO */}
         <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10">
               <MotionContainer className="lg:col-span-8 space-y-6">
                  <MotionItem>
                     <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight">
                        Connect with us
                     </h1>
                  </MotionItem>

                  <MotionItem>
                     <p className="text-gray-600 max-w-xl">
                        Want to chat? We’d love to hear from you! Get in touch
                        with our Customer Success Team to inquire about speaking
                        events, advertising rates, or just say hello.
                     </p>
                  </MotionItem>

                  <MotionItem>
                     <div className="mt-6 flex items-center gap-3">
                        <button
                           type="button"
                           className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
                        >
                           <Mail className="w-4 h-4" />
                           Copy Email
                        </button>
                        <span className="text-xs text-gray-500">
                           or use the contact form below
                        </span>
                     </div>
                  </MotionItem>
               </MotionContainer>

               <MotionImageRight className="lg:col-span-4 relative w-full h-100 sm:h-70 lg:h-96 mx-auto ">
                  <Image
                     src="/contact/contact_hero.webp"
                     alt="Contact person"
                     width={350}
                     height={600}
                     className="object-cover"
                  />
               </MotionImageRight>
            </div>
         </section>

         {/* BRANCHES */}
         <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <MotionContainer>
                  <MotionItem>
                     <h2 className="text-2xl font-semibold text-center">
                        Our branches all over the world.
                     </h2>
                  </MotionItem>
                  <MotionItem>
                     <p className="text-center text-gray-500 max-w-2xl mx-auto mt-3">
                        Phasellus sed quam eu eros faucibus cursus. Quisque
                        mauris urna, imperdiet id leo quis, luctus auctor nisi.
                     </p>
                  </MotionItem>

                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                     {branches.map((b, i) => (
                        <div key={i}>
                           <BranchCard branch={b} />
                        </div>
                     ))}
                  </div>
               </MotionContainer>
            </div>
         </section>

         {/* CONTACT US - details + form */}
         <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
               <MotionContainer className="lg:col-span-5 space-y-6">
                  <MotionItem>
                     <h3 className="text-2xl font-semibold">Contact Us</h3>
                  </MotionItem>

                  <MotionItem>
                     <p className="text-gray-600">
                        Will you be in Los Angeles or any other branches any
                        time soon? Stop by the office! We’d love to meet.
                     </p>
                  </MotionItem>

                  <MotionItem>
                     <div className="mt-4 space-y-6">
                        <div>
                           <p className=" font-semibold text-amber-600">
                              {contactInfo.addressTitle}
                           </p>
                           <p className="text-sm text-gray-700 whitespace-pre-line mt-2">
                              {contactInfo.address}
                           </p>
                        </div>

                        <div>
                           <p className=" font-semibold text-amber-600">
                              PHONE NUMBER
                           </p>
                           <div className="mt-2 space-y-1 text-sm text-gray-700">
                              {contactInfo.phones.map((p, i) => (
                                 <div
                                    key={i}
                                    className="flex items-center gap-2"
                                 >
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span>{p}</span>
                                 </div>
                              ))}
                           </div>
                        </div>

                        <div>
                           <p className=" font-semibold text-amber-600">
                              EMAIL ADDRESS
                           </p>
                           <div className="mt-2 space-y-1 text-sm text-gray-700">
                              {contactInfo.emails.map((e, i) => (
                                 <div
                                    key={i}
                                    className="flex items-center gap-2"
                                 >
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span>{e}</span>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </MotionItem>
               </MotionContainer>

               <MotionContainer className="lg:col-span-7">
                  <MotionItem>
                     <div className="bg-white border rounded-ms shadow-sm p-6">
                        <h4 className="font-semibold mb-4">Get In touch</h4>
                        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div>
                              <label className="text-xs text-gray-500">
                                 First Name
                              </label>
                              <input
                                 className="mt-1 w-full border rounded px-3 py-2 text-sm"
                                 placeholder="First name..."
                              />
                           </div>

                           <div>
                              <label className="text-xs text-gray-500">
                                 Last Name
                              </label>
                              <input
                                 className="mt-1 w-full border rounded px-3 py-2 text-sm"
                                 placeholder="Last name..."
                              />
                           </div>

                           <div className="sm:col-span-2">
                              <label className="text-xs text-gray-500">
                                 Email
                              </label>
                              <input
                                 className="mt-1 w-full border rounded px-3 py-2 text-sm"
                                 placeholder="Email address"
                              />
                           </div>

                           <div className="sm:col-span-2">
                              <label className="text-xs text-gray-500">
                                 Subject
                              </label>
                              <input
                                 className="mt-1 w-full border rounded px-3 py-2 text-sm"
                                 placeholder="Message subject"
                              />
                           </div>

                           <div className="sm:col-span-2">
                              <label className="text-xs text-gray-500">
                                 Message
                              </label>
                              <textarea
                                 rows={5}
                                 className="mt-1 w-full border rounded px-3 py-2 text-sm"
                                 placeholder="Write your message..."
                              />
                           </div>

                           <div className="sm:col-span-2 flex justify-start">
                              <button
                                 type="submit"
                                 className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 "
                              >
                                 Send Message <ArrowRight className="w-4 h-4" />
                              </button>
                           </div>
                        </form>
                     </div>
                  </MotionItem>
               </MotionContainer>
            </div>
         </section>
      </main>
   );
}
