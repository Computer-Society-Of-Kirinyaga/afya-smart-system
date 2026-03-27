import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database.module';
import { UsersModule } from './users/users.module';
import { HealthReadingsModule } from './health-readings/health-readings.module';
import { StreamModule } from './stream/stream.module';
import { AuthModule } from './auth/auth.module';
import { AiModelModule } from './ai-model/ai-model.module';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env', 
    }),
    DatabaseModule,
    UsersModule,
    HealthReadingsModule,
    StreamModule,
    AuthModule
  , AiModelModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
