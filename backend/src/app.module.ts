import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { HealthReadingsModule } from './health-readings/health-readings.module';
import { RiskAssessmentsModule } from './risk_assessments/risk_assessments.module';
import { DatabaseModule } from './config/database.module';

@Module({
  imports: [DatabaseModule, UsersModule, HealthReadingsModule, RiskAssessmentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
