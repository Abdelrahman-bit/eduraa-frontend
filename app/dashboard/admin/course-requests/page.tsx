import React from 'react';
import CourseRequestsList from './components/CourseRequestsList';

const CourseRequestsPage = () => {
   return (
      <div>
         <h1 className="text-2xl font-bold mb-4">Course Approval Requests</h1>
         <CourseRequestsList />
      </div>
   );
};

export default CourseRequestsPage;
