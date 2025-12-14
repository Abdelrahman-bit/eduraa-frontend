// components/FilterSidebar.jsx
import { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronRight, Star } from 'lucide-react';
import { CATEGORIES, TOOLS, RATINGS, LEVELS } from '../data';

const Checkbox = ({ label, count, checked, onChange }) => (
   <div
      className="flex items-center justify-between py-1.5 group cursor-pointer"
      onClick={onChange}
   >
      <div className="flex items-center gap-3">
         <div
            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-orange-500 border-orange-500' : 'border-gray-300 bg-white group-hover:border-orange-300'}`}
         >
            {checked && <div className="w-2 h-2 bg-white rounded-sm" />}
         </div>
         <span
            className={`text-sm ${checked ? 'text-gray-900 font-medium' : 'text-gray-600'}`}
         >
            {label}
         </span>
      </div>
      {count && <span className="text-xs text-gray-400">{count}</span>}
   </div>
);

const FilterSection = ({ title, children, isOpen = true }) => {
   const [open, setOpen] = useState(isOpen);
   return (
      <div className="border-b border-gray-100 py-5 last:border-0">
         <div
            className="flex items-center justify-between cursor-pointer mb-3"
            onClick={() => setOpen(!open)}
         >
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
               {title}
            </h3>
            {open ? (
               <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
               <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
         </div>
         {open && <div className="space-y-1">{children}</div>}
      </div>
   );
};

const FilterSidebar = ({
   isOpen,
   isDesktopOpen,
   onClose,
   selectedCategories,
   setSelectedCategories,
   selectedTools,
   setSelectedTools,
   selectedRatings,
   setSelectedRatings,
   selectedLevels,
   setSelectedLevels,
   categories = CATEGORIES,
   tools = TOOLS,
   ratings = RATINGS,
   levels = LEVELS,
}) => {
   const toggleCategory = (categoryName) => {
      setSelectedCategories((prev) =>
         prev.includes(categoryName)
            ? prev.filter((c) => c !== categoryName)
            : [...prev, categoryName]
      );
   };

   const toggleTool = (toolName) => {
      setSelectedTools((prev) =>
         prev.includes(toolName)
            ? prev.filter((t) => t !== toolName)
            : [...prev, toolName]
      );
   };

   const toggleRating = (rating) => {
      setSelectedRatings((prev) =>
         prev.includes(rating)
            ? prev.filter((r) => r !== rating)
            : [...prev, rating]
      );
   };

   const toggleLevel = (levelName) => {
      setSelectedLevels((prev) =>
         prev.includes(levelName)
            ? prev.filter((l) => l !== levelName)
            : [...prev, levelName]
      );
   };

   // Track which categories are expanded
   const [expandedCategories, setExpandedCategories] = useState(
      categories.reduce((acc, cat, idx) => {
         if (cat.subcategories) acc[idx] = true;
         return acc;
      }, {})
   );

   const toggleCategoryExpansion = (idx) => {
      setExpandedCategories((prev) => ({
         ...prev,
         [idx]: !prev[idx],
      }));
   };

   return (
      <aside
         className={`
      fixed inset-y-0 left-0 z-80 w-72 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out overflow-y-auto
      lg:relative lg:w-72
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      ${isDesktopOpen ? 'lg:block' : 'lg:hidden'}
    `}
      >
         <div className="p-6">
            {/* Mobile Close Header */}
            <div className="flex lg:hidden items-center justify-between mb-6">
               <span className="font-bold text-lg">Filters</span>
               <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full"
               >
                  <ChevronDown className="w-5 h-5 rotate-90" />
               </button>
            </div>

            {/* Clear All Filters Button */}
            {(selectedCategories.length > 0 ||
               selectedTools.length > 0 ||
               selectedRatings.length > 0 ||
               selectedLevels.length > 0) && (
               <button
                  onClick={() => {
                     setSelectedCategories([]);
                     setSelectedTools([]);
                     setSelectedRatings([]);
                     setSelectedLevels([]);
                  }}
                  className="w-full mb-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
               >
                  Clear All Filters
               </button>
            )}

            {/* Categories */}
            <FilterSection title="Category" isOpen={true}>
               {categories.map((cat, idx) => {
                  const isExpanded = expandedCategories[idx];

                  return (
                     <div key={idx} className="py-1">
                        <div
                           className="flex items-center justify-between group cursor-pointer py-1"
                           onClick={() =>
                              cat.subcategories && toggleCategoryExpansion(idx)
                           }
                        >
                           <div className="flex items-center gap-2">
                              <div
                                 className={`w-4 h-4 border rounded flex items-center justify-center ${cat.subcategories ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}
                              >
                                 {cat.subcategories && (
                                    <div className="w-2 h-0.5 bg-white" />
                                 )}
                              </div>
                              <span className="text-sm text-gray-700 font-medium">
                                 {cat.name}
                              </span>
                           </div>
                           {cat.subcategories && (
                              <ChevronRight
                                 className={`w-3 h-3 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                              />
                           )}
                        </div>

                        {cat.subcategories && isExpanded && (
                           <div className="pl-6 mt-1 space-y-1 border-l-2 border-gray-100 ml-2 mb-3">
                              {cat.subcategories.map((sub, sIdx) => (
                                 <Checkbox
                                    key={sIdx}
                                    label={sub.name}
                                    count={sub.count}
                                    checked={selectedCategories.includes(
                                       sub.name
                                    )}
                                    onChange={() => toggleCategory(sub.name)}
                                 />
                              ))}
                           </div>
                        )}
                     </div>
                  );
               })}
            </FilterSection>

            {/* Tools */}
            <FilterSection title="Tools">
               {tools.map((tool, idx) => (
                  <Checkbox
                     key={idx}
                     label={tool.name}
                     count={tool.count}
                     checked={selectedTools.includes(tool.name)}
                     onChange={() => toggleTool(tool.name)}
                  />
               ))}
            </FilterSection>

            {/* Rating */}
            <FilterSection title="Rating">
               {ratings.map((rate, idx) => (
                  <Checkbox
                     key={idx}
                     checked={selectedRatings.includes(rate.stars)}
                     label={
                        <div className="flex items-center gap-1">
                           {[...Array(5)].map((_, i) => (
                              <Star
                                 key={i}
                                 className={`w-3 h-3 ${i < rate.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                              />
                           ))}
                           <span className="ml-1 text-gray-600">
                              {rate.stars === 5
                                 ? '5 Star'
                                 : `${rate.stars} Star & up`}
                           </span>
                        </div>
                     }
                     count={rate.count}
                     onChange={() => toggleRating(rate.stars)}
                  />
               ))}
            </FilterSection>

            {/* Course Level */}
            <FilterSection title="Course Level">
               {levels.map((level, idx) => (
                  <Checkbox
                     key={idx}
                     label={level.label}
                     count={level.count}
                     checked={selectedLevels.includes(level.name)}
                     onChange={() => toggleLevel(level.name)}
                  />
               ))}
            </FilterSection>
         </div>
      </aside>
   );
};

export default FilterSidebar;
