import app from './app';
import { config } from './config/env';
import { initDb } from './database/index';

const startServer = async (): Promise<void> => {
  try {
    // Inicializar conexión y tablas en PostgreSQL 16
    await initDb();

    app.listen(config.port, () => {
      console.log(`🚀 Servidor backend Express iniciado en puerto interno ${config.port}`);
      console.log(`📡 Entorno: ${config.nodeEnv}`);
      console.log(`🔗 API Endpoint (Host Docker): http://localhost:4005/api/v1/requests`);
    });
  } catch (error) {
    console.error('❌ Fallo crítico al iniciar el servidor backend:', error);
    process.exit(1);
  }
};

startServer();
