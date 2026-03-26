import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { HealthReadingsModule } from './health-readings/health-readings.module';
import { StreamModule } from './stream/stream.module';

@Module({
  imports: [UsersModule, HealthReadingsModule, RiskAssessmentsModule, StreamModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
