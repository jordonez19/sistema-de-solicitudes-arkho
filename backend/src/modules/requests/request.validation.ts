import { z } from 'zod';

export const createRequestSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'El título es obligatorio' })
      .trim()
      .min(3, 'El título debe tener al menos 3 caracteres')
      .max(255, 'El título no puede exceder 255 caracteres'),
    description: z
      .string({ required_error: 'La descripción es obligatoria' })
      .trim()
      .min(5, 'La descripción debe tener al menos 5 caracteres'),
    applicant: z
      .string({ required_error: 'El nombre o correo del solicitante es obligatorio' })
      .trim()
      .min(2, 'El solicitante debe tener al menos 2 caracteres'),
    priority: z.enum(['baja', 'media', 'alta'], {
      required_error: 'La prioridad es obligatoria',
      invalid_type_error: 'La prioridad debe ser baja, media o alta'
    })
  })
});

export const updateRequestStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('El ID debe ser un UUID válido')
  }),
  body: z.object({
    status: z.enum(['pendiente', 'en_proceso', 'completada'], {
      required_error: 'El nuevo estado es obligatorio',
      invalid_type_error: 'El estado debe ser pendiente, en_proceso o completada'
    })
  })
});

export const updateRequestPrioritySchema = z.object({
  params: z.object({
    id: z.string().uuid('El ID debe ser un UUID válido')
  }),
  body: z.object({
    priority: z.enum(['baja', 'media', 'alta'], {
      required_error: 'La nueva prioridad es obligatoria',
      invalid_type_error: 'La prioridad debe ser baja, media o alta'
    })
  })
});

export const updateRequestSchema = z.object({
  params: z.object({
    id: z.string().uuid('El ID debe ser un UUID válido')
  }),
  body: z.object({
    title: z.string().trim().min(3, 'El título debe tener al menos 3 caracteres').optional(),
    description: z.string().trim().min(5, 'La descripción debe tener al menos 5 caracteres').optional(),
    applicant: z.string().trim().min(2, 'El solicitante debe tener al menos 2 caracteres').optional(),
    priority: z.enum(['baja', 'media', 'alta']).optional(),
    status: z.enum(['pendiente', 'en_proceso', 'completada']).optional()
  })
});

export const deleteRequestSchema = z.object({
  params: z.object({
    id: z.string().uuid('El ID debe ser un UUID válido')
  })
});
