# Sistema de Gestión de Solicitudes Internas - Arkho Technical Challenge

Aplicación Fullstack para el registro, consulta y gestión de solicitudes internas con **Express.js**, **TypeScript**, **PostgreSQL 16**, **React**, **Tailwind CSS**, **pnpm** y **Docker Compose**.

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
│       └── request.routes.ts     # Definición de endpoints HTTP Express
├── utils/                   # Api-response para respuestas JSON estandarizadas
├── app.ts                   # Aplicación Express con middlewares globales
└── server.ts                # Inicializador del servidor y la base de datos
```

### Capas del Backend
1. **Routes**: Define los endpoints de la API (`POST`, `GET`, `PATCH`) integrando el middleware reutilizable de validación DTO.
2. **Controller**: Intercepta la petición HTTP, delega la lógica de negocio y responde con una estructura unificada JSON.
3. **Service**: Contiene las reglas de negocio (ej. validación de existencia antes de actualizar estado).
4. **Repository**: Abstrae las consultas SQL parametrizadas a la base de datos PostgreSQL 16 (`pg` Pool).
5. **Model**: Define los tipos de TypeScript, enums de prioridad (`baja`, `media`, `alta`) y estados (`pendiente`, `en_proceso`, `completada`).
6. **Validation**: Reglas de validación declarativas utilizando esquemas **Zod** (`createRequestSchema`, `updateRequestStatusSchema`).
7. **Middleware**:
   - `validation.middleware.ts`: Intercepta y valida de forma genérica el body, params o query contra cualquier DTO.
   - `error.middleware.ts`: Captura global de excepciones con códigos HTTP limpios (`400`, `404`, `500`).

---

## 📮 Pruebas de API con Postman

En la raíz del proyecto se incluye la colección oficial de Postman:
📄 `arkho_requests.postman_collection.json`

### Endpoints Incluidos
- `GET http://localhost:4005/api/v1/requests`: Obtiene la lista de solicitudes.
- `POST http://localhost:4005/api/v1/requests`: Crea una nueva solicitud con estado por defecto `pendiente`.
- `POST http://localhost:4005/api/v1/requests` *(Error validation test)*: Prueba del middleware de validación DTO al enviar campos inválidos (retorna `400 Bad Request`).
- `PATCH http://localhost:4005/api/v1/requests/:id/status`: Actualiza el estado a `en_proceso` o `completada`.

---

## 🧪 Pruebas Automatizadas (pnpm)

El backend incluye pruebas unitarias para la capa de servicios y repositorios usando **Jest**.

Para ejecutarlas de manera local usando `pnpm`:

```bash
cd backend
pnpm install
pnpm test
```

---

## 🛠️ Tecnologías Utilizadas

- **Gestor de Paquetes**: `pnpm`
- **Backend**: Express.js, TypeScript, PostgreSQL 16 (`pg`), Zod (DTO Validation), Jest.
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons.
- **Infraestructura**: Docker, Docker Compose, Nginx (frontend runner), PostgreSQL 16 Alpine.

---

## 💡 Supuestos Realizados y Alcance

- **Supuesto 1**: No se requiere autenticación de usuarios en esta primera versión (acceso público interno).
- **Supuesto 2**: Al crear una solicitud, su estado inicial siempre inicia en `pendiente`.
- **Supuesto 3**: Las fechas de creación y actualización son manejadas por el motor de base de datos con timestamps UTC.

---

## 📋 Funcionalidades Completadas vs Pendientes

### ✅ Completadas
- [x] Contenerización total con Docker Compose (Postgres 16, Backend, Frontend).
- [x] Integración de `pnpm` como gestor de paquetes para backend, frontend y Dockerfiles.
- [x] Creación de solicitudes desde el frontend con formulario validado.
- [x] Listado de solicitudes registradas ordenadas por fecha.
- [x] Badges visuales de prioridad y estado con código de colores.
- [x] Cambio interactivo de estado (`pendiente` -> `en_proceso` -> `completada`) en tiempo real.
- [x] Validación de campos obligatorios en cliente y backend (DTOs Zod).
- [x] Mensajes de error claros e indicadores de carga.
- [x] Filtros por estado, prioridad y buscador por texto.
- [x] Pruebas unitarias automatizadas.

### ⏳ Pendientes / Próximos Pasos (Con más tiempo)
- [ ] **Autenticación y Autorización**: Integración de JWT y roles (Solicitante / Administrador).
- [ ] **Notificaciones**: Notificar vía WebSocket o Server-Sent Events (SSE) cuando cambia el estado de una solicitud.
- [ ] **Asignación de Responsable**: Permitir asignar a un usuario del equipo para resolver la solicitud.
- [ ] **Comentarios**: Sistema de hilo de comentarios dentro de cada solicitud.

---

## 🤖 Uso de Inteligencia Artificial (Transparencia)

De acuerdo con las pautas del desafío:
- **Para qué se utilizó**: Generación de la estructura base modular, plantillas de Docker multi-stage y estilos de Tailwind CSS.
- **Partes revisadas y modificadas**: Se ajustaron manualmente los esquemas DTO de Zod, el middleware de validación, la consulta SQL parametrizada de PostgreSQL, el cambio a `pnpm` y la reconfiguración de puertos para evitar conflictos en la máquina del usuario.
- **Validación realizada**: Se verificaron los tipos de TypeScript (`tsc`), se ejecutaron las pruebas unitarias con `jest` y se comprobó la interoperabilidad del contenedor `docker-compose`.
