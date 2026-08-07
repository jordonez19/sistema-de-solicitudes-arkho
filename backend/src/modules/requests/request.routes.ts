import { Router } from 'express';
import { RequestController } from './request.controller';
import { validateDto } from '../../middlewares/validation.middleware';
import {
  createRequestSchema,
  updateRequestStatusSchema,
  updateRequestPrioritySchema,
  updateRequestSchema
} from './request.validation';

const router = Router();
const controller = new RequestController();

// GET /api/v1/requests - Obtener todas las solicitudes
router.get('/', controller.getAll);

// GET /api/v1/requests/:id - Obtener solicitud por ID
router.get('/:id', controller.getById);

// POST /api/v1/requests - Crear solicitud (con validación DTO)
router.post('/', validateDto(createRequestSchema), controller.create);

// PUT /api/v1/requests/:id - Editar solicitud completa (título, descripción, solicitante, prioridad, estado)
router.put('/:id', validateDto(updateRequestSchema), controller.update);

// PATCH /api/v1/requests/:id/status - Cambiar estado de solicitud (con validación DTO)
router.patch('/:id/status', validateDto(updateRequestStatusSchema), controller.updateStatus);

// PATCH /api/v1/requests/:id/priority - Cambiar prioridad de solicitud (con validación DTO)
router.patch('/:id/priority', validateDto(updateRequestPrioritySchema), controller.updatePriority);

export default router;
