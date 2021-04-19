import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '40031412',
  database: 'taskmanagement',
  autoLoadEntities: true,
  synchronize: true,
};
