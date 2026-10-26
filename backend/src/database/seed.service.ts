import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/entities/user.entity';
import { Report, ReportStatus } from '../reports/entities/report.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async onApplicationBootstrap() {
    try {
      await this.seedUsers();
      await this.seedReports();
    } catch (err) {
      this.logger.warn(`Database seeding skipped or encountered an issue: ${err.message}`);
    }
  }

  private async seedUsers() {
    const userCount = await this.userRepository.count();
    if (userCount === 0) {
      this.logger.log('Seeding initial admin and demo user...');
      const adminPassword = await bcrypt.hash('Admin@123456', 10);
      const demoPassword = await bcrypt.hash('User@123456', 10);

      const admin = this.userRepository.create({
        name: 'Afalagi Administrator',
        email: 'admin@afalagi.et',
        phone: '+251911000000',
        password: adminPassword,
        role: UserRole.ADMIN,
      });

      const demoUser = this.userRepository.create({
        name: 'Tesfaye Worke',
        email: 'demo@afalagi.et',
        phone: '+251912345678',
        password: demoPassword,
        role: UserRole.USER,
      });

      await this.userRepository.save([admin, demoUser]);
      this.logger.log('Initial users created (admin@afalagi.et / Admin@123456).');
    }
  }

  private async seedReports() {
    const reportCount = await this.reportRepository.count();
    if (reportCount === 0) {
      this.logger.log('Seeding initial missing person reports...');
      const admin = await this.userRepository.findOne({ where: { email: 'admin@afalagi.et' } });

      const initialReports = [
        {
          name: 'Abebe Bekele',
          age: 43,
          gender: 'Male',
          location: 'Tigray Region',
          dateLost: '2023-11-12',
          description: 'Tall, wearing a blue jacket, speaks Amharic and Tigrinya.',
          contact: '+251911234567',
          image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80',
          status: ReportStatus.MISSING,
          reporter: admin || undefined,
        },
        {
          name: 'Fatima Ali',
          age: 12,
          gender: 'Female',
          location: 'Afar Region',
          dateLost: '2024-01-05',
          description: 'Small scar on left cheek. Wearing a red traditional dress.',
          contact: '+251922345678',
          image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&q=80',
          status: ReportStatus.MISSING,
          reporter: admin || undefined,
        },
        {
          name: 'Yosef Tadesse',
          age: 28,
          gender: 'Male',
          location: 'Amhara Region',
          dateLost: '2024-02-14',
          description: 'Last seen at bus station carrying a black backpack.',
          contact: '+251933456789',
          image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80',
          status: ReportStatus.MISSING,
          reporter: admin || undefined,
        },
      ];

      for (const item of initialReports) {
        const report = this.reportRepository.create(item);
        await this.reportRepository.save(report);
      }

      this.logger.log('Initial missing person reports seeded successfully.');
    }
  }
}
