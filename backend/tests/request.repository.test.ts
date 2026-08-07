import { RequestRepository } from '../src/modules/requests/request.repository';
import { pool } from '../src/database';

jest.mock('../src/database', () => ({
  pool: {
    query: jest.fn()
  }
}));

describe('RequestRepository Unit Tests', () => {
  let repository: RequestRepository;
  const mockPoolQuery = pool.query as jest.Mock;

  const mockDbRow = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Solicitud test',
    description: 'Descripción test',
    applicant: 'test@empresa.com',
    priority: 'alta',
    status: 'pendiente',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    repository = new RequestRepository();
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('debe ejecutar la consulta SQL y retornar un arreglo de solicitudes', async () => {
      mockPoolQuery.mockResolvedValue({ rows: [mockDbRow] });

      const result = await repository.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Solicitud test');
      expect(mockPoolQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'));
    });
  });

  describe('findById', () => {
    it('debe retornar una solicitud si la consulta encuentra un registro', async () => {
      mockPoolQuery.mockResolvedValue({ rows: [mockDbRow] });

      const result = await repository.findById(mockDbRow.id);

      expect(result).toEqual(mockDbRow);
      expect(mockPoolQuery).toHaveBeenCalledWith(expect.stringContaining('WHERE id = $1'), [mockDbRow.id]);
    });

    it('debe retornar null si no se encuentra ningún registro', async () => {
      mockPoolQuery.mockResolvedValue({ rows: [] });

      const result = await repository.findById('id-inexistente');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('debe insertar una nueva solicitud y retornar la fila creada', async () => {
      mockPoolQuery.mockResolvedValue({ rows: [mockDbRow] });

      const inputData = {
        title: 'Solicitud test',
        description: 'Descripción test',
        applicant: 'test@empresa.com',
        priority: 'alta' as const
      };

      const result = await repository.create(inputData);

      expect(result).toEqual(mockDbRow);
      expect(mockPoolQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO internal_requests'),
        [inputData.title, inputData.description, inputData.applicant, inputData.priority]
      );
    });
  });

  describe('updateStatus', () => {
    it('debe actualizar el estado y retornar el registro actualizado', async () => {
      const updatedRow = { ...mockDbRow, status: 'en_proceso' };
      mockPoolQuery.mockResolvedValue({ rows: [updatedRow] });

      const result = await repository.updateStatus(mockDbRow.id, 'en_proceso');

      expect(result).toEqual(updatedRow);
      expect(mockPoolQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE internal_requests'),
        ['en_proceso', mockDbRow.id]
      );
    });

    it('debe retornar null si la actualización no afectó ninguna fila', async () => {
      mockPoolQuery.mockResolvedValue({ rows: [] });

      const result = await repository.updateStatus('id-inexistente', 'completada');

      expect(result).toBeNull();
    });
  });

  describe('updatePriority', () => {
    it('debe actualizar la prioridad y retornar el registro actualizado', async () => {
      const updatedRow = { ...mockDbRow, priority: 'baja' };
      mockPoolQuery.mockResolvedValue({ rows: [updatedRow] });

      const result = await repository.updatePriority(mockDbRow.id, 'baja');

      expect(result).toEqual(updatedRow);
      expect(mockPoolQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE internal_requests'),
        ['baja', mockDbRow.id]
      );
    });

    it('debe retornar null si la actualización de prioridad no afectó ninguna fila', async () => {
      mockPoolQuery.mockResolvedValue({ rows: [] });

      const result = await repository.updatePriority('id-inexistente', 'alta');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('debe actualizar múltiples campos y retornar el registro actualizado', async () => {
      const updateData = { title: 'Nuevo título', description: 'Nueva desc' };
      const updatedRow = { ...mockDbRow, ...updateData };
      mockPoolQuery.mockResolvedValue({ rows: [updatedRow] });

      const result = await repository.update(mockDbRow.id, updateData);

      expect(result).toEqual(updatedRow);
      expect(mockPoolQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE internal_requests'),
        [updateData.title, updateData.description, null, null, null, mockDbRow.id]
      );
    });

    it('debe retornar null si la actualización completa no afectó ninguna fila', async () => {
      mockPoolQuery.mockResolvedValue({ rows: [] });

      const result = await repository.update('id-inexistente', { title: 'Test' });

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('debe eliminar la fila y retornar true si rowCount > 0', async () => {
      mockPoolQuery.mockResolvedValue({ rowCount: 1 });

      const result = await repository.delete(mockDbRow.id);

      expect(result).toBe(true);
      expect(mockPoolQuery).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM internal_requests WHERE id = $1'),
        [mockDbRow.id]
      );
    });

    it('debe retornar false si no se eliminó ninguna fila (rowCount = 0)', async () => {
      mockPoolQuery.mockResolvedValue({ rowCount: 0 });

      const result = await repository.delete('id-inexistente');

      expect(result).toBe(false);
    });
  });
});
