import { ApiResponse } from '../src/utils/api-response';
import { Response } from 'express';

describe('ApiResponse Utility Unit Tests', () => {
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('success', () => {
    it('debe responder con estado 200 por defecto y formato JSON exitoso', () => {
      const data = { id: 1, name: 'Test' };

      ApiResponse.success(mockResponse as Response, data, 'Operación exitosa');

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data,
        message: 'Operación exitosa'
      });
    });

    it('debe permitir especificar un código de estado HTTP personalizado (ej. 201 Created)', () => {
      const data = { id: 2 };

      ApiResponse.success(mockResponse as Response, data, 'Creado con éxito', 201);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data,
        message: 'Creado con éxito'
      });
    });
  });

  describe('error', () => {
    it('debe responder con formato de error estandarizado', () => {
      const errors = [{ field: 'title', message: 'Obligatorio' }];

      ApiResponse.error(mockResponse as Response, 'Error de validación', 400, errors);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error de validación',
        errors
      });
    });
  });
});
