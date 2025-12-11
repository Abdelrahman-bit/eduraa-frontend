import StudentHeader from '@/app/components/student/StudentHeader';
import RouteGuard from '@/app/components/auth/RouteGuard';

export default function StudentLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <div className="min-h-screen bg-gray-50 pb-10">
         <RouteGuard type="protected" />
         <StudentHeader />

         <div className="container mx-auto px-4">
            <main className="bg-white shadow-sm rounded-b-lg px-8 py-8 -mt-1 relative z-10">
               {children}
            </main>
         </div>
      </div>
   );
}
