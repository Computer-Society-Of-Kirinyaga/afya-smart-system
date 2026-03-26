import { Module } from '@nestjs/common';
import { CronsService } from './crons.service';
import { HealthReadingsModule } from '../health-readings/health-readings.module';
import { RiskAssessmentsModule } from '../risk_assessments/risk_assessments.module';
import { SmsService } from '../smsService/sms.service';

@Module({
  imports: [
    HealthReadingsModule,
    RiskAssessmentsModule,
  ],
  providers: [
    CronsService,
    SmsService,
  ],
})
export class CronsModule {}