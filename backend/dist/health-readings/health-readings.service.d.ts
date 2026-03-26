import { Repository } from 'typeorm';
import { HealthReading } from './entities/health-reading.entity';
import { CreateHealthReadingDto, BulkCreateHealthReadingDto } from './dto/create-health-reading.dto';
import { User } from '../users/entities/user.entity';
export declare class HealthReadingsService {
    private readingsRepository;
    private usersRepository;
    constructor(readingsRepository: Repository<HealthReading>, usersRepository: Repository<User>);
    create(createDto: CreateHealthReadingDto): Promise<HealthReading>;
    bulkCreate(bulkDto: BulkCreateHealthReadingDto): Promise<HealthReading[]>;
    findAllForUser(userId: string, options?: {
        startDate?: Date;
        endDate?: Date;
        limit?: number;
    }): Promise<HealthReading[]>;
    getLatestReading(userId: string): Promise<HealthReading | null>;
    getReadingsLastHours(userId: string, hours: number): Promise<HealthReading[]>;
    getAggregatedReadings(userId: string, hours?: number): Promise<{
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
    }>;
}
