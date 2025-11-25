'use client';

import { useEffect, useState } from 'react';

export default function Footer() {
   const [message, setMessage] = useState('');

   useEffect(() => {
      fetch('/api/welcom')
         .then((res) => res.json())
         .then((data) => setMessage(data));
   }, []);
   return (
      <footer className="bg-gray-scale-900 text-white p-5">
         <h1> {message}</h1>I am Footer
      </footer>
   );
}
