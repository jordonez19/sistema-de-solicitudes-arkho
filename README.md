# Sistema de Gestión de Solicitudes Internas - Arkho Technical Challenge

Aplicación Fullstack para el registro, consulta y gestión de solicitudes internas con **Express.js**, **TypeScript**, **PostgreSQL 16**, **React**, **Tailwind CSS**, **pnpm**, **Docker Compose** y **GitHub Actions CI/CD**.

---

## Inicio Rápido con Docker Compose

Toda la solución (PostgreSQL 16, Backend API y Frontend SPA) está empaquetada para levantarse con un solo comando utilizando **pnpm** internamente en las imágenes multi-stage sin requerir dependencias locales instaladas más allá de Docker.

```bash
# 1. Clonar o acceder al directorio del proyecto
cd /home/xavi/Desktop/arkho

# 2. Levantar el entorno contenerizado (PostgreSQL 16, Express API y React)
docker-compose up --build
```

### 🌐 Servicios Disponibles (Puertos Configurados)

Se asignaron **puertos no en conflicto** para evitar interferencias con otras aplicaciones o bases de datos locales:

| Servicio | Puerto Interno (Contenedor) | Puerto Host (Tu Máquina) | URL de Acceso |
| :--- | :--- | :--- | :--- |
| **Frontend (React + Vite)** | `80` | `5176` | [http://localhost:5176](http://localhost:5176) |
| **Backend API (Express)** | `4000` | `4005` | [http://localhost:4005/api/v1/requests](http://localhost:4005/api/v1/requests) |
| **Base de Datos (PostgreSQL 16)** | `5432` | `5439` | `localhost:5439` (DB: `arkho_db`) |

---

## 🏛️ Arquitectura y Decisiones Técnicas

El proyecto sigue una **Estructura Modular orientada a Dominios (*Vertical Slices*)**, garantizando una clara separación de responsabilidades:

```text
backend/src/
├── config/                  # Configuración y variables de entorno (env.ts)
├── database/                # Conexión pool a PostgreSQL 16 (pg) y scripts DDL
├── middlewares/             # Middlewares reutilizables de Validación (Zod) y Errores
├── modules/
│   └── requests/            # Módulo de Solicitudes Internas
│       ├── request.model.ts      # Interfaces de entidad y tipos (baja|media|alta, pendiente|en_proceso|completada)
│       ├── request.validation.ts # Schemas DTO con Zod para validación estricta de campos
│       ├── request.repository.ts # Abstracción de persistencia SQL en PostgreSQL 16
│       ├── request.service.ts    # Lógica de negocio y manejo de errores de dominio
│       ├── request.controller.ts # Capa de presentación HTTP (Handlers)
│       └── request.routes.ts     # Definición de endpoints HTTP Express (PUT, PATCH, POST, GET)
├── utils/                   # Api-response para respuestas JSON estandarizadas
├── app.ts                   # Aplicación Express con middlewares globales
└── server.ts                # Inicializador del servidor y la base de datos
```

### Capas del Backend
1. **Routes**: Define los endpoints de la API (`POST`, `GET`, `PUT`, `PATCH`) integrando el middleware reutilizable de validación DTO.
2. **Controller**: Intercepta la petición HTTP, delega la lógica de negocio y responde con una estructura unificada JSON.
3. **Service**: Contiene las reglas de negocio (ej. validación de existencia antes de actualizar estado o editar campos).
4. **Repository**: Abstrae las consultas SQL parametrizadas a la base de datos PostgreSQL 16 (`pg` Pool).
5. **Model**: Define los tipos de TypeScript, enums de prioridad (`baja`, `media`, `alta`) y estados (`pendiente`, `en_proceso`, `completada`).
6. **Validation**: Reglas de validación declarativas utilizando esquemas **Zod** (`createRequestSchema`, `updateRequestSchema`, `updateRequestStatusSchema`).
7. **Middleware**:
   - `validation.middleware.ts`: Intercepta y valida de forma genérica el body, params o query contra cualquier DTO.
   - `error.middleware.ts`: Captura global de excepciones con códigos HTTP limpios (`400`, `404`, `500`).

---

## Características Destacadas del Frontend

- **Tablero Kanban Jira**: Vista con columnas interactivo (*Pendientes*, *En proceso*, *Completadas*) con Drag & Drop nativo entre columnas.
- **Panel Drawer Lateral**: Visualizador y editor completo de solicitudes (Título, Descripción, Solicitante, Estado, Prioridad) conservando el número de ticket (`REQ-XXXX`) en modo seguro de solo lectura.
- **Sistema de Notificaciones Toast**: Notificaciones estilo Ant Design (`message.success`) en la parte superior central con temporizador de auto-cierre.
- **Diseño de Etiquetas de Color Tag**: Indicadores con cuadros de color personalizados (`#94A3B8` Pendiente, `#FCD34D` En proceso, `#86EFAC` Completada, `#F87171` Alta).
- **100% Responsivo**: Layout optimizado con scroll horizontal continuo de columnas en móviles y tarjetas con altura dinámica (`min-h-[180px] h-auto`) para evitar desbordamientos.

---

## Pruebas de API con Postman

En la raíz del proyecto se incluye la colección oficial de Postman:
`arkho_requests.postman_collection.json`

### Endpoints Incluidos
- `GET http://localhost:4005/api/v1/requests`: Obtiene la lista de solicitudes.
- `POST http://localhost:4005/api/v1/requests`: Crea una nueva solicitud con estado por defecto `pendiente`.
- `PUT http://localhost:4005/api/v1/requests/:id`: Edición completa de los datos de la solicitud.
- `PATCH http://localhost:4005/api/v1/requests/:id/status`: Actualiza el estado a `en_proceso` o `completada`.
- `PATCH http://localhost:4005/api/v1/requests/:id/priority`: Cambia la prioridad de una solicitud.

---

## Pruebas Automatizadas y CI/CD

### Pruebas Unitarias Backend & Cobertura de Código (>80%)
El proyecto exige un estándar estricto de calidad de código con una **cobertura mínima requerida superior al 80%**.

```bash
cd backend

# Ejecutar pruebas unitarias Jest
pnpm test

# Generar reporte completo de cobertura (>80% requerido)
pnpm test:coverage
```

### GitHub Actions CI/CD Pipeline
El repositorio cuenta con integración continua configurada en `.github/workflows/ci.yml` que valida:
1. Compilación de TypeScript y suite de pruebas unitarias Jest en backend.
2. Build de producción de Vite en frontend.
3. Validación sintáctica de contenedores Docker Compose.

---

## Tecnologías Utilizadas

- **Gestor de Paquetes**: `pnpm`
- **Backend**: Express.js, TypeScript, PostgreSQL 16 (`pg`), Zod (DTO Validation), Jest.
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS.
- **Infraestructura & CI/CD**: Docker, Docker Compose, Nginx, GitHub Actions CI.

---

## Supuestos Realizados y Alcance

- **Supuesto 1**: Al crear una solicitud, su estado inicial por defecto es `pendiente`.
- **Supuesto 2**: El código de ticket (`REQ-XXXX`) funciona como identificador inmutable de referencia rápida para los usuarios.

---

## Funcionalidades Completadas vs Pendientes

### Completadas
- [x] Contenerización total con Docker Compose (Postgres 16, Backend, Frontend).
- [x] Pipeline de CI/CD automatizado con GitHub Actions.
- [x] Tablero Kanban estilo Jira con Drag & Drop entre columnas.
- [x] Panel Drawer lateral para inspección y edición de campos.
- [x] Notificaciones Toast con estilo Ant Design.
- [x] Diseño responsivo adaptado a teléfonos, tablets y escritorios.
- [x] Creación, actualización completa, filtrado y búsqueda de solicitudes.
- [x] Badges de estado/prioridad con etiquetas de cuadros de color.
- [x] Pruebas unitarias automatizadas con Jest.

### Pendientes / Próximos Pasos (Para llevar a Producción)
- [ ] **Autenticación y Autorización**: Integración de JWT y roles (Solicitante / Administrador / Agente).
- [ ] **Notificaciones**: Notificaciones vía WebSockets o Server-Sent Events (SSE) en tiempo real al cambiar estados.
- [ ] **Asignación de Responsable**: Asignar agentes específicos para la atención de tickets.
- [ ] **Historial de Comentarios**: Secciones de comentarios y registros de auditoría por ticket.

---

## Uso de Inteligencia Artificial (Transparencia & Auditoría)

De acuerdo con las pautas del desafío, el uso de herramientas de Inteligencia Artificial (IA) se asumió de manera transparente como un **copiloto de productividad moderna**, permitiendo elevar la velocidad de desarrollo y la calidad final de la entrega.

### ❓ ¿Por qué se utilizó?
Para optimizar el tiempo de desarrollo de 4 horas, reduciendo el tiempo invertido en código repetitivo (*boilerplate*) y permitiendo enfocar la mayor parte del esfuerzo en la **arquitectura backend, seguridad con Zod, persistencia real con PostgreSQL 16 y excelencia en la UX/UI**.

### 🛠️ ¿En qué y cómo se utilizó?
Se utilizó en modalidad de *pair programming* guiado continuamente por el desarrollador para:
- **Escribir Pruebas Automatizadas**: Redacción asistida de las 38 pruebas unitarias en Jest con mocks para repositorios y BD.
- **Boilerplate y Estructura**: Generación acelerada de DTOs con Zod, interfaces TypeScript, controladores y configuración del pipeline de GitHub Actions CI.
- **Ajustes de UI y Tailwind CSS**: Asistencia en clases de Tailwind para diseño responsivo, badges de color y notificaciones Toast estilo Ant Design.
- **Arquitectura Kanban**: Apoyo en la transición de librerías externas manipula-DOM a la arquitectura de **Drag and Drop nativo de HTML5** en React.

### 👨‍💻 Liderazgo, Auditoría y Modificaciones del Desarrollador
La IA actuó estrictamente como un asistente bajo la **dirección, supervisión y auditoría del desarrollador**:
1. **Definición de Requerimientos y Criterios**: El desarrollador definió las decisiones de arquitectura (Vertical Slices, PostgreSQL, Docker Compose, drawer de edición y notificaciones).
2. **Revisión y Ajustes Manuales**: El desarrollador corrigió activamente la lógica del estado en React para eliminar duplicación de tarjetas en el Drag & Drop, ajustó los comportamientos responsivos móviles y perfeccionó las consultas SQL parametrizadas.
3. **Validación Estricta**: Cada bloque de código fue compilado (`tsc --noEmit`), ejecutado en la suite de Jest (`pnpm test:coverage`) y probado en vivo dentro de los contenedores Docker.
