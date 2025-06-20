#!/bin/sh

# Executa as migrations
npx prisma migrate deploy

# Executa as seeds
npx prisma db seed

echo "Iniciando a aplicação..."
exec yarn start:dev
