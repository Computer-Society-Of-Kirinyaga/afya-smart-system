import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Between,
  MoreThan,
  LessThan,
  FindOptionsWhere,
} from 'typeorm';
import { HealthReading } from './entities/health-reading.entity';
import {
  CreateHealthReadingDto,
  BulkCreateHealthReadingDto,
} from './dto/create-health-reading.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class HealthReadingsService {
  constructor(
    @InjectRepository(HealthReading)
    private readingsRepository: Repository<HealthReading>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createDto: CreateHealthReadingDto): Promise<HealthReading> {
    // Verify user exists
    const user = await this.usersRepository.findOne({
      where: { id: createDto.user_id },
    });
    if (!user) {
      throw new NotFoundException(
        `User with ID ${createDto.user_id} not found`,
      );
    }

    const reading = this.readingsRepository.create({
      ...createDto,
      timestamp: createDto.timestamp
        ? new Date(createDto.timestamp)
        : new Date(),
    });
    return this.readingsRepository.save(reading);
  }

  //Could come in handy
  async bulkCreate(
    bulkDto: BulkCreateHealthReadingDto,
  ): Promise<HealthReading[]> {
    const readings = await Promise.all(
      bulkDto.readings.map(async (dto) => {
        const user = await this.usersRepository.findOne({
          where: { id: dto.user_id },
        });
        if (!user) {
          throw new NotFoundException(`User with ID ${dto.user_id} not found`);
        }
        return this.readingsRepository.create({
          ...dto,
          timestamp: dto.timestamp ? new Date(dto.timestamp) : new Date(),
        });
      }),
    );
    return this.readingsRepository.save(readings);
  }

  async findAllForUser(
    userId: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    },
  ): Promise<HealthReading[]> {
    const where: FindOptionsWhere<HealthReading> = { user_id: userId };

    if (options?.startDate && options?.endDate) {
      where.timestamp = Between(options.startDate, options.endDate);
    } else if (options?.startDate) {
      where.timestamp = MoreThan(options.startDate);
    } else if (options?.endDate) {
      where.timestamp = LessThan(options.endDate);
    }

    const query = this.readingsRepository.find({
      where,
      order: { timestamp: 'DESC' },
      select: {
        user: {
          medications: true,
          chronicConditions: true,
        },
      },
    });

    if (options?.limit) {
      (await query).slice(0, options.limit);
    }

    return query;
  }

  async getLatestReading(userId: string): Promise<HealthReading | null> {
    return this.readingsRepository.findOne({
      where: { user_id: userId },
      order: { timestamp: 'DESC' },
    });
  }

  async getReadingsLastMins(
    userId: string,
    mins: number,
    options?: { relations?: string[] },
  ): Promise<HealthReading[]> {
    const cutoffTime = new Date();
    cutoffTime.setMinutes(cutoffTime.getMinutes() - mins);

    return this.readingsRepository.find({
      where: {
        user_id: userId,
        timestamp: MoreThan(cutoffTime),
      },
      relations: options?.relations || [], // Allow loading relations
      order: { timestamp: 'ASC' },
    });
  }

  async getAggregatedReadings(
    userId: string,
    hours: number = 1,
  ): Promise<{
    readings: HealthReading[];
    averages: {
      avg_heart_rate: number;
      avg_spo2: number;
      avg_temperature: number;
      avg_systolic_bp: number;
      avg_diastolic_bp: number;
    };
    trends: {
      heart_rate_trend: 'increasing' | 'decreasing' | 'stable';
      spo2_trend: 'increasing' | 'decreasing' | 'stable';
      temperature_trend: 'increasing' | 'decreasing' | 'stable';
    };
  }> {
    const readings = await this.getReadingsLastMins(userId, hours);

    if (readings.length === 0) {
      return {
        readings: [],
        averages: {
          avg_heart_rate: 0,
          avg_spo2: 0,
          avg_temperature: 0,
          avg_systolic_bp: 0,
          avg_diastolic_bp: 0,
        },
        trends: {
          heart_rate_trend: 'stable',
          spo2_trend: 'stable',
          temperature_trend: 'stable',
        },
      };
    }

    // Calculate averages
    const avg_heart_rate =
      readings.reduce((sum, r) => sum + (r.heart_rate || 0), 0) /
      readings.length;
    const avg_spo2 =
      readings.reduce((sum, r) => sum + (r.spo2 || 0), 0) / readings.length;
    const avg_temperature =
      readings.reduce((sum, r) => sum + (r.temperature || 0), 0) /
      readings.length;
    const avg_systolic_bp =
      readings.reduce((sum, r) => sum + (r.systolic_bp || 0), 0) /
      readings.length;
    const avg_diastolic_bp =
      readings.reduce((sum, r) => sum + (r.diastolic_bp || 0), 0) /
      readings.length;

    // Calculate trends (compare first half vs second half)
    const midPoint = Math.floor(readings.length / 2);
    const firstHalf = readings.slice(0, midPoint);
    const secondHalf = readings.slice(midPoint);

    const getTrend = (
      values: number[],
    ): 'increasing' | 'decreasing' | 'stable' => {
      if (values.length < 2) return 'stable';
      const firstAvg =
        values
          .slice(0, Math.floor(values.length / 2))
          .reduce((a, b) => a + b, 0) / Math.floor(values.length / 2);
      const secondAvg =
        values.slice(Math.floor(values.length / 2)).reduce((a, b) => a + b, 0) /
        (values.length - Math.floor(values.length / 2));
      const diffPercent = ((secondAvg - firstAvg) / firstAvg) * 100;
      if (diffPercent > 5) return 'increasing';
      if (diffPercent < -5) return 'decreasing';
      return 'stable';
    };

    return {
      readings,
      averages: {
        avg_heart_rate: parseFloat(avg_heart_rate.toFixed(1)),
        avg_spo2: parseFloat(avg_spo2.toFixed(1)),
        avg_temperature: parseFloat(avg_temperature.toFixed(1)),
        avg_systolic_bp: parseFloat(avg_systolic_bp.toFixed(0)),
        avg_diastolic_bp: parseFloat(avg_diastolic_bp.toFixed(0)),
      },
      trends: {
        heart_rate_trend: getTrend(
          readings.map((r) => r.heart_rate).filter(Boolean),
        ),
        spo2_trend: getTrend(readings.map((r) => r.spo2).filter(Boolean)),
        temperature_trend: getTrend(
          readings.map((r) => r.temperature).filter(Boolean),
        ),
      },
    };
  }
}
