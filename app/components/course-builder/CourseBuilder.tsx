'use client';

import useCourseBuilderStore from '@/app/store/courseBuilderStore';
import { Stepper } from './Stepper';
import { BasicInfoForm } from './forms/BasicInfoForm';
import { AdvancedInfoForm } from './forms/AdvancedInfoForm';
import { CurriculumBuilder } from './forms/CurriculumBuilder';
import { PublishStep } from './forms/PublishStep';

const steps = [
   {
      label: 'Basic Information',
      description: 'Title, category, and meta data',
   },
   { label: 'Advanced Information', description: 'Media, goals, audience' },
   { label: 'Curriculum', description: 'Sections and lectures' },
   { label: 'Publish', description: 'Review and submit' },
];

export function CourseBuilder() {
   const { activeStep, setActiveStep } = useCourseBuilderStore();

   const handleStepChange = (index: number) => {
      if (index <= activeStep) {
         setActiveStep(index);
      }
   };

   return (
      <section className="space-y-6">
         <Stepper
            steps={steps}
            activeStep={activeStep}
            onStepClick={handleStepChange}
         />
         {activeStep === 0 && <BasicInfoForm />}
         {activeStep === 1 && <AdvancedInfoForm />}
         {activeStep === 2 && <CurriculumBuilder />}
         {activeStep === 3 && <PublishStep />}
      </section>
   );
}
