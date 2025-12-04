import { z } from 'zod';
import { SimulationType } from '../types';

export const createSimulationSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum([SimulationType.PROJECTILE, SimulationType.SPRING_MASS, SimulationType.TWO_BODY_ORBIT]),
  parameters: z.record(z.any()),
  isPublic: z.boolean().optional().default(false)
});

export const updateSimulationSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  parameters: z.record(z.any()).optional(),
  isPublic: z.boolean().optional()
});

export type CreateSimulationInput = z.infer<typeof createSimulationSchema>;
export type UpdateSimulationInput = z.infer<typeof updateSimulationSchema>;
