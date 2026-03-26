export const SMS_GATEWAY = 'SMS_GATEWAY';

export type SmsMessage = {
  to: string;
  message: string;
  senderId?: string;
  scheduleTime?: string;
};

export interface SmsGateway {
  sendSms(message: SmsMessage): Promise<unknown>;
}
