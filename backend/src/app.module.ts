import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';       
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { HealthReadingsModule } from './health-readings/health-readings.module';
import { RiskAssessmentsModule } from './risk_assessments/risk_assessments.module';
//import { SmsServiceModule } from './smsService/smsService.module'; 
import { CronsModule } from './crons/crons.module';      

@Module({
  imports: [
    ScheduleModule.forRoot(),   
    UsersModule,
    HealthReadingsModule,
    RiskAssessmentsModule,
    // SmsServiceModule,       
    CronsModule,                
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}