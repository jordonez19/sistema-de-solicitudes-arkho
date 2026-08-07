import { Response } from 'express';

export interface ApiResponseData<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown;
}

export class ApiResponse {
  static success<T>(res: Response, data: T, message?: string, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static error(res: Response, message: string, statusCode = 400, errors?: unknown) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors
    });
  }
}
