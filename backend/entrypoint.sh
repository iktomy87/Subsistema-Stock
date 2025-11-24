#!/bin/sh

echo "Ejecutando migraciones de la base de datos..."
npm run migration:run

echo "Ejecutando seeder de la base de datos..."
npm run seed

echo "Iniciando aplicación..."
exec "$@"