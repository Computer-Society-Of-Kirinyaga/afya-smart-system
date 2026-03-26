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
exports.RiskAssessmentsController = void 0;
const common_1 = require("@nestjs/common");
const create_risk_assessment_dto_1 = require("./dto/create-risk_assessment.dto");
const risk_assessments_service_1 = require("./risk_assessments.service");
let RiskAssessmentsController = class RiskAssessmentsController {
    riskAssessmentsService;
    constructor(riskAssessmentsService) {
        this.riskAssessmentsService = riskAssessmentsService;
    }
    async create(createDto) {
        return this.riskAssessmentsService.create(createDto);
    }
    async getLatestAssessment(userId) {
        const assessment = await this.riskAssessmentsService.getLatestAssessment(userId);
        if (!assessment) {
            return {
                statusCode: common_1.HttpStatus.NOT_FOUND,
                message: 'No risk assessments found for this user',
                assessment: null,
            };
        }
        return assessment;
    }
    async getAssessmentsForUser(userId, startDate, endDate, limit) {
        const options = {
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
        };
        const assessments = await this.riskAssessmentsService.getAssessmentsForUser(userId, options);
        return {
            userId,
            count: assessments.length,
            assessments,
        };
    }
    async getRiskHistory(userId) {
        const history = await this.riskAssessmentsService.getRiskHistory(userId);
        return {
            userId,
            ...history,
        };
    }
    async updateAlertStatus(assessmentId, alertSent) {
        await this.riskAssessmentsService.updateAlertStatus(assessmentId, alertSent);
        return {
            message: 'Alert status updated successfully',
            assessmentId,
            alertSent,
        };
    }
    async getDashboardStats(userId) {
        return await this.riskAssessmentsService.getAssessmentsForUser(userId);
    }
};
exports.RiskAssessmentsController = RiskAssessmentsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_risk_assessment_dto_1.CreateRiskAssessmentDto]),
    __metadata("design:returntype", Promise)
], RiskAssessmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('latestAssessment/:userId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RiskAssessmentsController.prototype, "getLatestAssessment", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], RiskAssessmentsController.prototype, "getAssessmentsForUser", null);
__decorate([
    (0, common_1.Get)('history/:userId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RiskAssessmentsController.prototype, "getRiskHistory", null);
__decorate([
    (0, common_1.Patch)(':assessmentId/alert-status'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('assessmentId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('alertSent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], RiskAssessmentsController.prototype, "updateAlertStatus", null);
__decorate([
    (0, common_1.Get)('stats/dashboard/:userId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RiskAssessmentsController.prototype, "getDashboardStats", null);
exports.RiskAssessmentsController = RiskAssessmentsController = __decorate([
    (0, common_1.Controller)('risk-assessments'),
    __metadata("design:paramtypes", [risk_assessments_service_1.RiskAssessmentsService])
], RiskAssessmentsController);
//# sourceMappingURL=risk_assessments.controller.js.map