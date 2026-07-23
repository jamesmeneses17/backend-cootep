import { DataSource } from 'typeorm';
import 'dotenv/config';
// importa todas tus entidades reales aquí

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity.ts'],
  migrations: ['src/migrations/*.{ts,js}'],
});
