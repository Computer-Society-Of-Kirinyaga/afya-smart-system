import { UsersService } from '../users/users.service';
import type { SmsGateway } from './sms.gateway';
export declare class SmsService {
    private usersService;
    private smsGateway;
    private readonly logger;
    constructor(usersService: UsersService, smsGateway: SmsGateway);
    sendRiskAlert(userId: string, riskLevel: string, explanation: string): Promise<void>;
    private buildUserAlertMessage;
    private buildDoctorAlertMessage;
    private sendOrThrow;
    private getErrorMessage;
    private ensureNonEmpty;
}
