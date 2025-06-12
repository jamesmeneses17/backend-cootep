import { DataSource } from 'typeorm';
import { config } from 'dotenv';
const env = process.env.NODE_ENV || 'development';

config({
  path: `.env.${env}`,
});

// Archivo para generar migraciones
export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});
