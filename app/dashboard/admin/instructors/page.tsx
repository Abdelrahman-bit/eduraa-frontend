import React from 'react';
import InstructorsTable from './components/InstructorsTable';

const InstructorsPage = () => {
   return (
      <div>
         <h1 className="text-2xl font-bold mb-4">Instructors</h1>
         <InstructorsTable />
      </div>
   );
};

export default InstructorsPage;
