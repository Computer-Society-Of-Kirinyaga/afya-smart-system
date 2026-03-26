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
exports.StreamController = void 0;
const common_1 = require("@nestjs/common");
const health_readings_service_1 = require("../health-readings/health-readings.service");
const rxjs_1 = require("rxjs");
let StreamController = class StreamController {
    healthReadingsService;
    constructor(healthReadingsService) {
        this.healthReadingsService = healthReadingsService;
    }
    streamHealthData(userId) {
        return (0, rxjs_1.interval)(5000).pipe((0, rxjs_1.switchMap)(async () => {
            const readings = await this.healthReadingsService.findAllForUser(userId);
            const latestReading = readings[0];
            return {
                data: JSON.stringify(latestReading || { message: 'No data yet' }),
            };
        }));
    }
    testHealthStream() {
        return (0, rxjs_1.interval)(3000).pipe((0, rxjs_1.switchMap)(async () => {
            const riskLevels = ['healthy', 'warning', 'critical'];
            const randomRisk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
            return {
                data: JSON.stringify({
                    id: Date.now(),
                    heart_rate: 60 + Math.floor(Math.random() * 40),
                    risk_level: randomRisk,
                    timestamp: new Date().toISOString(),
                    message: 'Test health data',
                }),
            };
        }));
    }
};
exports.StreamController = StreamController;
__decorate([
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", rxjs_1.Observable)
], StreamController.prototype, "streamHealthData", null);
__decorate([
    (0, common_1.Sse)('health-test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", rxjs_1.Observable)
], StreamController.prototype, "testHealthStream", null);
exports.StreamController = StreamController = __decorate([
    (0, common_1.Controller)('stream'),
    __metadata("design:paramtypes", [health_readings_service_1.HealthReadingsService])
], StreamController);
//# sourceMappingURL=stream.controller.js.map