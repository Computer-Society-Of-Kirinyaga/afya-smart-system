import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfigService } from './db.config';

@Module({
  imports: [
    ConfigModule, // Add this to provide ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Also add here if using useClass
      useClass: TypeOrmConfigService,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}