import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDatabaseConfig } from './config/database.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ReportsModule } from './reports/reports.module';
import { UploadsModule } from './uploads/uploads.module';
import { DatabaseModule } from './database/database.module';

const uploadsPath = join(process.cwd(), 'uploads');
if (!existsSync(uploadsPath)) {
  mkdirSync(uploadsPath, { recursive: true });
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    ServeStaticModule.forRoot({
      rootPath: uploadsPath,
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false,
      },
    }),
    UsersModule,
    AuthModule,
    ReportsModule,
    UploadsModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
