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
exports.CreateRiskAssessmentDto = exports.LlmResponseDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class LlmResponseDto {
    risk_level;
    risk_type;
    explanation;
    recommendation;
    confidence_score;
    metrics_analyzed;
}
exports.LlmResponseDto = LlmResponseDto;
__decorate([
    (0, class_validator_1.IsEnum)(['healthy', 'low', 'moderate', 'high']),
    __metadata("design:type", String)
], LlmResponseDto.prototype, "risk_level", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], LlmResponseDto.prototype, "confidence_score", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], LlmResponseDto.prototype, "metrics_analyzed", void 0);
class CreateRiskAssessmentDto {
    user_id;
    assessment_time;
    llm_input;
    llm_response;
    risk_level;
    alert_sent;
}
exports.CreateRiskAssessmentDto = CreateRiskAssessmentDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRiskAssessmentDto.prototype, "user_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateRiskAssessmentDto.prototype, "assessment_time", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LlmResponseDto),
    __metadata("design:type", LlmResponseDto)
], CreateRiskAssessmentDto.prototype, "llm_response", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['healthy', 'low', 'moderate', 'high']),
    __metadata("design:type", String)
], CreateRiskAssessmentDto.prototype, "risk_level", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateRiskAssessmentDto.prototype, "alert_sent", void 0);
//# sourceMappingURL=create-risk_assessment.dto.js.map