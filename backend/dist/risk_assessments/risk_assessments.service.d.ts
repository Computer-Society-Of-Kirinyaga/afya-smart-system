import { Repository } from 'typeorm';
import { HealthReadingsService } from '../health-readings/health-readings.service';
import { UsersService } from '../users/users.service';
import { RiskAssessment } from './entities/risk_assessment.entity';
import { CreateRiskAssessmentDto } from './dto/create-risk_assessment.dto';
import { SmsService } from 'src/sms/sms.service';
export declare class RiskAssessmentsService {
    private riskRepository;
    private healthReadingsService;
    private usersService;
    private smsService;
    constructor(riskRepository: Repository<RiskAssessment>, healthReadingsService: HealthReadingsService, usersService: UsersService, smsService: SmsService);
    create(createDto: CreateRiskAssessmentDto): Promise<RiskAssessment>;
    assessUserRisk(userId: string): Promise<RiskAssessment | null>;
    updateAlertStatus(assessmentId: string, alertSent: boolean): Promise<void>;
    getLatestAssessment(userId: string): Promise<RiskAssessment | null>;
    getAssessmentsForUser(userId: string, options?: {
        startDate?: Date;
        endDate?: Date;
        limit?: number;
    }): Promise<RiskAssessment[]>;
    getRiskHistory(userId: string): Promise<{
        assessments: RiskAssessment[];
        riskTrend: 'improving' | 'worsening' | 'stable';
        lastHealthyDays: number;
    }>;
}
