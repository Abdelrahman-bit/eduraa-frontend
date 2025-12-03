// app/dashboard/layout.tsx
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import Footer from '../components/dashboard/Footer';
import RouteGuard from '../components/auth/RouteGuard';

export default function DashboardLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   // هنا بنحدد الدور يدوياً عشان نجرب، بعدين ممكن تجيبيه من الداتابيز
   const userRole = 'instructor';

   return (
      <>
         <RouteGuard type="protected" />
         <div className="min-h-screen bg-gray-50 flex">
            {/* 1. السايدبار (ثابت عالشمال) */}
            <Sidebar role={userRole} />

            {/* 2. منطقة المحتوى (واخدة مساحة عشان السايدبار مياكلش منها) */}
            <div className="flex-1 flex flex-col ml-64 min-h-screen transition-all duration-300">
               {/* الهيدر */}
               <Header />

               {/* 3. الـ Children (الصفحات المتغيرة هتنزل هنا) */}
               <main className="flex-1 p-8 overflow-y-auto">{children}</main>

               {/* الفوتر */}
               <Footer />
            </div>
         </div>
      </>
   );
}
