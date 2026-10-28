import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Report } from '../reports/entities/report.entity';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isProduction = configService.get<string>('NODE_ENV') === 'production';
  const rawDbType = configService.get<string>('DB_TYPE', 'mysql').toLowerCase().trim();
  const dbType = rawDbType === 'postgres' || rawDbType === 'postgresql' ? 'postgres' : 'mysql';

  const sslEnabled =
    configService.get<string>('DB_SSL') === 'true' ||
    configService.get<string>('DB_SSL') === '1';

  const defaultPort = dbType === 'postgres' ? 5432 : 3306;
  const port = parseInt(configService.get<string>('DB_PORT', String(defaultPort)), 10);

  if (dbType === 'postgres') {
    return {
      type: 'postgres',
      host: configService.get<string>('DB_HOST', 'localhost'),
      port,
      username: configService.get<string>('DB_USERNAME', 'postgres'),
      password: configService.get<string>('DB_PASSWORD', 'postgres'),
      database: configService.get<string>('DB_DATABASE', 'afalagi_db'),
      entities: [User, Report],
      synchronize: configService.get<string>('DB_SYNCHRONIZE', 'true') === 'true',
      ssl: sslEnabled
        ? {
            rejectUnauthorized: false,
          }
        : false,
      logging: !isProduction,
    };
  }

  // MySQL / MariaDB (Standard for cPanel Database Wizard)
  return {
    type: 'mysql',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port,
    username: configService.get<string>('DB_USERNAME', 'root'),
    password: configService.get<string>('DB_PASSWORD', ''),
    database: configService.get<string>('DB_DATABASE', 'afalagi_db'),
    entities: [User, Report],
    synchronize: configService.get<string>('DB_SYNCHRONIZE', 'true') === 'true',
    ssl: sslEnabled
      ? {
          rejectUnauthorized: false,
        }
      : false,
    logging: !isProduction,
  };
};
