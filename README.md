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

## Uso de Inteligencia Artificial (Transparencia, Criterio & Auditoría)

De acuerdo con las pautas del desafío, el uso de herramientas de Inteligencia Artificial (IA) se asumió de manera transparente como un **multiplicador de productividad y copiloto de ingeniería**, enfocado en maximizar la calidad y acelerar el tiempo de desarrollo.

### ¿Por qué se utilizó?
Para optimizar el tiempo de desarrollo de 4 horas, eliminando la fricción de escribir código repetitivo (*boilerplate*) y permitiendo enfocar la mayor parte del esfuerzo humano en la **arquitectura backend, seguridad estricta con Zod, persistencia real en PostgreSQL 16 y excelencia en la experiencia de usuario (UX/UI)**.

### ¿En qué y cómo se utilizó?
Se utilizó en modalidad de *pair programming* guiado paso a paso por las directrices del desarrollador para:
- **Escribir Pruebas Automatizadas**: Redacción acelerada de 38 pruebas unitarias con Jest y mocks de BD, alcanzando un **99.02% de cobertura de código**.
- **Boilerplate y Configuración**: Generación inicial de interfaces TypeScript, DTOs de Zod, controladores Express y configuraciones de Tailwind CSS, Docker Compose y GitHub Actions CI.
- **Maquetado UI y Ajustes de Responsividad**: Asistencia en clases utilitarias de Tailwind CSS para la adaptación móvil (tarjetas dinámicas `min-h-[180px]` y scroll de columnas).
- **Lógica de Drag & Drop**: Apoyo en la arquitectura del tablero Kanban sustituyendo librerías manipuladoras de DOM por Drag and Drop nativo de HTML5 en React.

### Liderazgo Técnico, Auditoría y Modificaciones del Desarrollador
La IA actuó exclusivamente bajo la **dirección, supervisión y auditoría del desarrollador**:
1. **Definición de Requerimientos**: El desarrollador estableció la visión del producto, los supuestos de negocio y las decisiones de arquitectura (Vertical Slices, PostgreSQL 16, Docker Compose, Drawer de edición y Toasts estilo Ant Design).
2. **Revisión y Ajustes Manuales**: El desarrollador corrigió activamente la lógica de estado en React para eliminar duplicaciones de tarjetas en el Kanban, ajustó los selectores nativos en móviles para evitar desfases visuales y perfeccionó las consultas SQL parametrizadas con `COALESCE`.
3. **Validación y Pruebas Reales**: Cada propuesta de código fue auditada, compilada estrictamente (`tsc --noEmit`), probada mediante Jest (`pnpm test:coverage`) y verificada en vivo en los contenedores contenerizados con Docker Compose.
