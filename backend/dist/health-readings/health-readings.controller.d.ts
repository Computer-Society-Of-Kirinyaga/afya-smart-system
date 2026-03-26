import { HealthReadingsService } from './health-readings.service';
import { CreateHealthReadingDto } from './dto/create-health-reading.dto';
export declare class HealthReadingsController {
    private readonly healthReadingsService;
    constructor(healthReadingsService: HealthReadingsService);
    create(createHealthReadingDto: CreateHealthReadingDto): Promise<import("./entities/health-reading.entity").HealthReading>;
    findLatestReading(id: string): Promise<import("./entities/health-reading.entity").HealthReading | null>;
    findAggregateReading(id: string): Promise<{
        readings: import("./entities/health-reading.entity").HealthReading[];
        averages: {
            avg_heart_rate: number;
            avg_spo2: number;
            avg_temperature: number;
            avg_systolic_bp: number;
            avg_diastolic_bp: number;
        };
        trends: {
            heart_rate_trend: "increasing" | "decreasing" | "stable";
            spo2_trend: "increasing" | "decreasing" | "stable";
            temperature_trend: "increasing" | "decreasing" | "stable";
        };
    }>;
    findOne(id: string): Promise<import("./entities/health-reading.entity").HealthReading[]>;
}
