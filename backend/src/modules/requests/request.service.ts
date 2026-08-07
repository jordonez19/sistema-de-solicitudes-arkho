import { RequestRepository } from './request.repository';
import { InternalRequest, CreateRequestInput, RequestStatus, RequestPriority } from './request.model';
import { AppError } from '../../middlewares/error.middleware';

export class RequestService {
  constructor(private readonly repository: RequestRepository = new RequestRepository()) {}

  async getAllRequests(): Promise<InternalRequest[]> {
    return await this.repository.findAll();
  }

  async getRequestById(id: string): Promise<InternalRequest> {
    const request = await this.repository.findById(id);
    if (!request) {
      throw new AppError(`Solicitud con ID '${id}' no encontrada`, 404);
    }
    return request;
  }

  async createRequest(data: CreateRequestInput): Promise<InternalRequest> {
    return await this.repository.create(data);
  }

  async updateRequestStatus(id: string, status: RequestStatus): Promise<InternalRequest> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new AppError(`No se puede actualizar. Solicitud con ID '${id}' no existe.`, 404);
    }

    const updated = await this.repository.updateStatus(id, status);
    if (!updated) {
      throw new AppError('Error al actualizar el estado de la solicitud', 500);
    }

    return updated;
  }

  async updateRequestPriority(id: string, priority: RequestPriority): Promise<InternalRequest> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new AppError(`No se puede actualizar. Solicitud con ID '${id}' no existe.`, 404);
    }

    const updated = await this.repository.updatePriority(id, priority);
    if (!updated) {
      throw new AppError('Error al actualizar la prioridad de la solicitud', 500);
    }

    return updated;
  }

  async updateRequest(id: string, data: Partial<InternalRequest>): Promise<InternalRequest> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new AppError(`No se puede actualizar. Solicitud con ID '${id}' no existe.`, 404);
    }

    const updated = await this.repository.update(id, data);
    if (!updated) {
      throw new AppError('Error al actualizar la solicitud', 500);
    }

    return updated;
  }
}
