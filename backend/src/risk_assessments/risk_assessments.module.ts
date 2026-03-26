import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthReadingsModule } from '../health-readings/health-readings.module';
import { UsersModule } from '../users/users.module';
import { SmsModule } from '../smsService/sms.module';
import { RiskAssessment } from './entities/risk_assessment.entity';
import { RiskAssessmentsController } from './risk_assessments.controller';
import { RiskAssessmentsService } from './risk_assessments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RiskAssessment]),
    HealthReadingsModule,
    UsersModule,
    SmsModule,
  ],
  controllers: [RiskAssessmentsController],
  providers: [RiskAssessmentsService],
  exports: [RiskAssessmentsService],
})
export class RiskAssessmentsModule {}
