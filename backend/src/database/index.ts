import { Pool } from 'pg';
import { config } from '../config/env';

export const pool = new Pool({
  connectionString: config.databaseUrl,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

export const initDb = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL 16 conectado exitosamente.');

    await client.query(`
      CREATE TABLE IF NOT EXISTS internal_requests (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          applicant VARCHAR(255) NOT NULL,
          priority VARCHAR(50) NOT NULL CHECK (priority IN ('baja', 'media', 'alta')),
          status VARCHAR(50) NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'en_proceso', 'completada')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert seeds if table is empty
    const { rowCount } = await client.query('SELECT 1 FROM internal_requests LIMIT 1');
    if (rowCount === 0) {
      await client.query(`
        INSERT INTO internal_requests (title, description, applicant, priority, status)
        VALUES 
          ('Aprobación de presupuesto para servidores cloud', 'Se requiere la aprobación del presupuesto trimestral para el escalamiento de infraestructura AWS.', 'maria.rodriguez@empresa.com', 'alta', 'pendiente'),
          ('Mantenimiento de monitores en sala de conferencias', 'El monitor secundario de la sala B no proyecta señal HDMI correctamente.', 'juan.perez@empresa.com', 'media', 'en_proceso'),
          ('Actualización de licencias de antivirus', 'Renovación anual del software de protección endpoints para 25 estaciones de trabajo.', 'soporte.it@empresa.com', 'baja', 'completada');
      `);
      console.log('🌱 Semillas iniciales insertadas en la base de datos.');
    }

    client.release();
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos PostgreSQL:', error);
  }
};
