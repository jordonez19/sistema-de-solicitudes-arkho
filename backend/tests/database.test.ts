import { initDb, pool } from '../src/database';

describe('Database Index Unit Tests', () => {
  let mockClient: {
    query: jest.Mock;
    release: jest.Mock;
  };

  beforeEach(() => {
    mockClient = {
      query: jest.fn(),
      release: jest.fn()
    };
    (pool.connect as unknown as jest.Mock) = jest.fn().mockResolvedValue(mockClient);
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debe inicializar la tabla y sembrar datos si la tabla está vacía (rowCount = 0)', async () => {
    mockClient.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rowCount: 0 })
      .mockResolvedValueOnce({ rows: [] });

    await initDb();

    expect(pool.connect).toHaveBeenCalled();
    expect(mockClient.query).toHaveBeenCalledTimes(3);
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('debe inicializar la tabla sin sembrar si la tabla ya contiene registros (rowCount > 0)', async () => {
    mockClient.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rowCount: 1 });

    await initDb();

    expect(pool.connect).toHaveBeenCalled();
    expect(mockClient.query).toHaveBeenCalledTimes(2);
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('debe capturar y loguear errores si la conexión o consulta falla', async () => {
    (pool.connect as unknown as jest.Mock) = jest.fn().mockRejectedValueOnce(new Error('Conexión fallida'));

    await initDb();

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Error al inicializar la base de datos'),
      expect.any(Error)
    );
  });
});
