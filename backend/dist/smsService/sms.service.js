"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SmsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const sms_gateway_1 = require("./sms.gateway");
let SmsService = SmsService_1 = class SmsService {
    usersService;
    smsGateway;
    logger = new common_1.Logger(SmsService_1.name);
    constructor(usersService, smsGateway) {
        this.usersService = usersService;
        this.smsGateway = smsGateway;
    }
    async sendRiskAlert(userId, riskLevel, explanation) {
        this.ensureNonEmpty(userId, 'userId');
        this.ensureNonEmpty(riskLevel, 'riskLevel');
        this.ensureNonEmpty(explanation, 'explanation');
        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new common_1.NotFoundException(`User not found for SMS alert. userId=${userId}`);
        }
        if (!user.alert_preferences?.sms_enabled)
            return;
        if (!user.phone_number) {
            throw new common_1.BadRequestException(`User has SMS enabled but no phone number on file. userId=${userId}`);
        }
        const errors = [];
        const userMessage = this.buildUserAlertMessage(user.name, riskLevel, explanation);
        try {
            await this.sendOrThrow(user.phone_number, userMessage);
        }
        catch (error) {
            errors.push(`user:${this.getErrorMessage(error)}`);
        }
        if (user.alert_preferences.alert_doctor) {
            if (!user.doctor_phone_number) {
                throw new common_1.BadRequestException(`Doctor alerts enabled but no doctor phone number on file. userId=${userId}`);
            }
            const doctorMessage = this.buildDoctorAlertMessage(user.name, user.phone_number, riskLevel, explanation);
            try {
                await this.sendOrThrow(user.doctor_phone_number, doctorMessage);
            }
            catch (error) {
                errors.push(`doctor:${this.getErrorMessage(error)}`);
            }
        }
        if (errors.length > 0) {
            throw new common_1.ServiceUnavailableException(`SMS delivery failed for ${errors.length} recipient(s): ${errors.join(', ')}`);
        }
    }
    buildUserAlertMessage(userName, riskLevel, explanation) {
        const level = riskLevel.toUpperCase();
        return `Hello ${userName}, risk level: ${level}. ${explanation}`;
    }
    buildDoctorAlertMessage(userName, userPhone, riskLevel, explanation) {
        const level = riskLevel.toUpperCase();
        return `Patient ${userName} (${userPhone}) risk level: ${level}. ${explanation}`;
    }
    async sendOrThrow(to, message) {
        try {
            await this.smsGateway.sendSms({ to, message });
        }
        catch (error) {
            const errorMessage = this.getErrorMessage(error);
            this.logger.warn(`SMS send failed for ${to}: ${errorMessage}`);
            throw new common_1.ServiceUnavailableException(`Failed to send SMS to ${to}: ${errorMessage}`);
        }
    }
    getErrorMessage(error) {
        if (error instanceof Error)
            return error.message;
        return 'Unknown error';
    }
    ensureNonEmpty(value, fieldName) {
        if (!value || value.trim().length === 0) {
            throw new common_1.BadRequestException(`${fieldName} is required for SMS alerts.`);
        }
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = SmsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(sms_gateway_1.SMS_GATEWAY)),
    __metadata("design:paramtypes", [users_service_1.UsersService, Object])
], SmsService);
//# sourceMappingURL=sms.service.js.map