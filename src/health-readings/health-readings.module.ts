import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthReadingsService } from './health-readings.service';
import { HealthReadingsController } from './health-readings.controller';
import { HealthReading } from './entities/health-reading.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([HealthReading]), UsersModule],
  controllers: [HealthReadingsController],
  providers: [HealthReadingsService],
  exports: [HealthReadingsService],
})
export class HealthReadingsModule {}