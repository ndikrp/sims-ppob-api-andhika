# Thesis Management System - Gradia

---

# Instructions

### 1. Install Dependencies

In order to run this project, you need to install dependecies first:

```bash
npm run install
```

### 2. Insert Credential to .env

Copy .env.example and rename it to .env, then give value to each of the variables according to your credential

### 3. Create Database

Create a postgres database called 'sims-ppob'

### 3. Migrate the Database
Migrate the database by running this command:

```bash
npm run migrate:up
```

To drop:

```bash
npm run migrate:down
```

For more run command, please check package.json.
Optional: Run the seeder command for banners and services

### 4. Run the Project

Run the project in development:

```bash
npm run dev
```

Either way:

```bash
npm run start
```

> Development URL for this service is: http://localhost:3000

---