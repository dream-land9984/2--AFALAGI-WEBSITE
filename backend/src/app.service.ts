import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAppInfo() {
    return {
      name: 'Afalagi API',
      version: '1.0.0',
      description: 'Humanitarian Missing Persons & Family Reunification Backend API',
      status: 'active',
      supportedDatabases: ['mysql', 'mariadb', 'postgresql'],
      endpoints: {
        health: '/api/health',
        auth: {
          register: 'POST /api/auth/register',
          login: 'POST /api/auth/login',
          profile: 'GET /api/auth/profile',
        },
        reports: {
          list: 'GET /api/reports',
          stats: 'GET /api/reports/stats/impact',
          detail: 'GET /api/reports/:id',
          create: 'POST /api/reports',
          update: 'PATCH /api/reports/:id',
          delete: 'DELETE /api/reports/:id',
        },
        uploads: {
          uploadImage: 'POST /api/uploads',
          viewImage: 'GET /uploads/:filename',
        },
      },
    };
  }
}
