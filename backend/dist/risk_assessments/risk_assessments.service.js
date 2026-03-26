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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskAssessmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const health_readings_service_1 = require("../health-readings/health-readings.service");
const users_service_1 = require("../users/users.service");
const risk_assessment_entity_1 = require("./entities/risk_assessment.entity");
const sms_service_1 = require("../smsService/sms.service");
let RiskAssessmentsService = class RiskAssessmentsService {
    riskRepository;
    healthReadingsService;
    usersService;
    smsService;
    constructor(riskRepository, healthReadingsService, usersService, smsService) {
        this.riskRepository = riskRepository;
        this.healthReadingsService = healthReadingsService;
        this.usersService = usersService;
        this.smsService = smsService;
    }
    async create(createDto) {
        const assessment = this.riskRepository.create(createDto);
        return this.riskRepository.save(assessment);
    }
    async assessUserRisk(userId) {
        const readings = await this.healthReadingsService.getReadingsLastHours(userId, 1);
        if (readings.length === 0) {
            return null;
        }
        const llmInput = {
            user_id: userId,
            readings: readings.map(r => ({
                timestamp: r.timestamp,
                heart_rate: r.heart_rate,
                systolic_bp: r.systolic_bp,
                diastolic_bp: r.diastolic_bp,
                spo2: r.spo2,
                temperature: r.temperature,
            })),
            averages: {
                heart_rate: readings.reduce((sum, r) => sum + (r.heart_rate || 0), 0) / readings.length,
                spo2: readings.reduce((sum, r) => sum + (r.spo2 || 0), 0) / readings.length,
                temperature: readings.reduce((sum, r) => sum + (r.temperature || 0), 0) / readings.length,
            },
        };
        const mockLlmResponse = {
            risk_level: 'healthy',
            risk_type: 'none',
            explanation: 'All vitals are within normal ranges',
            recommendation: 'Continue monitoring',
            confidence_score: 0.95,
        };
        const riskLevel = mockLlmResponse.risk_level;
        const assessment = await this.create({
            user_id: userId,
            llm_input: JSON.stringify(llmInput),
            llm_response: mockLlmResponse,
            risk_level: riskLevel,
            alert_sent: false,
        });
        if (riskLevel !== 'healthy') {
        }
        return assessment;
    }
    async updateAlertStatus(assessmentId, alertSent) {
        if (alertSent) {
            await this.riskRepository.update(assessmentId, {
                alert_sent: alertSent,
                alert_sent_at: new Date()
            });
        }
        await this.riskRepository.update(assessmentId, {
            alert_sent: alertSent,
        });
    }
    async getLatestAssessment(userId) {
        return this.riskRepository.findOne({
            where: { user_id: userId },
            order: { assessment_time: 'DESC' },
        });
    }
    async getAssessmentsForUser(userId, options) {
        const where = { user_id: userId };
        if (options?.startDate && options?.endDate) {
            where.assessment_time = (0, typeorm_2.MoreThan)(options.startDate);
        }
        const query = this.riskRepository.find({
            where,
            order: { assessment_time: 'DESC' },
        });
        if (options?.limit) {
            (await query).slice(0, options.limit);
        }
        return query;
    }
    async getRiskHistory(userId) {
        const assessments = await this.getAssessmentsForUser(userId, { limit: 10 });
        if (assessments.length === 0) {
            return {
                assessments: [],
                riskTrend: 'stable',
                lastHealthyDays: 0,
            };
        }
        const riskScores = { healthy: 0, low: 1, moderate: 2, high: 3 };
        const recent = assessments.slice(0, 5);
        const older = assessments.slice(5);
        const recentAvg = recent.reduce((sum, a) => sum + riskScores[a.risk_level], 0) / recent.length;
        const olderAvg = older.length > 0 ? older.reduce((sum, a) => sum + riskScores[a.risk_level], 0) / older.length : recentAvg;
        let riskTrend = 'stable';
        if (recentAvg < olderAvg - 0.5)
            riskTrend = 'improving';
        if (recentAvg > olderAvg + 0.5)
            riskTrend = 'worsening';
        let lastHealthyDays = 0;
        const lastHealthy = assessments.find(a => a.risk_level === 'healthy');
        if (lastHealthy) {
            lastHealthyDays = Math.floor((new Date().getTime() - lastHealthy.assessment_time.getTime()) / (1000 * 3600 * 24));
        }
        return {
            assessments,
            riskTrend,
            lastHealthyDays,
        };
    }
};
exports.RiskAssessmentsService = RiskAssessmentsService;
exports.RiskAssessmentsService = RiskAssessmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(risk_assessment_entity_1.RiskAssessment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        health_readings_service_1.HealthReadingsService,
        users_service_1.UsersService,
        sms_service_1.SmsService])
], RiskAssessmentsService);
//# sourceMappingURL=risk_assessments.service.js.map