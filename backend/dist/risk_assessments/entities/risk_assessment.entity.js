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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskAssessment = void 0;
const user_entity_1 = require("../../users/entities/user.entity");
const typeorm_1 = require("typeorm");
let RiskAssessment = class RiskAssessment {
    id;
    user_id;
    user;
    assessment_time;
    llm_input;
    llm_response;
    risk_level;
    alert_sent;
    alert_sent_at;
    created_at;
};
exports.RiskAssessment = RiskAssessment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RiskAssessment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], RiskAssessment.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], RiskAssessment.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], RiskAssessment.prototype, "assessment_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], RiskAssessment.prototype, "llm_input", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], RiskAssessment.prototype, "llm_response", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['healthy', 'low', 'moderate', 'high'],
        default: 'healthy',
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], RiskAssessment.prototype, "risk_level", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], RiskAssessment.prototype, "alert_sent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], RiskAssessment.prototype, "alert_sent_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RiskAssessment.prototype, "created_at", void 0);
exports.RiskAssessment = RiskAssessment = __decorate([
    (0, typeorm_1.Entity)('risk_assessments')
], RiskAssessment);
//# sourceMappingURL=risk_assessment.entity.js.map