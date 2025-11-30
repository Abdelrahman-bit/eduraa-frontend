import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PaginationProps {
   currentPage: number;
   totalPages: number;
   onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
   currentPage,
   totalPages,
   onPageChange,
}) => {
   const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

   return (
      <div className="flex justify-center">
         <nav className="flex items-center justify-center gap-2 mt-12 mb-8">
            {/* Previous Button */}
            <button
               onClick={() => onPageChange(Math.max(1, currentPage - 1))}
               disabled={currentPage === 1}
               className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200
               ${
                  currentPage === 1
                     ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                     : 'bg-orange-50 text-orange-500 hover:bg-orange-100 cursor-pointer'
               }`}
            >
               <ArrowLeft size={20} />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-2 mx-4">
               {pages.map((page) => (
                  <button
                     key={page}
                     onClick={() => onPageChange(page)}
                     className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-200
                     ${
                        page === currentPage
                           ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                           : 'text-gray-600 hover:bg-orange-50 hover:text-orange-500 cursor-pointer'
                     }`}
                  >
                     {page < 10 ? `0${page}` : page}
                  </button>
               ))}
            </div>

            {/* Next Button */}
            <button
               onClick={() =>
                  onPageChange(Math.min(totalPages, currentPage + 1))
               }
               disabled={currentPage === totalPages}
               className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200
               ${
                  currentPage === totalPages
                     ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                     : 'bg-orange-50 text-orange-500 hover:bg-orange-100 cursor-pointer'
               }`}
            >
               <ArrowRight size={20} />
            </button>
         </nav>
      </div>
   );
};
