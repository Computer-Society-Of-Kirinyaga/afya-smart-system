import { HttpStatus } from '@nestjs/common';
import { CreateRiskAssessmentDto } from './dto/create-risk_assessment.dto';
import { RiskAssessmentsService } from './risk_assessments.service';
import { RiskAssessment } from './entities/risk_assessment.entity';
export declare class RiskAssessmentsController {
    private readonly riskAssessmentsService;
    constructor(riskAssessmentsService: RiskAssessmentsService);
    create(createDto: CreateRiskAssessmentDto): Promise<RiskAssessment>;
    getLatestAssessment(userId: string): Promise<RiskAssessment | {
        statusCode: HttpStatus;
        message: string;
        assessment: null;
    }>;
    getAssessmentsForUser(userId: string, startDate?: string, endDate?: string, limit?: string): Promise<{
        userId: string;
        count: number;
        assessments: RiskAssessment[];
    }>;
    getRiskHistory(userId: string): Promise<{
        assessments: RiskAssessment[];
        riskTrend: "improving" | "worsening" | "stable";
        lastHealthyDays: number;
        userId: string;
    }>;
    updateAlertStatus(assessmentId: string, alertSent: boolean): Promise<{
        message: string;
        assessmentId: string;
        alertSent: boolean;
    }>;
    getDashboardStats(userId: string): Promise<RiskAssessment[]>;
}
