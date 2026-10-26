import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { QueryReportDto } from './dto/query-report.dto';
import { JwtAuthGuard, OptionalJwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  create(
    @Body() createReportDto: CreateReportDto,
    @CurrentUser() user: User | null,
  ) {
    return this.reportsService.create(createReportDto, user);
  }

  @Get()
  findAll(@Query() query: QueryReportDto) {
    return this.reportsService.findAll(query);
  }

  @Get('stats/impact')
  getImpactStats() {
    return this.reportsService.getImpactStats();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reportsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReportDto: UpdateReportDto,
    @CurrentUser() user: User,
  ) {
    return this.reportsService.update(id, updateReportDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.reportsService.remove(id, user);
  }
}
