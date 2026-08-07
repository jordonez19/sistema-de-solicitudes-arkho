import { validateDto } from '../src/middlewares/validation.middleware';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

describe('Validation Middleware Unit Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  const dummySchema = z.object({
    body: z.object({
      title: z.string().min(3, 'El título debe tener al menos 3 caracteres')
    })
  });

  beforeEach(() => {
    mockRequest = {
      body: {},
      query: {},
      params: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
  });

  it('debe llamar a next() si los datos cumplen con el esquema Zod', async () => {
    mockRequest.body = { title: 'Título válido' };

    const middleware = validateDto(dummySchema);
    await middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('debe responder 400 Bad Request si los datos fallan la validación Zod', async () => {
    mockRequest.body = { title: 'A' };

    const middleware = validateDto(dummySchema);
    await middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Error de validación en la solicitud',
      errors: expect.arrayContaining([
        expect.objectContaining({
          field: 'title',
          message: 'El título debe tener al menos 3 caracteres'
        })
      ])
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
