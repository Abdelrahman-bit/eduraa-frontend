// components/dashboard/Footer.tsx
export default function Footer() {
   return (
      <footer className="h-16 px-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 border-t border-gray-100 bg-white mt-auto">
         <p>
            © 2021 - Eduguard. Designed by Templatecookie. All rights reserved
         </p>
         <div className="flex gap-6 mt-2 md:mt-0">
            <a href="#" className="hover:text-gray-600">
               FAQs
            </a>
            <a href="#" className="hover:text-gray-600">
               Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-600">
               Terms & Condition
            </a>
         </div>
      </footer>
   );
}
