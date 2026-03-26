import { Module } from '@nestjs/common';
import { StreamService } from './stream.service';
import { StreamController } from './stream.controller';
import { HealthReadingsService } from 'src/health-readings/health-readings.service';

@Module({
  controllers: [StreamController],
  providers: [HealthReadingsService],
})
export class StreamModule {}
