'use client';

type StepperProps = {
   steps: { label: string; description?: string }[];
   activeStep: number;
   onStepClick?: (index: number) => void;
};

export function Stepper({ steps, activeStep, onStepClick }: StepperProps) {
   return (
      <ol className="flex flex-wrap gap-4 rounded-lg border bg-card p-4 text-sm">
         {steps.map((step, index) => {
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;
            return (
               <li
                  key={step.label}
                  className="flex items-center gap-3"
                  role={onStepClick ? 'button' : undefined}
                  tabIndex={onStepClick ? 0 : -1}
                  onClick={() => onStepClick?.(index)}
                  onKeyDown={(event) => {
                     if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onStepClick?.(index);
                     }
                  }}
               >
                  <span
                     className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
                        isActive
                           ? 'border-primary bg-primary text-primary-foreground'
                           : isCompleted
                             ? 'border-green-500 bg-green-500/10 text-green-600'
                             : 'border-muted-foreground/40 text-muted-foreground'
                     }`}
                  >
                     {index + 1}
                  </span>
                  <div className="flex flex-col">
                     <span
                        className={`font-semibold ${
                           isActive ? 'text-primary' : 'text-foreground'
                        }`}
                     >
                        {step.label}
                     </span>
                     {step.description ? (
                        <span className="text-muted-foreground text-xs">
                           {step.description}
                        </span>
                     ) : null}
                  </div>
               </li>
            );
         })}
      </ol>
   );
}
