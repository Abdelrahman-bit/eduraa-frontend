'use client';

import { motion, Variants } from 'framer-motion';
import React from 'react';

// إعدادات الحركات
const fadeInUp: Variants = {
   hidden: { opacity: 0, y: 40 },
   visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
   },
};

const staggerContainer = {
   hidden: { opacity: 0 },
   visible: {
      opacity: 1,
      transition: {
         staggerChildren: 0.1,
         delayChildren: 0.2,
      },
   },
};

const scaleIn = {
   hidden: { opacity: 0, scale: 0.8 },
   visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

// 1. حاوية للحركات المتتالية (Stagger)
export const MotionContainer = ({
   children,
   className,
}: {
   children: React.ReactNode;
   className?: string;
}) => {
   return (
      <motion.div
         initial="hidden"
         whileInView="visible"
         viewport={{ once: true, margin: '-50px' }}
         variants={staggerContainer}
         className={className}
      >
         {children}
      </motion.div>
   );
};

// 2. عنصر يظهر من الأسفل (Fade Up)
export const MotionItem = ({
   children,
   className,
}: {
   children: React.ReactNode;
   className?: string;
}) => {
   return (
      <motion.div variants={fadeInUp} className={className}>
         {children}
      </motion.div>
   );
};

// 3. عنصر يظهر بتأثير التكبير (Scale) - للوجوهات
export const MotionScale = ({
   children,
   className,
}: {
   children: React.ReactNode;
   className?: string;
}) => {
   return (
      <motion.div variants={scaleIn} className={className}>
         {children}
      </motion.div>
   );
};

// 4. صورة تدخل من اليمين
export const MotionImageRight = ({
   children,
   className,
}: {
   children: React.ReactNode;
   className?: string;
}) => {
   return (
      <motion.div
         initial={{ opacity: 0, x: 50 }}
         whileInView={{ opacity: 1, x: 0 }}
         viewport={{ once: false }}
         transition={{ duration: 0.8 }}
         className={className}
      >
         {children}
      </motion.div>
   );
};
// 6. صورة تدخل من اليسار (MotionImageLeft)
export const MotionImageLeft = ({
   children,
   className,
}: {
   children: React.ReactNode;
   className?: string;
}) => {
   return (
      <motion.div
         initial={{ opacity: 0, x: -50 }} // negative x to come from left
         whileInView={{ opacity: 1, x: 0 }}
         viewport={{ once: true }}
         transition={{ duration: 0.8 }}
         className={className}
      >
         {children}
      </motion.div>
   );
};

// 5. صورة تظهر من الأسفل
export const MotionImageUp = ({
   children,
   className,
}: {
   children: React.ReactNode;
   className?: string;
}) => {
   return (
      <motion.div
         initial={{ opacity: 0, y: 50 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
         transition={{ duration: 0.8 }}
         className={className}
      >
         {children}
      </motion.div>
   );
};
