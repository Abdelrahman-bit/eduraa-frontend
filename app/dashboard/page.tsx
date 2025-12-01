// app/dashboard/page.tsx
export default function DashboardPage() {
   return (
      <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 h-96 flex flex-col items-center justify-center text-center">
         <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to Your Dashboard!{' '}
         </h1>
         <p className="text-gray-500">
            This content is rendered inside the layout a
         </p>
      </div>
   );
}
