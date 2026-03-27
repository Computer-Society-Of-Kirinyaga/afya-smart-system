import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class SmsService {
  constructor(private usersService: UsersService) {}

  async sendRiskAlert(userId: string, riskLevel: string, explanation: string) {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      return; //fix this to do the appropriate
    }
    if (!user.alert_preferences.sms_enabled) return;

    // Send to user

    // Send to doctor if enabled
    if (user.alert_preferences.alert_doctor && user.doctor_phone_number) {
      //send sms
    }
  }
}
