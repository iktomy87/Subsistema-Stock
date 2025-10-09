
# Sistema de Gestión de Productos y Stock

Una API RESTful desarrollada con NestJS para la gestión completa de productos, categorías y control de inventario con sistema de reservas.

## 📋 Prerrequisitos Mínimos
* Node.js (Descargar desde [Nodejs.org](https://nodejs.org/en/download))

* npm (viene con Node.js)

* Git (para clonar el repositorio)


## Instalación del proyecto

### 1. Clonar el repositorio
```
git clone <url-del-repositorio>
cd backend
```
### 2. Instalar dependencias
```
npm install
```
### 3. Configurar entorno
```
# Copiar archivo de configuración
cp .env.example .env
```
### 4. Crear y modificar variables de entorno

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=nombre_db

```
### 5. Ejecutar la aplicación

```
npm run start:dev

```

## Ingresar a la interfaz Swagger
```
http://localhost:3000/api
```

## Módulo de Autenticación (No implementado)

El módulo de autenticación se encargará de proteger los endpoints de la API. Actualmente, no está implementado.

## Módulo de Categorías

El módulo de categorías se encarga de gestionar las categorías de productos en el sistema.

### Endpoints

A continuación se describen los endpoints disponibles para el módulo de categorías:

- `GET /api/categorias`: Obtiene todas las categorías activas, ordenadas por nombre.
- `GET /api/categorias/:id`: Obtiene una categoría específica por su ID.
- `POST /api/categorias`: Crea una nueva categoría.
- `PATCH /api/categorias/:id`: Actualiza una categoría existente.
- `DELETE /api/categorias/:id`: Desactiva una categoría (borrado lógico).

## Módulo de Productos

El módulo de productos se encarga de gestionar los productos del sistema.

### Endpoints

A continuación se describen los endpoints disponibles para el módulo de productos:

- `GET /api/productos`: Obtiene todos los productos activos, con opción de paginación, búsqueda por nombre y filtro por categoría.
- `GET /api/productos/:id`: Obtiene un producto específico por su ID.
- `POST /api/productos`: Crea un nuevo producto.
- `PATCH /api/productos/:id`: Actualiza un producto existente.
- `DELETE /api/productos/:id`: Desactiva un producto (borrado lógico).

## Módulo de Reservas

El módulo de reservas se encarga de gestionar las reservas de stock de productos.

### Endpoints

A continuación se describen los endpoints disponibles para el módulo de reservas:

- `POST /api/reservas/reservar`: Crea una nueva reserva de stock para una lista de productos.
- `POST /api/reservas/liberar`: Libera el stock de una reserva existente.
- `GET /api/reservas/reservas/:idReserva`: Consulta el estado de una reserva específica.




