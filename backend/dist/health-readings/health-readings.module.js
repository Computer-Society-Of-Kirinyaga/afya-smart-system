"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthReadingsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const health_readings_service_1 = require("./health-readings.service");
const health_readings_controller_1 = require("./health-readings.controller");
const health_reading_entity_1 = require("./entities/health-reading.entity");
const users_module_1 = require("../users/users.module");
let HealthReadingsModule = class HealthReadingsModule {
};
exports.HealthReadingsModule = HealthReadingsModule;
exports.HealthReadingsModule = HealthReadingsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([health_reading_entity_1.HealthReading]), users_module_1.UsersModule],
        controllers: [health_readings_controller_1.HealthReadingsController],
        providers: [health_readings_service_1.HealthReadingsService],
        exports: [health_readings_service_1.HealthReadingsService],
    })
], HealthReadingsModule);
//# sourceMappingURL=health-readings.module.js.map