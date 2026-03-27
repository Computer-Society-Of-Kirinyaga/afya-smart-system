// sms.service.ts
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SMS_GATEWAY } from './sms.gateway';
import type { SmsGateway } from './sms.gateway';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor(
    private usersService: UsersService,
    @Inject(SMS_GATEWAY) private smsGateway: SmsGateway,
  ) {}

  /**
   * Send risk alert to user and optionally their doctor
   * @param userId - The user's UUID
   * @param alertLevel - The alert level (NORMAL, WARNING, CRITICAL)
   * @param disease - The detected disease/condition
   * @param recommendations - Array of recommendations from the AI
   * @returns Promise<boolean> - True if at least one SMS was sent successfully
   */
  async sendRiskAlert(
    userId: string,
    alertLevel: string,
    disease: string,
    recommendations: string[],
  ): Promise<boolean> {
    this.ensureNonEmpty(userId, 'userId');

    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException(
        `User not found for SMS alert. userId=${userId}`,
      );
    }

    // Check if user has SMS enabled
    if (!user.alert_preferences?.sms_enabled) {
      this.logger.debug(`SMS disabled for user ${userId}`);
      return false;
    }

    if (!user.phone_number) {
      throw new BadRequestException(
        `User has SMS enabled but no phone number on file. userId=${userId}`,
      );
    }

    // Build the alert message
    const alertMessage = this.buildAlertMessage(
      alertLevel,
      disease,
      recommendations,
    );

    const errors: string[] = [];
    let atLeastOneSent = false;

    // Send to user
    try {
      await this.sendOrThrow(user.phone_number, alertMessage);
      this.logger.log(`SMS sent to user ${user.phone_number}`);
      atLeastOneSent = true;
    } catch (error) {
      errors.push(`user:${this.getErrorMessage(error)}`);
      this.logger.error(
        `Failed to send SMS to user ${user.phone_number}:`,
        error,
      );
    }

    // Send to doctor if enabled and phone number exists
    if (user.alert_preferences?.alert_doctor) {
      if (!user.doctor_phone_number) {
        this.logger.warn(
          `Doctor alerts enabled but no doctor phone number for user ${userId}`,
        );
      } else {
        const doctorMessage = this.buildDoctorAlertMessage(
          user.name,
          user.phone_number,
          alertLevel,
          disease,
          recommendations,
        );
        try {
          await this.sendOrThrow(user.doctor_phone_number, doctorMessage);
          this.logger.log(`SMS sent to doctor ${user.doctor_phone_number}`);
          atLeastOneSent = true;
        } catch (error) {
          errors.push(`doctor:${this.getErrorMessage(error)}`);
          this.logger.error(
            `Failed to send SMS to doctor ${user.doctor_phone_number}:`,
            error,
          );
        }
      }
    }

    // Throw if both failed, but return true if at least one succeeded
    if (errors.length > 0 && !atLeastOneSent) {
      throw new ServiceUnavailableException(
        `SMS delivery failed for ${errors.length} recipient(s): ${errors.join(', ')}`,
      );
    }

    return atLeastOneSent;
  }

  /**
   * Build a formatted alert message for the user
   */
  private buildAlertMessage(
    alertLevel: string,
    disease: string,
    recommendations: string[],
  ): string {
    const levelText =
      alertLevel === 'CRITICAL'
        ? 'CRITICAL ALERT'
        : alertLevel === 'WARNING'
          ? 'WARNING'
          : 'HEALTH UPDATE';

    let message = `[${levelText}]`;

    if (disease && disease !== 'healthy') {
      message += `Potential risk: ${disease}. `;
    } else if (alertLevel === 'NORMAL') {
      message += `Your health metrics are within normal range. `;
    }

    // Add first recommendation (most important)
    if (recommendations && recommendations.length > 0) {
      message += `${recommendations[0]}`;
    }

    // Add URL for more details
    message += `\n\nView full report: ${process.env.APP_URL || 'http://localhost:3000'}/dashboard`;

    return message;
  }

  /**
   * Build a formatted alert message for the doctor
   */
  private buildDoctorAlertMessage(
    userName: string,
    userPhone: string,
    alertLevel: string,
    disease: string,
    recommendations: string[],
  ): string {
    const levelText =
      alertLevel === 'CRITICAL'
        ? 'CRITICAL'
        : alertLevel === 'WARNING'
          ? 'WARNING'
          : 'ROUTINE';

    let message = `[${levelText}] Patient: ${userName} (${userPhone})\n`;

    if (disease && disease !== 'healthy') {
      message += `Risk: ${disease}\n`;
    }

    if (recommendations && recommendations.length > 0) {
      message += `Recommendations:\n`;
      recommendations.slice(0, 3).forEach((rec, i) => {
        message += `${i + 1}. ${rec}\n`;
      });
    }

    message += `\nView full patient data: ${process.env.APP_URL || 'http://localhost:3000'}/dashboard?patient=${userPhone}`;

    return message;
  }

  /**
   * Send a direct SMS (utility method)
   */
  async sendDirect(to: string, message: string): Promise<boolean> {
    if (!to || !message) {
      throw new BadRequestException('Phone number and message are required');
    }

    try {
      await this.sendOrThrow(to, message);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send direct SMS to ${to}:`, error);
      return false;
    }
  }

  private async sendOrThrow(to: string, message: string): Promise<void> {
    try {
      await this.smsGateway.sendSms({ to, message });
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      this.logger.warn(`SMS send failed for ${to}: ${errorMessage}`);
      throw new ServiceUnavailableException(
        `Failed to send SMS to ${to}: ${errorMessage}`,
      );
    }
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return 'Unknown error';
  }

  private ensureNonEmpty(value: string, fieldName: string): void {
    if (!value || value.trim().length === 0) {
      throw new BadRequestException(`${fieldName} is required for SMS alerts.`);
    }
  }
}
