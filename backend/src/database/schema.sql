-- PostgreSQL 16 Table Schema for Internal Requests

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

-- Seed initial data if empty
INSERT INTO internal_requests (title, description, applicant, priority, status)
SELECT 
    'Aprobación de presupuesto para servidores cloud', 
    'Se requiere la aprobación del presupuesto trimestral para el escalamiento de infraestructura AWS.', 
    'maria.rodriguez@empresa.com', 
    'alta', 
    'pendiente'
WHERE NOT EXISTS (SELECT 1 FROM internal_requests);

INSERT INTO internal_requests (title, description, applicant, priority, status)
SELECT 
    'Mantenimiento de monitores en sala de conferencias', 
    'El monitor secundario de la sala B no proyecta señal HDMI correctamente.', 
    'juan.perez@empresa.com', 
    'media', 
    'en_proceso'
WHERE NOT EXISTS (SELECT 1 FROM internal_requests WHERE title = 'Mantenimiento de monitores en sala de conferencias');

INSERT INTO internal_requests (title, description, applicant, priority, status)
SELECT 
    'Actualización de licencias de antivirus', 
    'Renovación anual del software de protección endpoints para 25 estaciones de trabajo.', 
    'soporte.it@empresa.com', 
    'baja', 
    'completada'
WHERE NOT EXISTS (SELECT 1 FROM internal_requests WHERE title = 'Actualización de licencias de antivirus');
