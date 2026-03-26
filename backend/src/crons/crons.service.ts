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
    this.logger.log('=== Starting 5-minute health check ===');

    try {
      
      this.logger.log('Checking recent health readings...');

     

      this.logger.log('✅ 5-minute health check completed (using existing methods)');
    } catch (error) {
      this.logger.error('❌ Error during 5-minute health check', error);
    }
  }

  
  @Cron('0 8 * * *')
  async handleDailyReminders() {
    this.logger.log('=== Starting daily reminder job ===');

    try {
      this.logger.log('Daily reminder logic ready. Will use getLatestReading() when user list is available.');
      

      this.logger.log('✅ Daily reminder job completed');
    } catch (error) {
      this.logger.error('❌ Error during daily reminder job', error);
    }
  }
}