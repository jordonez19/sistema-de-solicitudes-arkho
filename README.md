# Sistema de Gestión de Solicitudes Internas

Aplicación Fullstack para el registro, consulta y gestión de solicitudes internas con **Express.js**, **TypeScript**, **PostgreSQL 16**, **React**, **Tailwind CSS**, **pnpm**, **Docker Compose** y **GitHub Actions CI/CD**.

---

## Inicio Rápido con Docker Compose

Toda la solución (PostgreSQL 16, Backend API y Frontend SPA) se levanta con un solo comando, sin requerir más dependencias locales que Docker.

```bash
git clone https://github.com/jordonez19/sistema-de-solicitudes-arkho.git
cd sistema-de-solicitudes-arkho
docker-compose up --build
```

### Servicios Disponibles (Puertos Configurados)

Se asignaron **puertos no conflictivos** para evitar interferencias con otras aplicaciones o bases de datos locales:

| Servicio | Puerto Interno (Contenedor) | Puerto Host (Tu Máquina) | URL de Acceso |
| :--- | :--- | :--- | :--- |
| **Frontend (React + Vite)** | `80` | `5176` | [http://localhost:5176](http://localhost:5176) |
| **Backend API (Express)** | `4000` | `4005` | [http://localhost:4005/api/v1/requests](http://localhost:4005/api/v1/requests) |
| **Base de Datos (PostgreSQL 16)** | `5432` | `5439` | `localhost:5439` (DB: `arkho_db`) |

---

## Arquitectura y Decisiones Técnicas

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
2. **Controller**: Intercepta la petición HTTP, delega la lógica de negocio y responde con una estructura JSON unificada.
3. **Service**: Contiene las reglas de negocio (ej. validación de existencia antes de actualizar estado o editar campos).
4. **Repository**: Abstrae las consultas SQL parametrizadas a PostgreSQL 16 (`pg` Pool).
5. **Model**: Define los tipos de TypeScript, enums de prioridad (`baja`, `media`, `alta`) y estados (`pendiente`, `en_proceso`, `completada`).
6. **Validation**: Reglas de validación declarativas con esquemas **Zod** (`createRequestSchema`, `updateRequestSchema`, `updateRequestStatusSchema`).
7. **Middleware**:
   - `validation.middleware.ts`: Valida de forma genérica body, params o query contra cualquier DTO.
   - `error.middleware.ts`: Captura global de excepciones con códigos HTTP limpios (`400`, `404`, `500`).

---

## Características del Frontend

- **Tablero Kanban estilo Jira**: columnas interactivas (*Pendientes*, *En proceso*, *Completadas*) con Drag & Drop nativo entre columnas.
- **Panel Drawer lateral**: visualizador y editor completo de solicitudes (Título, Descripción, Solicitante, Estado, Prioridad), con el número de ticket (`REQ-XXXX`) en modo solo lectura.
- **Notificaciones Toast**: estilo Ant Design (`message.success`), centradas arriba con cierre automático.
- **Etiquetas de color**: indicadores personalizados (`#94A3B8` Pendiente, `#FCD34D` En proceso, `#86EFAC` Completada, `#F87171` Alta).
- **100% responsivo**: scroll horizontal de columnas en móviles y tarjetas con altura dinámica (`min-h-[180px] h-auto`) para evitar desbordamientos.

---

## Pruebas de API con Postman

En la raíz del proyecto se incluye la colección `arkho_requests.postman_collection.json`.

### Endpoints
- `GET http://localhost:4005/api/v1/requests`: obtiene la lista de solicitudes.
- `POST http://localhost:4005/api/v1/requests`: crea una solicitud con estado por defecto `pendiente`.
- `PUT http://localhost:4005/api/v1/requests/:id`: edición completa de los datos de la solicitud.
- `PATCH http://localhost:4005/api/v1/requests/:id/status`: actualiza el estado a `en_proceso` o `completada`.
- `PATCH http://localhost:4005/api/v1/requests/:id/priority`: cambia la prioridad de una solicitud.

---

## Pruebas Automatizadas y CI/CD

### Pruebas unitarias y cobertura
Pruebas con Jest y mocks de la base de datos (38 pruebas, **99.02% de cobertura**). El proyecto exige una cobertura mínima del 80%.

```bash
cd backend
pnpm test            # ejecutar pruebas unitarias
pnpm test:coverage   # reporte de cobertura
```

### GitHub Actions
`.github/workflows/ci.yml` valida:
1. Compilación de TypeScript y pruebas unitarias Jest en backend.
2. Build de producción de Vite en frontend.
3. Validación sintáctica de Docker Compose.

---

## Tecnologías Utilizadas

- **Gestor de paquetes**: `pnpm`
- **Backend**: Express.js, TypeScript, PostgreSQL 16 (`pg`), Zod, Jest.
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS.
- **Infraestructura & CI/CD**: Docker, Docker Compose, Nginx, GitHub Actions.

---

## Supuestos y Alcance

- Al crear una solicitud, su estado inicial por defecto es `pendiente`.
- El código de ticket (`REQ-XXXX`) es un identificador inmutable de referencia rápida.

### Completado
- [x] Contenerización total con Docker Compose (Postgres 16, Backend, Frontend).
- [x] Pipeline de CI/CD con GitHub Actions.
- [x] Tablero Kanban con Drag & Drop entre columnas.
- [x] Panel Drawer lateral para inspección y edición.
- [x] Notificaciones Toast.
- [x] Diseño responsivo (teléfono, tablet y escritorio).
- [x] Creación, actualización, filtrado y búsqueda de solicitudes.
- [x] Badges de estado y prioridad.
- [x] Pruebas unitarias automatizadas con Jest.

### Pendiente / próximos pasos
- [ ] **Autenticación y autorización**: JWT y roles (Solicitante / Administrador / Agente).
- [ ] **Notificaciones en tiempo real** vía WebSockets o SSE al cambiar estados.
- [ ] **Asignación de responsable** por ticket.
- [ ] **Historial de comentarios** y registro de auditoría.

---

## Uso de Inteligencia Artificial

Se usó IA como copiloto de ingeniería, bajo dirección y auditoría del desarrollador, para acelerar tareas repetitivas: redacción de las pruebas Jest, boilerplate (interfaces, DTOs Zod, controladores, configuración de Docker y CI), clases Tailwind de responsividad y apoyo en el Drag & Drop nativo de HTML5.

Las decisiones de arquitectura (Vertical Slices, PostgreSQL 16, Docker Compose), la corrección de la lógica de estado en React, el ajuste de consultas SQL parametrizadas (`COALESCE`) y la validación final (`tsc --noEmit`, `pnpm test:coverage` y pruebas en contenedores) fueron responsabilidad del desarrollador.
