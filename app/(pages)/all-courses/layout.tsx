import { Metadata } from 'next';

export const metadata: Metadata = {
   title: 'All Courses',
   description:
      'Browse thousands of online courses on Eduraa. Filter by category, level, and tools. Learn programming, web development, design, business, and more from expert instructors.',
   keywords: [
      'browse courses',
      'online courses catalog',
      'programming courses',
      'web development',
      'design courses',
      'business courses',
      'filter courses',
      'course search',
   ],
};

export default function AllCoursesLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return <>{children}</>;
}
