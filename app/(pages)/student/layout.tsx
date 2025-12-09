import StudentHeader from './../../components/student/StudentHeader';

export default function StudentLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <div className="min-h-screen bg-gray-50 pb-10">
         <StudentHeader />

         <div className="container mx-auto px-4">
            <main className="bg-white shadow-sm rounded-b-lg px-8 py-8 -mt-1 relative z-10">
               {children}
            </main>
         </div>
      </div>
   );
}
