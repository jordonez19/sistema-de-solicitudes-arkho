export type RequestPriority = 'baja' | 'media' | 'alta';
export type RequestStatus = 'pendiente' | 'en_proceso' | 'completada';

export interface InternalRequest {
  id: string;
  title: string;
  description: string;
  applicant: string;
  priority: RequestPriority;
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRequestInput {
  title: string;
  description: string;
  applicant: string;
  priority: RequestPriority;
}

export interface UpdateRequestStatusInput {
  status: RequestStatus;
}

