import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/api-response';

export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  console.error('🔥 Global Error Handler:', err);

  if (err instanceof AppError) {
    ApiResponse.error(res, err.message, err.statusCode);
    return;
  }

  ApiResponse.error(
    res,
    process.env.NODE_ENV === 'production'
      ? 'Ocurrió un error interno en el servidor'
      : err.message || 'Error no controlado en el servidor',
    500
  );
};
