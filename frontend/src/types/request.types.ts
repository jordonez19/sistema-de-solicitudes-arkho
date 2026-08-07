export type RequestPriority = 'baja' | 'media' | 'alta';
export type RequestStatus = 'pendiente' | 'en_proceso' | 'completada';

export interface InternalRequest {
  id: string;
  title: string;
  description: string;
  applicant: string;
  priority: RequestPriority;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestInput {
  title: string;
  description: string;
  applicant: string;
  priority: RequestPriority;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: Array<{ field: string; message: string }>;
}
