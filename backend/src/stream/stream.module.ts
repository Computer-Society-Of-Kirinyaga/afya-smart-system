import { Module } from '@nestjs/common';
import { StreamService } from './stream.service';
import { StreamController } from './stream.controller';
import { HealthReadingsModule } from 'src/health-readings/health-readings.module';

@Module({
  imports: [HealthReadingsModule],
  controllers: [StreamController],
  providers: [StreamService],
})
export class StreamModule {}
