import { Request, Response, NextFunction } from 'express';
import { RequestService } from './request.service';
import { ApiResponse } from '../../utils/api-response';

export class RequestController {
  constructor(private readonly service: RequestService = new RequestService()) {}

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requests = await this.service.getAllRequests();
      ApiResponse.success(res, requests, 'Solicitudes obtenidas exitosamente');
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const request = await this.service.getRequestById(id);
      ApiResponse.success(res, request, 'Solicitud obtenida exitosamente');
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const newRequest = await this.service.createRequest(req.body);
      ApiResponse.success(res, newRequest, 'Solicitud creada exitosamente', 201);
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await this.service.updateRequestStatus(id, status);
      ApiResponse.success(res, updated, 'Estado de la solicitud actualizado correctamente');
    } catch (error) {
      next(error);
    }
  };

  updatePriority = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { priority } = req.body;
      const updated = await this.service.updateRequestPriority(id, priority);
      ApiResponse.success(res, updated, 'Prioridad de la solicitud actualizada correctamente');
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updated = await this.service.updateRequest(id, req.body);
      ApiResponse.success(res, updated, 'Solicitud actualizada correctamente');
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.service.deleteRequest(id);
      ApiResponse.success(res, null, 'Solicitud eliminada correctamente');
    } catch (error) {
      next(error);
    }
  };
}
