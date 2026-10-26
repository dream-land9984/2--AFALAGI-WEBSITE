import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Report } from '../reports/entities/report.entity';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isProduction = configService.get<string>('NODE_ENV') === 'production';
  const sslEnabled =
    configService.get<string>('DB_SSL') === 'true' ||
    configService.get<string>('DB_SSL') === '1';

  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: parseInt(configService.get<string>('DB_PORT', '5432'), 10),
    username: configService.get<string>('DB_USERNAME', 'postgres'),
    password: configService.get<string>('DB_PASSWORD', 'postgres'),
    database: configService.get<string>('DB_DATABASE', 'afalagi_db'),
    entities: [User, Report],
    // In production, synchronize can be disabled if using migrations, or left enabled if desired
    synchronize: configService.get<string>('DB_SYNCHRONIZE', isProduction ? 'true' : 'true') === 'true',
    ssl: sslEnabled
      ? {
          rejectUnauthorized: false,
        }
      : false,
    logging: !isProduction,
  };
};
