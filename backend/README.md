
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

