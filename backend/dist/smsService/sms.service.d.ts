import { UsersService } from '../users/users.service';
export declare class SmsService {
    private usersService;
    constructor(usersService: UsersService);
    sendRiskAlert(userId: string, riskLevel: string, explanation: string): Promise<void>;
}
