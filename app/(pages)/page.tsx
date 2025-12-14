import { Metadata } from 'next';
import BestSellingSection from '../components/Home_Page/BestSellingSection/BestSellingSection';
import CategorySection from '../components/Home_Page/CategorySection/CategorySection';
import FeatureCoursesSection from '../components/Home_Page/FeatureCoursesSection/FeatureCoursesSection';
import Hero from '../components/Home_Page/Hero/Hero';
import RecentlyAddedSection from '../components/Home_Page/RecentlyAddedSection/RecentlyAddedSection';

export const metadata: Metadata = {
   title: 'Home',
   description:
      'Discover thousands of online courses on Eduraa. Learn programming, web development, design, business, and more from expert instructors. Start your learning journey today with interactive courses and certifications.',
   keywords: [
      'online courses',
      'learn programming',
      'web development courses',
      'design courses',
      'business training',
      'expert instructors',
      'online education',
      'skill development',
   ],
};

export default function Home() {
   return (
      <>
         <Hero />
         <CategorySection />
         <BestSellingSection />
         <FeatureCoursesSection />
         <RecentlyAddedSection />
      </>
   );
}
