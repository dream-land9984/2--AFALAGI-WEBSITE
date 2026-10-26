import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Report, ReportStatus } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { QueryReportDto } from './dto/query-report.dto';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async create(dto: CreateReportDto, reporter?: User | null): Promise<Report> {
    const report = this.reportRepository.create({
      ...dto,
      reporter: reporter || null,
      status: dto.status || ReportStatus.MISSING,
      image: dto.image || null,
    });
    return this.reportRepository.save(report);
  }

  async findAll(query: QueryReportDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const qb: SelectQueryBuilder<Report> = this.reportRepository
      .createQueryBuilder('report')
      .leftJoinAndSelect('report.reporter', 'reporter')
      .orderBy('report.createdAt', 'DESC');

    if (query.search && query.search.trim() !== '') {
      const term = `%${query.search.trim().toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(report.name) LIKE :term OR LOWER(report.description) LIKE :term OR LOWER(report.location) LIKE :term)',
        { term },
      );
    }

    const region = query.region || query.location;
    if (region && region !== 'All Regions' && region.trim() !== '') {
      qb.andWhere('LOWER(report.location) = LOWER(:region)', { region: region.trim() });
    }

    if (query.status && query.status.trim() !== '') {
      qb.andWhere('report.status = :status', { status: query.status.toUpperCase() });
    }

    const [items, total] = await qb.skip(skip).take(limit).getManyAndCount();

    // Map to remove sensitive passwords from reporter if populated
    const sanitizedItems = items.map((item) => {
      if (item.reporter && item.reporter.password) {
        delete (item.reporter as any).password;
      }
      return item;
    });

    return {
      data: sanitizedItems,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Report> {
    const report = await this.reportRepository.findOne({
      where: { id },
      relations: ['reporter'],
    });

    if (!report) {
      throw new NotFoundException(`Missing person report #${id} was not found.`);
    }

    if (report.reporter && report.reporter.password) {
      delete (report.reporter as any).password;
    }

    return report;
  }

  async update(id: number, dto: UpdateReportDto, user?: User): Promise<Report> {
    const report = await this.findOne(id);

    // Permission check if user is not admin and not the reporter
    if (user && user.role !== UserRole.ADMIN) {
      if (report.reporter && report.reporter.id !== user.id) {
        throw new ForbiddenException('You do not have permission to edit this report.');
      }
    }

    Object.assign(report, dto);
    return this.reportRepository.save(report);
  }

  async remove(id: number, user?: User): Promise<{ message: string }> {
    const report = await this.findOne(id);

    if (user && user.role !== UserRole.ADMIN) {
      if (report.reporter && report.reporter.id !== user.id) {
        throw new ForbiddenException('You do not have permission to delete this report.');
      }
    }

    await this.reportRepository.remove(report);
    return { message: `Report #${id} successfully removed.` };
  }

  async getImpactStats() {
    const totalReports = await this.reportRepository.count();
    const searching = await this.reportRepository.count({
      where: { status: ReportStatus.MISSING },
    });
    const reunited = await this.reportRepository.count({
      where: { status: ReportStatus.REUNITED },
    });

    // Count distinct regions
    const distinctRegions = await this.reportRepository
      .createQueryBuilder('report')
      .select('COUNT(DISTINCT(report.location))', 'count')
      .getRawOne();

    const regionsCount = parseInt(distinctRegions?.count || '0', 10);

    const recentReports = await this.reportRepository.find({
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return {
      totalReports,
      searching,
      reunited,
      regions: regionsCount,
      recentReports,
    };
  }
}
