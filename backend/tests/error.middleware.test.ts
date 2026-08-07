import { errorHandler, AppError } from '../src/middlewares/error.middleware';
import { Request, Response, NextFunction } from 'express';

describe('Error Middleware Unit Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debe capturar errores de tipo AppError y responder con su statusCode y mensaje', () => {
    const error = new AppError('Solicitud no encontrada', 404);

    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Solicitud no encontrada'
    });
  });

  it('debe responder con 500 para errores genéricos no controlados', () => {
    const error = new Error('Error de servidor no esperado');

    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Error de servidor no esperado',
      errors: undefined
    });
  });
});
