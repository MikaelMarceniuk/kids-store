# 🛡️ Kids Toy Store

A full-stack user management system built with **NestJS**, **Next.js**, and **Prisma**. It provides authentication (JWT), user roles, and a modern UI to manage users in real time.

## 📦 Tech Stack

### Backend (NestJS)

- ⚙️ NestJS
- 🧬 Prisma ORM
- 🐘 PostgreSQL
- 🔐 JWT + Refresh Tokens
- 🧪 Jest (unit + e2e tests)
- 🐳 Testcontainers (in-memory DB for tests)

### Frontend (Next.js)

- ⚛️ React + App Router
- 🧩 React Hook Form + Zod
- 📊 TanStack React Table
- 🎨 TailwindCSS
- 🧠 Radix UI (ShadCN)
- ⏳ use-debounce (filters)

---

## 🚀 Getting Started

### 1. Clone o projeto

```bash
git clone https://github.com/MikaelMarceniuk/kids-store
cd kids-store
```

### 2. Preencher as .env do Backend

```bash
cd apps/backend
cp .env.example .env
```

### 3. Instalar as dependencias

```bash
yarn install (no root do projeto)
docker compose up
```

### 4

```bash
Para logar como admin, use as seguintes credenciais
admin@kidstoystore.com
12345678

Para logar com outro usuario, pode-se criar outro pela aplicacao, ou buscar no banco de dados. A senha para todos os usuario e "12345678"
```

---

## 🧪 Running Tests

```bash
cd apps/backend
yarn test:unit
```

> O backend utiliza Testcontainers para rodar testes com banco PostgreSQL em memória.

---

## 📄 Features

- [x] Login com JWT e Refresh Token
- [x] Tabela de usuários com filtros
- [x] Criação, edição e remoção de usuários
- [x] Validações com Zod
- [x] Design acessível com Radix e Tailwind
- [x] Testes unitários e E2E com banco isolado

---

## 🧑‍💻 Autor

Feito por [Mikael Marceniuk](https://github.com/MikaelMarceniuk)

---

## 📄 License

Este projeto está licenciado sob a [MIT License](LICENSE).
