import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthReadingsModule } from '../health-readings/health-readings.module';
import { UsersModule } from '../users/users.module';
import { RiskAssessment } from './entities/risk_assessment.entity';
import { RiskAssessmentsController } from './risk_assessments.controller';
import { RiskAssessmentsService } from './risk_assessments.service';
import { SmsModule } from 'src/sms/sms.module';
import { AiModelModule } from 'src/ai-model/ai-model.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([RiskAssessment]),
    HealthReadingsModule,
    UsersModule,
    SmsModule,
    AiModelModule,
  ],
  controllers: [RiskAssessmentsController],
  providers: [RiskAssessmentsService],
  exports: [RiskAssessmentsService],
})
export class RiskAssessmentsModule {}
