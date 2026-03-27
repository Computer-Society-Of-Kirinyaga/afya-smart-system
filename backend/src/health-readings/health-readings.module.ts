import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthReadingsService } from './health-readings.service';
import { HealthReadingsController } from './health-readings.controller';
import { HealthReading } from './entities/health-reading.entity';
import { UsersModule } from '../users/users.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HealthReading, User])],
  controllers: [HealthReadingsController],
  providers: [HealthReadingsService],
  exports: [HealthReadingsService],
})
export class HealthReadingsModule {}
