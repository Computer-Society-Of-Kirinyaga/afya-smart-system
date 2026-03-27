import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { OpenSmsGateway } from './opensms.gateway';
import { SMS_GATEWAY } from './sms.gateway';
import { SmsService } from './sms.service';

@Module({
  imports: [ConfigModule, UsersModule],
  providers: [
    SmsService,
    {
      provide: SMS_GATEWAY,
      useClass: OpenSmsGateway,
    },
  ],
  exports: [SmsService],
})
export class SmsModule {}
