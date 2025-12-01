import React from 'react';
import JoinRequestsTable from './components/JoinRequestsTable';

const JoinRequestsPage = () => {
   return (
      <div>
         <h1 className="text-2xl font-bold mb-4">Instructor Join Requests</h1>
         <JoinRequestsTable />
      </div>
   );
};

export default JoinRequestsPage;
