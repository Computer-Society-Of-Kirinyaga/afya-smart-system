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
exports.BulkCreateHealthReadingDto = exports.CreateHealthReadingDto = void 0;
const class_validator_1 = require("class-validator");
class CreateHealthReadingDto {
    user_id;
    timestamp;
    heart_rate;
    systolic_bp;
    diastolic_bp;
    spo2;
    temperature;
    steps;
    sleep_hours;
}
exports.CreateHealthReadingDto = CreateHealthReadingDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateHealthReadingDto.prototype, "user_id", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateHealthReadingDto.prototype, "timestamp", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.Max)(220),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateHealthReadingDto.prototype, "heart_rate", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(70),
    (0, class_validator_1.Max)(200),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateHealthReadingDto.prototype, "systolic_bp", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(40),
    (0, class_validator_1.Max)(120),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateHealthReadingDto.prototype, "diastolic_bp", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(70),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateHealthReadingDto.prototype, "spo2", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(35),
    (0, class_validator_1.Max)(40),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateHealthReadingDto.prototype, "temperature", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateHealthReadingDto.prototype, "steps", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(24),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateHealthReadingDto.prototype, "sleep_hours", void 0);
class BulkCreateHealthReadingDto {
    readings;
}
exports.BulkCreateHealthReadingDto = BulkCreateHealthReadingDto;
//# sourceMappingURL=create-health-reading.dto.js.map