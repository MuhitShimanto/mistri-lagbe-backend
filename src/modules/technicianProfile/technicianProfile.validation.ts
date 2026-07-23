import { z } from 'zod';

export const createTechnicianProfileSchema = z.object({
  body: z.object({
    bio: z.string().max(1000, 'Bio cannot exceed 1000 characters').optional(),

    experienceYears: z
      .number({
        error: 'Experience must be a number',
      })
      .int('Experience must be an integer')
      .min(0, 'Experience cannot be negative')
      .optional(),

    hourlyRate: z
      .number({
        error: 'Hourly rate must be a number',
      })
      .positive('Hourly rate must be greater than 0')
      .optional(),

    rating: z
      .number({
        error: 'Rating must be a number',
      })
      .min(0, 'Rating cannot be negative')
      .max(5, 'Rating cannot exceed 5')
      .optional(),

    skills: z.array(z.string().max(50, 'Skill cannot exceed 50 characters')).optional(),

    availability: z
      .array(
        z.object({
          day: z.string().max(10, 'Day cannot exceed 10 characters'),
          startTime: z.string().max(10, 'Start time cannot exceed 10 characters'),
          endTime: z.string().max(10, 'End time cannot exceed 10 characters'),
        }),
      )
      .optional(),
  }),
});

export const updateTechnicianProfileSchema = z.object({
  body: z.object({
    bio: z.string().max(1000, 'Bio cannot exceed 1000 characters').optional(),

    experienceYears: z
      .number()
      .int('Experience must be an integer')
      .min(0, 'Experience cannot be negative')
      .optional(),

    hourlyRate: z.number().positive('Hourly rate must be greater than 0').optional(),

    rating: z.number().min(0, 'Rating cannot be negative').max(5, 'Rating cannot exceed 5').optional(),

    skills: z.array(z.string().max(50, 'Skill cannot exceed 50 characters')).optional(),

    availability: z
      .array(
        z.object({
          day: z.string().max(10, 'Day cannot exceed 10 characters'),
          startTime: z.string().max(10, 'Start time cannot exceed 10 characters'),
          endTime: z.string().max(10, 'End time cannot exceed 10 characters'),
        }),
      )
      .optional(),
  }),
});

export const updateAvailabilitySchema = z.object({
  body: z.object({
    isAvailable: z.boolean({
      error: 'Availability status must be true or false',
    }),
  }),
});

export type CreateTechnicianProfileInput = z.infer<typeof createTechnicianProfileSchema>;

export type UpdateTechnicianProfileInput = z.infer<typeof updateTechnicianProfileSchema>['body'] & {
  id: string;
};

export type UpdateAvailabilityInput = z.infer<typeof updateAvailabilitySchema> & { id: string };

export type GetAllTechnicianProfilesInput = {
  sortBy?: 'createdAt' | 'updatedAt' | 'experience' | 'hourlyRate';
  location?: string;
  category?: string;
  isAvailable?: boolean;
};
