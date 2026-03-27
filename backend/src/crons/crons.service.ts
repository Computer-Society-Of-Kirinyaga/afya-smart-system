import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HealthReadingsService } from '../health-readings/health-readings.service';
import { RiskAssessmentsService } from '../risk_assessments/risk_assessments.service';
import { SmsService } from '../smsService/sms.service';

@Injectable()
export class CronsService {
  private readonly logger = new Logger(CronsService.name);

  constructor(
    private readonly healthReadingsService: HealthReadingsService,
    private readonly riskAssessmentsService: RiskAssessmentsService,
    private readonly smsService: SmsService,
  ) {}

 
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleHealthChecks() {
    this.logger.log('Starting 5-minute health check');

    try {
      

      const demoUser = {
  id: 'Jul3s',
  phone_number: '+254797163411',
};

const demoMetrics = {
  heart_rate: [80, 85, 90, 130],
  spo2: [98, 97, 95, 90],
};

const risk = this.getMockRisk(demoMetrics);

this.logger.log(`Demo user processed → ${risk.risk_level}`);

if (risk.risk_level !== 'healthy') {
  this.logger.log('SMS would be sent here (LLM + SMS not fully wired yet)');
}

      
      this.logger.log('5-minute health check completed (placeholder)');
    } catch (error) {
      this.logger.error('Error in 5-minute cron', error);
    }
  }

  
  @Cron(CronExpression.EVERY_HOUR)
  async handleHourlyTrends() {
    this.logger.log('Starting hourly trend analysis');

    try {
      // TODO: Add getAllUsers() to HealthReadingsService or inject UsersService
      this.logger.log('LLM and aggregation services not ready - hourly analysis pending integration');

      this.logger.log('Hourly trend analysis completed (placeholder)');
    } catch (error) {
      this.logger.error('Error in hourly cron', error);
    }
  }

  
  private getMockRisk(metrics: any) {
  const latestHeartRate = metrics.heart_rate?.slice(-1)[0] ?? 0;
  const latestSpo2 = metrics.spo2?.slice(-1)[0] ?? 0;

  if (latestHeartRate > 120 || latestSpo2 < 92) {
    return {
      risk_level: 'high',
      recommendation: 'Abnormal vitals detected. Please rest or seek medical attention.',
    };
  }

  return {
    risk_level: 'healthy',
    recommendation: 'Vitals are within normal range.',
  };
}
}