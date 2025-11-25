import BestSellingSection from "./components/Home_Page/BestSellingSection/BestSellingSection";
import CategorySection from "./components/Home_Page/CategorySection/CategorySection";
import FeatureCoursesSection from "./components/Home_Page/FeatureCoursesSection/FeatureCoursesSection";
import Hero from "./components/Home_Page/Hero/Hero";
import RecentlyAddedSection from "./components/Home_Page/RecentlyAddedSection/RecentlyAddedSection";

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
