import Filter from '@/app/components/global/Filter/Filter';
import InstructorCard from '@/app/components/InstructorCard/InstructorCard';

export default function InstructorsPage() {
   return (
      <>
         <section className="section-boundary py-10">
            <Filter />
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
               <InstructorCard displayIcon={false} />
               <InstructorCard displayIcon={false} />
               <InstructorCard displayIcon={false} />
               <InstructorCard displayIcon={false} />
            </div>
         </section>
      </>
   );
}
