import { CustomNamingStrategy } from '@app/common';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  namingStrategy: new CustomNamingStrategy(),
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  logging: process.env.DATABASE_LOG as any,
  entities: [`${__dirname}/../src/entity/**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/**/local/*{.ts,.js}`],
  migrationsTableName: 'migrations',
  extra: {
    timezone: 'Asia/Seoul',
  },
});
