# Laundry POS (Back-end)

## Overview

The project specification described [here](./docs/overview.md)

### Getting started

#### Tech stacks

- Node v20 (LTS) or later
- PostgresSQL 17 or later

#### Pre-requisites

- Create database and define it later in `.env` file
- For file integration to Google Cloud purpose, require the following setup in your Google Cloud:
  - Google Cloud Platform (GCP) setup:
    - Project ID
    - Private Key ID
    - Client email
    - Private key
  - Google Cloud Storage (GCS) setup:
    - Bucket name

#### Steps

- Clone this project to your local environment
- Duplicate the `.env.example` file to `.env`

  ```env
  # Environment = DEVELOPMENT | PRODUCTION
  NODE_ENV=

  # Back-end Application Port (Default = 3000)
  PORT=

  # PostgreSQL database connection
  DATABASE_URL=postgresql://role:password@hostname:port/db_name

  # JWT Secrets (Can use the random string generator, e.g. using openssl CLI)
  AUTH_ACCESS_TOKEN_JWT_SECRET=
  AUTH_REFRESH_TOKEN_JWT_SECRET=

  # Initial super admin user role account
  INITIAL_SUPER_ADMIN_EMAIL=
  INITIAL_SUPER_ADMIN_PASSWORD=

  # GCP integration
  GCP_PROJECT_ID=
  GCP_PRIVATE_KEY_ID=
  GCP_CLIENT_EMAIL=
  GCP_PRIVATE_KEY=

  # Google Cloud Storage Bucket
  GCS_BUCKET_NAME=

  # Front-end CORS setup
  LOCAL_FE_URL=
  BETA_FE_URL=
  ```

- Run the following commands:

  - Database migration

    ```bash
    # Using npx
    $ npx drizzle-kit migrate

    # Using pnpm
    $ pnpm drizzle-kit migrate
    ```

  - Initial data seeders

    ```bash
    # Using npx
    $ npm run seed

    # Using pnpm
    $ pnpm seed
    ```

  - Install dependencies

    ```bash
    # Using npx
    $ npm i

    # Using pnpm
    $ pnpm i
    ```

  - Run the project

    ```bash
    # Using npx
    $ npm run dev

    # Using pnpm
    $ pnpm dev
    ```
