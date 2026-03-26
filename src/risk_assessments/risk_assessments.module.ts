import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { HealthReading } from 'src/health-readings/entities/health-reading.entity';
import { HealthReadingsController } from 'src/health-readings/health-readings.controller';
import { HealthReadingsService } from 'src/health-readings/health-readings.service';
import { SmsService } from 'src/smsService/sms.service';

@Module({
  imports: [TypeOrmModule.forFeature([HealthReading]), UsersModule],
  controllers: [HealthReadingsController],
  providers: [HealthReadingsService, SmsService],
  exports: [HealthReadingsService],
})
export class HealthReadingsModule {}