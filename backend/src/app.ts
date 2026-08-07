import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config/env';
import requestRoutes from './modules/requests/request.routes';
import { errorHandler } from './middlewares/error.middleware';

const app: Application = express();

// Middlewares globales
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint de Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rutas de la API
app.use('/api/v1/requests', requestRoutes);

// Handling 404 Route Not Found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.method} ${req.originalUrl} no encontrada.`
  });
});

// Middleware Global de Errores
app.use(errorHandler);

export default app;
