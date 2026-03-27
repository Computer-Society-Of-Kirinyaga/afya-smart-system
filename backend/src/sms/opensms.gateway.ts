import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SmsGateway, SmsMessage } from './sms.gateway';

@Injectable()
export class OpenSmsGateway implements SmsGateway {
  private readonly apiUrl: string;
  private readonly apiToken: string;
  private readonly senderId: string;

  constructor(private configService: ConfigService) {
    this.apiUrl =
      this.configService.get<string>('OPENSMS_API_URL') ??
      'https://opensms.co.ke/api/http/sms/send';
    this.apiToken = this.configService
      .getOrThrow<string>('OPENSMS_API_TOKEN')
      .trim();
    this.senderId =
      this.configService.get<string>('OPENSMS_SENDER_ID') ?? 'OPENSMS';
  }

  async sendSms(message: SmsMessage): Promise<unknown> {
    const payload = {
      api_token: this.apiToken,
      recipient: message.to,
      sender_id: message.senderId ?? this.senderId,
      type: 'plain',
      message: message.message,
      ...(message.scheduleTime ? { schedule_time: message.scheduleTime } : {}),
    };

    const response = await axios.post(this.apiUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 15000,
    });

    return response.data;
  }
}
