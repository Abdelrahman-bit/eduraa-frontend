// data.js

export const CATEGORIES = [
   {
      name: 'Development',
      subcategories: [
         { name: 'Web Development', count: 574 },
         { name: 'Mobile Development', count: 1345 },
         { name: 'Backend', count: 317 },
         { name: 'AI', count: 566 },
      ],
   },
   {
      name: 'Design',
      subcategories: [
         { name: 'Graphic Design', count: 892 },
         { name: 'UI/UX Design', count: 1203 },
         { name: '3D Design', count: 456 },
         { name: 'Motion Graphics', count: 678 },
      ],
   },
   {
      name: 'Business',
      subcategories: [
         { name: 'Entrepreneurship', count: 543 },
         { name: 'Management', count: 789 },
         { name: 'Sales', count: 432 },
         { name: 'Strategy', count: 321 },
      ],
   },
   {
      name: 'Marketing',
      subcategories: [
         { name: 'Digital Marketing', count: 987 },
         { name: 'Social Media', count: 654 },
         { name: 'SEO', count: 432 },
         { name: 'Content Marketing', count: 345 },
      ],
   },
];

export const TOOLS = [
   { name: 'HTML 5', count: 1345 },
   { name: 'CSS 3', count: 12716 },
   { name: 'React', count: 1345 },
   { name: 'Webflow', count: 1345, active: true },
   { name: 'Node.js', count: 1345 },
   { name: 'Laravel', count: 1345 },
   { name: 'Saas', count: 1345 },
   { name: 'Wordpress', count: 1345 },
];

export const RATINGS = [
   { stars: 5, count: 1345 },
   { stars: 4, count: 1345 },
   { stars: 3, count: 1345, active: true },
   { stars: 2, count: 1345 },
   { stars: 1, count: 1345 },
];

export const LEVELS = [
   { name: 'all-levels', label: 'All Levels', count: 1345 },
   { name: 'beginner', label: 'Beginner', count: 1345 },
   { name: 'intermediate', label: 'Intermediate', count: 1345 },
   { name: 'expert', label: 'Expert', count: 1345 },
];

export const COURSES = [
   {
      id: 1,
      title: 'Complete Blender Creator: Learn 3D Modelling for Beginners',
      category: 'Design',
      price: 49,
      rating: 4.9,
      students: '197,637',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      tagColor: 'text-orange-500 bg-orange-50',
   },
   {
      id: 2,
      title: 'Adobe Premiere Pro CC – Advanced Training Course',
      category: 'Developments',
      price: 32,
      rating: 4.6,
      students: '236,568',
      image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      tagColor: 'text-blue-500 bg-blue-50',
   },
   {
      id: 3,
      title: 'Ultimate AWS Certified Solutions Architect Associate 2021',
      category: 'Marketing',
      price: 13,
      rating: 4.1,
      students: '511,123',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      tagColor: 'text-purple-500 bg-purple-50',
   },
   {
      id: 4,
      title: 'Learn Ethical Hacking From Scratch 2021',
      category: 'IT & Software',
      price: 35,
      rating: 4.8,
      students: '451,444',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      tagColor: 'text-pink-500 bg-pink-50',
   },
   {
      id: 5,
      title: 'Angular - The Complete Guide (2021 Edition)',
      category: 'Developments',
      price: 16,
      rating: 4.3,
      students: '197,637',
      image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      tagColor: 'text-blue-500 bg-blue-50',
   },
   {
      id: 6,
      title: 'How to get Diamond in soloQ | League of Legends | Season 11',
      category: 'Marketing',
      price: 23,
      rating: 4.7,
      students: '435,671',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      tagColor: 'text-purple-500 bg-purple-50',
   },
   {
      id: 7,
      title: 'SQL for NEWBS: Weekender Crash Course',
      category: 'IT & Software',
      price: 32,
      rating: 5.0,
      students: '451,444',
      image: 'https://images.unsplash.com/photo-1504384308090-c54be3855833?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      tagColor: 'text-pink-500 bg-pink-50',
   },
   {
      id: 8,
      title: 'SEO 2021: Complete SEO Training + SEO for WordPress Websites',
      category: 'Developments',
      price: 24,
      rating: 5.0,
      students: '197,637',
      image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      tagColor: 'text-blue-500 bg-blue-50',
   },
   {
      id: 9,
      title: '[NEW] Ultimate AWS Certified Cloud Practitioner - 2021',
      category: 'Marketing',
      price: 9,
      rating: 5.0,
      students: '1,356,236',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      tagColor: 'text-purple-500 bg-purple-50',
   },
];
