import { CustomNamingStrategy } from '@app/common';
import { DataSource } from 'typeorm';

const OrmDataSource = new DataSource({
  type: process.env.DATABASE_TYPE as any,
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  logging: 'all',
  entities: [`${__dirname}/../src/entity/**/*.entity{.ts,.js}`],
  dropSchema: false,
  synchronize: false,
  namingStrategy: new CustomNamingStrategy(),
});

// eslint-disable-next-line @typescript-eslint/ban-types
export const runOrm = (callback: Function) =>
  OrmDataSource.initialize()
    .then(async (dataSource) => {
      console.log('Data Source has been initialized!');
      await callback(dataSource);
    })
    .catch((err) => {
      console.error('Error during Data Source initialization', err);
    })
    .finally(async () => {
      console.log('Data Source has been Destroy!');
      await OrmDataSource.destroy();
    });
