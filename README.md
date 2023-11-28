# Boombim Back-End Repository
Project Boombim REST API Repository

## Execution Environment
- run time: `node v18.14.2`
- package manager: `npm v9.3.1`
- database: `postgres v14`
- upload server: AWS S3
- deploy: Github Action & Github self-hosted Runner 
- Error Monitoring: Sentry
- Error Report: Slack Web Hook

## Main Stack
- framework: `nestjs v10` & `exporess`
- orm: `typeorm v0.3.x`
- aws sdk: `@aws-sdk/client-s3 v3.x`
- docs: `@nestjs/swagger v7.x.x`

## Useage
1. Install Dependencies
  - `$ npm ci` 
2. make env dir
  - `$ mkdir env`
3. setting env/local.env
  - `$ cp env-sample env/local.env`
  - update `env/local.env`
4. Create Database Table
  - `$ db:migrate:up` 
5. Run pre start
  - `$ npm run pre-start`

## API
- API URL: http://localhost:3000/api
- API Docs: http://localhost:3000/docs
