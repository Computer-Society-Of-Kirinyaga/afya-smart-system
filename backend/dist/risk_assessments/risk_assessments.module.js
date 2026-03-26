"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskAssessmentsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const health_readings_module_1 = require("../health-readings/health-readings.module");
const users_module_1 = require("../users/users.module");
const risk_assessment_entity_1 = require("./entities/risk_assessment.entity");
const risk_assessments_controller_1 = require("./risk_assessments.controller");
const risk_assessments_service_1 = require("./risk_assessments.service");
const sms_module_1 = require("../sms/sms.module");
let RiskAssessmentsModule = class RiskAssessmentsModule {
};
exports.RiskAssessmentsModule = RiskAssessmentsModule;
exports.RiskAssessmentsModule = RiskAssessmentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([risk_assessment_entity_1.RiskAssessment]),
            health_readings_module_1.HealthReadingsModule,
            users_module_1.UsersModule,
            sms_module_1.SmsModule,
        ],
        controllers: [risk_assessments_controller_1.RiskAssessmentsController],
        providers: [risk_assessments_service_1.RiskAssessmentsService],
        exports: [risk_assessments_service_1.RiskAssessmentsService],
    })
], RiskAssessmentsModule);
//# sourceMappingURL=risk_assessments.module.js.map