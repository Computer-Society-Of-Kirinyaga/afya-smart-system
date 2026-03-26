import { HealthReadingsService } from './health-readings.service';
import { CreateHealthReadingDto } from './dto/create-health-reading.dto';
import { UpdateHealthReadingDto } from './dto/update-health-reading.dto';
export declare class HealthReadingsController {
    private readonly healthReadingsService;
    constructor(healthReadingsService: HealthReadingsService);
    create(createHealthReadingDto: CreateHealthReadingDto): Promise<import("./entities/health-reading.entity").HealthReading>;
    findAll(): any;
    findOne(id: string): any;
    update(id: string, updateHealthReadingDto: UpdateHealthReadingDto): any;
    remove(id: string): any;
}
