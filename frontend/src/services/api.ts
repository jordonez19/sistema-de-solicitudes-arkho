import { InternalRequest, CreateRequestInput, RequestStatus, RequestPriority, ApiResponse } from '../types/request.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4005/api/v1';

export const apiService = {
  async getRequests(): Promise<InternalRequest[]> {
    const response = await fetch(`${API_URL}/requests`);
    const json: ApiResponse<InternalRequest[]> = await response.json();
    if (!response.ok || !json.success) {
      throw new Error(json.message || 'Error al obtener las solicitudes');
    }
    return json.data;
  },

  async createRequest(input: CreateRequestInput): Promise<InternalRequest> {
    const response = await fetch(`${API_URL}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input)
    });

    const json: ApiResponse<InternalRequest> = await response.json();
    if (!response.ok || !json.success) {
      if (json.errors && json.errors.length > 0) {
        throw new Error(json.errors.map((e) => `${e.field}: ${e.message}`).join(', '));
      }
      throw new Error(json.message || 'Error al crear la solicitud');
    }
    return json.data;
  },

  async updateRequestStatus(id: string, status: RequestStatus): Promise<InternalRequest> {
    const response = await fetch(`${API_URL}/requests/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });

    const json: ApiResponse<InternalRequest> = await response.json();
    if (!response.ok || !json.success) {
      throw new Error(json.message || 'Error al actualizar el estado');
    }
    return json.data;
  },

  async updateRequestPriority(id: string, priority: RequestPriority): Promise<InternalRequest> {
    const response = await fetch(`${API_URL}/requests/${id}/priority`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ priority })
    });

    const json: ApiResponse<InternalRequest> = await response.json();
    if (!response.ok || !json.success) {
      throw new Error(json.message || 'Error al actualizar la prioridad');
    }
    return json.data;
  },

  async updateRequest(id: string, data: Partial<InternalRequest>): Promise<InternalRequest> {
    const response = await fetch(`${API_URL}/requests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const json: ApiResponse<InternalRequest> = await response.json();
    if (!response.ok || !json.success) {
      if (json.errors && json.errors.length > 0) {
        throw new Error(json.errors.map((e) => `${e.field}: ${e.message}`).join(', '));
      }
      throw new Error(json.message || 'Error al actualizar la solicitud');
    }
    return json.data;
  }
};
