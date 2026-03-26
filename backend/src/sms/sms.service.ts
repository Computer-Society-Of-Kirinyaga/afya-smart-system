import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SMS_GATEWAY, type SmsGateway } from './sms.gateway';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor(
    private usersService: UsersService,
    @Inject(SMS_GATEWAY) private smsGateway: SmsGateway,
  ) {}

  async sendRiskAlert(userId: string, msg: string) {
    this.ensureNonEmpty(userId, 'userId');

    const user = await this.usersService.findOne(userId);
    
    if (!user) {
      throw new NotFoundException(`User not found for SMS alert. userId=${userId}`);
    }
    if (!user.alert_preferences?.sms_enabled) return;

    if (!user.phone_number) {
      throw new BadRequestException(
        `User has SMS enabled but no phone number on file. userId=${userId}`,
      );
    }
    
    const errors: string[] = [];
    const userMessage = this.buildUserAlertMessage(user.name, msg);
    try {
      await this.sendOrThrow(user.phone_number, userMessage);
    } catch (error) {
      errors.push(`user:${this.getErrorMessage(error)}`);
    }
    
    // Send to doctor if enabled
    if (user.alert_preferences.alert_doctor) {
      if (!user.doctor_phone_number) {
        throw new BadRequestException(
          `Doctor alerts enabled but no doctor phone number on file. userId=${userId}`,
        );
      }

      const doctorMessage = this.buildDoctorAlertMessage(
        user.name,
        user.phone_number,
        msg
      );
      try {
        await this.sendOrThrow(user.doctor_phone_number, doctorMessage);
      } catch (error) {
        errors.push(`doctor:${this.getErrorMessage(error)}`);
      }
    }

    if (errors.length > 0) {
      throw new ServiceUnavailableException(
        `SMS delivery failed for ${errors.length} recipient(s): ${errors.join(', ')}`,
      );
    }
  }

  private buildUserAlertMessage(userName: string, msg: string) {
    return `Hello ${userName}, ${msg}`;
  }

  private buildDoctorAlertMessage(
    userName: string,
    userPhone: string,
    msg: string,
  ) {
    return `Patient ${userName} (${userPhone}) ${msg}`;
  }

  private async sendOrThrow(to: string, message: string) {
    try {
      await this.smsGateway.sendSms({ to, message });
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      this.logger.warn(`SMS send failed for ${to}: ${errorMessage}`);
      throw new ServiceUnavailableException(`Failed to send SMS to ${to}: ${errorMessage}`);
    }
  }

  private getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message;
    return 'Unknown error';
  }

  private ensureNonEmpty(value: string, fieldName: string) {
    if (!value || value.trim().length === 0) {
      throw new BadRequestException(`${fieldName} is required for SMS alerts.`);
    }
  }
}
