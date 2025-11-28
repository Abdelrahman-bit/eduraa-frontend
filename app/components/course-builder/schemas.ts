import { z } from 'zod';

export const courseBasicInfoSchema = z.object({
   title: z.string().min(5).max(80),
   subtitle: z.string().max(120).optional().or(z.literal('')),
   category: z.string().min(1),
   subCategory: z.string().optional().or(z.literal('')),
   topic: z.string().min(1),
   primaryLanguage: z.string().min(1),
   subtitleLanguage: z.string().optional().or(z.literal('')),
   level: z.enum(['beginner', 'intermediate', 'advanced', 'all-levels']),
   durationValue: z.number().min(1).optional(),
   durationUnit: z.enum(['Day', 'Week', 'Month', 'Hour']),
});

export type CourseBasicInfoSchema = z.infer<typeof courseBasicInfoSchema>;

export const courseAdvancedInfoSchema = z.object({
   description: z.string().min(30),
   whatYouWillLearn: z.array(z.string().min(5)).length(4),
   targetAudience: z.array(z.string().min(5)).length(4),
   requirements: z.array(z.string().min(5)).length(4),
});

export type CourseAdvancedInfoSchema = z.infer<typeof courseAdvancedInfoSchema>;

export const lectureSchema = z.object({
   id: z.string(),
   title: z.string().min(3),
   description: z.string().optional(),
   notes: z.string().optional(),
});

export const sectionSchema = z.object({
   id: z.string(),
   title: z.string().min(3),
   lectures: z.array(lectureSchema).min(1),
});

export const curriculumSchema = z.object({
   sections: z.array(sectionSchema).min(1),
});

export type CurriculumSchema = z.infer<typeof curriculumSchema>;
