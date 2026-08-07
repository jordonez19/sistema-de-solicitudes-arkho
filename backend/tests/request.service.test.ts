import { RequestService } from '../src/modules/requests/request.service';
import { RequestRepository } from '../src/modules/requests/request.repository';
import { InternalRequest } from '../src/modules/requests/request.model';
import { AppError } from '../src/middlewares/error.middleware';

// Mock de RequestRepository
jest.mock('../src/modules/requests/request.repository');

describe('RequestService Unit Tests', () => {
  let service: RequestService;
  let mockRepository: jest.Mocked<RequestRepository>;

  const mockRequest: InternalRequest = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Solicitud de prueba',
    description: 'Descripción de prueba unitaria',
    applicant: 'test@empresa.com',
    priority: 'alta',
    status: 'pendiente',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    mockRepository = new RequestRepository() as jest.Mocked<RequestRepository>;
    service = new RequestService(mockRepository);
  });

  describe('getAllRequests', () => {
    it('debe retornar la lista de solicitudes obtenida del repositorio', async () => {
      mockRepository.findAll.mockResolvedValue([mockRequest]);

      const result = await service.getAllRequests();

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Solicitud de prueba');
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getRequestById', () => {
    it('debe retornar una solicitud si existe', async () => {
      mockRepository.findById.mockResolvedValue(mockRequest);

      const result = await service.getRequestById(mockRequest.id);

      expect(result).toEqual(mockRequest);
      expect(mockRepository.findById).toHaveBeenCalledWith(mockRequest.id);
    });

    it('debe lanzar AppError 404 si la solicitud no existe', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.getRequestById('id-inexistente')).rejects.toThrow(AppError);
      await expect(service.getRequestById('id-inexistente')).rejects.toThrow('no encontrada');
    });
  });

  describe('createRequest', () => {
    it('debe crear una nueva solicitud correctamente', async () => {
      const inputData = {
        title: 'Nueva solicitud',
        description: 'Detalle de la nueva solicitud',
        applicant: 'juan@empresa.com',
        priority: 'media' as const
      };

      mockRepository.create.mockResolvedValue({
        ...mockRequest,
        ...inputData
      });

      const result = await service.createRequest(inputData);

      expect(result.title).toBe(inputData.title);
      expect(result.priority).toBe('media');
      expect(mockRepository.create).toHaveBeenCalledWith(inputData);
    });
  });

  describe('updateRequestStatus', () => {
    it('debe actualizar el estado de una solicitud existente', async () => {
      mockRepository.findById.mockResolvedValue(mockRequest);
      mockRepository.updateStatus.mockResolvedValue({
        ...mockRequest,
        status: 'en_proceso'
      });

      const result = await service.updateRequestStatus(mockRequest.id, 'en_proceso');

      expect(result.status).toBe('en_proceso');
      expect(mockRepository.updateStatus).toHaveBeenCalledWith(mockRequest.id, 'en_proceso');
    });

    it('debe lanzar AppError 404 si se intenta actualizar una solicitud inexistente', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.updateRequestStatus('id-inexistente', 'completada')).rejects.toThrow(AppError);
      await expect(service.updateRequestStatus('id-inexistente', 'completada')).rejects.toThrow('no existe');
    });

    it('debe lanzar AppError 500 si la actualización de estado falla en BD', async () => {
      mockRepository.findById.mockResolvedValue(mockRequest);
      mockRepository.updateStatus.mockResolvedValue(null);

      await expect(service.updateRequestStatus(mockRequest.id, 'en_proceso')).rejects.toThrow(AppError);
      await expect(service.updateRequestStatus(mockRequest.id, 'en_proceso')).rejects.toThrow('Error al actualizar el estado');
    });
  });

  describe('updateRequestPriority', () => {
    it('debe actualizar la prioridad de una solicitud existente', async () => {
      mockRepository.findById.mockResolvedValue(mockRequest);
      mockRepository.updatePriority.mockResolvedValue({
        ...mockRequest,
        priority: 'baja'
      });

      const result = await service.updateRequestPriority(mockRequest.id, 'baja');

      expect(result.priority).toBe('baja');
      expect(mockRepository.updatePriority).toHaveBeenCalledWith(mockRequest.id, 'baja');
    });

    it('debe lanzar AppError 404 si se intenta actualizar la prioridad de una solicitud inexistente', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.updateRequestPriority('id-inexistente', 'alta')).rejects.toThrow(AppError);
      await expect(service.updateRequestPriority('id-inexistente', 'alta')).rejects.toThrow('no existe');
    });

    it('debe lanzar AppError 500 si la actualización de prioridad falla en BD', async () => {
      mockRepository.findById.mockResolvedValue(mockRequest);
      mockRepository.updatePriority.mockResolvedValue(null);

      await expect(service.updateRequestPriority(mockRequest.id, 'baja')).rejects.toThrow(AppError);
      await expect(service.updateRequestPriority(mockRequest.id, 'baja')).rejects.toThrow('Error al actualizar la prioridad');
    });
  });

  describe('updateRequest (Edición completa)', () => {
    it('debe actualizar los campos de una solicitud existente', async () => {
      const updateData = {
        title: 'Título editado',
        description: 'Descripción editada',
        applicant: 'editado@empresa.com',
        priority: 'alta' as const,
        status: 'completada' as const
      };

      mockRepository.findById.mockResolvedValue(mockRequest);
      mockRepository.update.mockResolvedValue({
        ...mockRequest,
        ...updateData
      });

      const result = await service.updateRequest(mockRequest.id, updateData);

      expect(result.title).toBe('Título editado');
      expect(result.status).toBe('completada');
      expect(mockRepository.update).toHaveBeenCalledWith(mockRequest.id, updateData);
    });

    it('debe lanzar AppError 404 si se intenta editar una solicitud inexistente', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.updateRequest('id-inexistente', { title: 'Nuevo' })).rejects.toThrow(AppError);
      await expect(service.updateRequest('id-inexistente', { title: 'Nuevo' })).rejects.toThrow('no existe');
    });

    it('debe lanzar AppError 500 si la edición completa falla en BD', async () => {
      mockRepository.findById.mockResolvedValue(mockRequest);
      mockRepository.update.mockResolvedValue(null);

      await expect(service.updateRequest(mockRequest.id, { title: 'Nuevo' })).rejects.toThrow(AppError);
      await expect(service.updateRequest(mockRequest.id, { title: 'Nuevo' })).rejects.toThrow('Error al actualizar la solicitud');
    });
  });

  describe('deleteRequest', () => {
    it('debe eliminar una solicitud existente correctamente', async () => {
      mockRepository.findById.mockResolvedValue(mockRequest);
      mockRepository.delete.mockResolvedValue(true);

      await service.deleteRequest(mockRequest.id);

      expect(mockRepository.findById).toHaveBeenCalledWith(mockRequest.id);
      expect(mockRepository.delete).toHaveBeenCalledWith(mockRequest.id);
    });

    it('debe lanzar AppError 404 si se intenta eliminar una solicitud inexistente', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.deleteRequest('id-inexistente')).rejects.toThrow(AppError);
      await expect(service.deleteRequest('id-inexistente')).rejects.toThrow('no existe');
    });

    it('debe lanzar AppError 500 si la eliminación falla en BD', async () => {
      mockRepository.findById.mockResolvedValue(mockRequest);
      mockRepository.delete.mockResolvedValue(false);

      await expect(service.deleteRequest(mockRequest.id)).rejects.toThrow(AppError);
      await expect(service.deleteRequest(mockRequest.id)).rejects.toThrow('Error al eliminar la solicitud');
    });
  });
});
