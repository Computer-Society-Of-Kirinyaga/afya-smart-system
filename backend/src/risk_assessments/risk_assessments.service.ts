import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, FindOptionsWhere } from 'typeorm';
import { HealthReadingsService } from '../health-readings/health-readings.service';
import { UsersService } from '../users/users.service';
import { RiskAssessment, RiskLevel } from './entities/risk_assessment.entity';
import { CreateRiskAssessmentDto } from './dto/create-risk_assessment.dto';
import { SmsService } from 'src/sms/sms.service';
import { AiModelService } from 'src/ai-model/ai-model.service';

@Injectable()
export class RiskAssessmentsService {
  constructor(
    @InjectRepository(RiskAssessment)
    private riskRepository: Repository<RiskAssessment>,
    private healthReadingsService: HealthReadingsService,
    private usersService: UsersService,
    private smsService: SmsService,
    private aiModelService: AiModelService,
  ) { }

  async create(createDto: CreateRiskAssessmentDto) {
    const assessment = this.riskRepository.create(createDto);
    return this.riskRepository.save(assessment);
  }

  // In your risk-assessments.service.ts

  async assessUserRisk(userId: string) {
    // Get last 5 readings with user relation loaded
    const readings = await this.healthReadingsService.getReadingsLastHours(userId, 1, {
      relations: ['user'] // Make sure to load the user relation
    });

    if (readings.length === 0) {
      return null;
    }

    // Get user from the first reading
    const user = readings[0].user;

    // Prepare LLM input with correct data extraction
    const llmInput = {
      readings: readings.map(r => ({
        timestamp: r.timestamp,
        heart_rate: r.heart_rate,
        systolic_bp: r.systolic_bp,
        diastolic_bp: r.diastolic_bp,
        spo2: r.spo2,
        temperature: r.temperature,
      })),
      averages: {
        heart_rate: readings.reduce((sum, r) => sum + (r.heart_rate || 0), 0) / readings.length,
        spo2: readings.reduce((sum, r) => sum + (r.spo2 || 0), 0) / readings.length,
        temperature: readings.reduce((sum, r) => sum + (r.temperature || 0), 0) / readings.length,
      },
      medications: user?.medications || [],
      chronicConditions: user?.chronicConditions || [],
      age: user?.age,
      gender: user?.gender,
    };

    // Call LLM service
    const llmResponse = await this.aiModelService.analyzeHealthData(llmInput);

    // Create assessment record
    const assessment = await this.create({
      user_id: userId,
      llm_input: JSON.stringify(llmInput),
      llm_response: llmResponse,
      risk_level: this.mapAlertLevelToRiskLevel(llmResponse.alertLevel),
      alert_sent: false,
    });

    // Send SMS if risk detected
    if (llmResponse.alertLevel !== 'NORMAL') {
      const userDetails = await this.usersService.findOne(userId);
      const alertSent = await this.smsService.sendRiskAlert(
        userId,
        llmResponse.alertLevel,
        llmResponse.disease,
        llmResponse.recommendations
      );

      if (alertSent) {
        await this.updateAlertStatus(assessment.id, true);
      }
    }

    return assessment;
  }

  private mapAlertLevelToRiskLevel(alertLevel: string): RiskLevel {
    const mapping = {
      'NORMAL': 'healthy',
      'WARNING': 'moderate',
      'CRITICAL': 'high'
    };
    return mapping[alertLevel] as RiskLevel || 'healthy';
  }
  async updateAlertStatus(
    assessmentId: string,
    alertSent: boolean,
  ): Promise<void> {
    if (alertSent) {
      await this.riskRepository.update(assessmentId, {
        alert_sent: alertSent,
        alert_sent_at: new Date(),
      });
    }

    await this.riskRepository.update(assessmentId, {
      alert_sent: alertSent,
    });
  }

  async getLatestAssessment(userId: string): Promise<RiskAssessment | null> {
    return this.riskRepository.findOne({
      where: { user_id: userId },
      order: { assessment_time: 'DESC' },
    });
  }

  async getAssessmentsForUser(
    userId: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    },
  ): Promise<RiskAssessment[]> {
    const where: FindOptionsWhere<RiskAssessment> = { user_id: userId };

    if (options?.startDate && options?.endDate) {
      where.assessment_time = MoreThan(options.startDate);
    }

    const query = this.riskRepository.find({
      where,
      order: { assessment_time: 'DESC' },
    });

    if (options?.limit) {
      (await query).slice(0, options.limit);
    }

    return query;
  }

  async getRiskHistory(userId: string): Promise<{
    assessments: RiskAssessment[];
    riskTrend: 'improving' | 'worsening' | 'stable';
    lastHealthyDays: number;
  }> {
    const assessments = await this.getAssessmentsForUser(userId, { limit: 10 });

    if (assessments.length === 0) {
      return {
        assessments: [],
        riskTrend: 'stable',
        lastHealthyDays: 0,
      };
    }

    // Calculate risk trend
    const riskScores = { healthy: 0, low: 1, moderate: 2, high: 3 };
    const recent = assessments.slice(0, 5);
    const older = assessments.slice(5);

    const recentAvg =
      recent.reduce((sum, a) => sum + riskScores[a.risk_level], 0) /
      recent.length;
    const olderAvg =
      older.length > 0
        ? older.reduce((sum, a) => sum + riskScores[a.risk_level], 0) /
        older.length
        : recentAvg;

    let riskTrend: 'improving' | 'worsening' | 'stable' = 'stable';
    if (recentAvg < olderAvg - 0.5) riskTrend = 'improving';
    if (recentAvg > olderAvg + 0.5) riskTrend = 'worsening';

    // Calculate days since last healthy assessment
    let lastHealthyDays = 0;
    const lastHealthy = assessments.find((a) => a.risk_level === 'healthy');
    if (lastHealthy) {
      lastHealthyDays = Math.floor(
        (new Date().getTime() - lastHealthy.assessment_time.getTime()) /
        (1000 * 3600 * 24),
      );
    }

    return {
      assessments,
      riskTrend,
      lastHealthyDays,
    };
  }
}
