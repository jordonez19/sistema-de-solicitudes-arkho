import { pool } from '../../database/index';
import { InternalRequest, CreateRequestInput, RequestStatus, RequestPriority } from './request.model';

export class RequestRepository {
  async findAll(): Promise<InternalRequest[]> {
    const query = `
      SELECT 
        id, 
        title, 
        description, 
        applicant, 
        priority, 
        status, 
        created_at AS "createdAt", 
        updated_at AS "updatedAt"
      FROM internal_requests
      ORDER BY created_at DESC;
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  async findById(id: string): Promise<InternalRequest | null> {
    const query = `
      SELECT 
        id, 
        title, 
        description, 
        applicant, 
        priority, 
        status, 
        created_at AS "createdAt", 
        updated_at AS "updatedAt"
      FROM internal_requests
      WHERE id = $1;
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  }

  async create(data: CreateRequestInput): Promise<InternalRequest> {
    const query = `
      INSERT INTO internal_requests (title, description, applicant, priority, status)
      VALUES ($1, $2, $3, $4, 'pendiente')
      RETURNING 
        id, 
        title, 
        description, 
        applicant, 
        priority, 
        status, 
        created_at AS "createdAt", 
        updated_at AS "updatedAt";
    `;
    const values = [data.title, data.description, data.applicant, data.priority];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async updateStatus(id: string, status: RequestStatus): Promise<InternalRequest | null> {
    const query = `
      UPDATE internal_requests
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING 
        id, 
        title, 
        description, 
        applicant, 
        priority, 
        status, 
        created_at AS "createdAt", 
        updated_at AS "updatedAt";
    `;
    const { rows } = await pool.query(query, [status, id]);
    return rows[0] || null;
  }

  async updatePriority(id: string, priority: RequestPriority): Promise<InternalRequest | null> {
    const query = `
      UPDATE internal_requests
      SET priority = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING 
        id, 
        title, 
        description, 
        applicant, 
        priority, 
        status, 
        created_at AS "createdAt", 
        updated_at AS "updatedAt";
    `;
    const { rows } = await pool.query(query, [priority, id]);
    return rows[0] || null;
  }

  async update(id: string, data: Partial<InternalRequest>): Promise<InternalRequest | null> {
    const query = `
      UPDATE internal_requests
      SET 
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        applicant = COALESCE($3, applicant),
        priority = COALESCE($4, priority),
        status = COALESCE($5, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING 
        id, 
        title, 
        description, 
        applicant, 
        priority, 
        status, 
        created_at AS "createdAt", 
        updated_at AS "updatedAt";
    `;
    const values = [
      data.title ?? null,
      data.description ?? null,
      data.applicant ?? null,
      data.priority ?? null,
      data.status ?? null,
      id
    ];
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  }
}
