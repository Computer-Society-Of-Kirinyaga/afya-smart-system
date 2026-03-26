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
exports.HealthReadingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const health_reading_entity_1 = require("./entities/health-reading.entity");
const user_entity_1 = require("../users/entities/user.entity");
let HealthReadingsService = class HealthReadingsService {
    readingsRepository;
    usersRepository;
    constructor(readingsRepository, usersRepository) {
        this.readingsRepository = readingsRepository;
        this.usersRepository = usersRepository;
    }
    async create(createDto) {
        const user = await this.usersRepository.findOne({ where: { id: createDto.user_id } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${createDto.user_id} not found`);
        }
        const reading = this.readingsRepository.create({
            ...createDto,
            timestamp: createDto.timestamp ? new Date(createDto.timestamp) : new Date(),
        });
        return this.readingsRepository.save(reading);
    }
    async bulkCreate(bulkDto) {
        const readings = await Promise.all(bulkDto.readings.map(async (dto) => {
            const user = await this.usersRepository.findOne({ where: { id: dto.user_id } });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${dto.user_id} not found`);
            }
            return this.readingsRepository.create({
                ...dto,
                timestamp: dto.timestamp ? new Date(dto.timestamp) : new Date(),
            });
        }));
        return this.readingsRepository.save(readings);
    }
    async findAllForUser(userId, options) {
        const where = { user_id: userId };
        if (options?.startDate && options?.endDate) {
            where.timestamp = (0, typeorm_2.Between)(options.startDate, options.endDate);
        }
        else if (options?.startDate) {
            where.timestamp = (0, typeorm_2.MoreThan)(options.startDate);
        }
        else if (options?.endDate) {
            where.timestamp = (0, typeorm_2.LessThan)(options.endDate);
        }
        const query = this.readingsRepository.find({
            where,
            order: { timestamp: 'DESC' },
        });
        if (options?.limit) {
            (await query).slice(0, options.limit);
        }
        return query;
    }
    async getLatestReading(userId) {
        return this.readingsRepository.findOne({
            where: { user_id: userId },
            order: { timestamp: 'DESC' },
        });
    }
    async getReadingsLastHours(userId, hours) {
        const cutoffTime = new Date();
        cutoffTime.setHours(cutoffTime.getHours() - hours);
        return this.readingsRepository.find({
            where: {
                user_id: userId,
                timestamp: (0, typeorm_2.MoreThan)(cutoffTime),
            },
            order: { timestamp: 'ASC' },
        });
    }
    async getAggregatedReadings(userId, hours = 1) {
        const readings = await this.getReadingsLastHours(userId, hours);
        if (readings.length === 0) {
            return {
                readings: [],
                averages: {
                    avg_heart_rate: 0,
                    avg_spo2: 0,
                    avg_temperature: 0,
                    avg_systolic_bp: 0,
                    avg_diastolic_bp: 0,
                },
                trends: {
                    heart_rate_trend: 'stable',
                    spo2_trend: 'stable',
                    temperature_trend: 'stable',
                },
            };
        }
        const avg_heart_rate = readings.reduce((sum, r) => sum + (r.heart_rate || 0), 0) / readings.length;
        const avg_spo2 = readings.reduce((sum, r) => sum + (r.spo2 || 0), 0) / readings.length;
        const avg_temperature = readings.reduce((sum, r) => sum + (r.temperature || 0), 0) / readings.length;
        const avg_systolic_bp = readings.reduce((sum, r) => sum + (r.systolic_bp || 0), 0) / readings.length;
        const avg_diastolic_bp = readings.reduce((sum, r) => sum + (r.diastolic_bp || 0), 0) / readings.length;
        const midPoint = Math.floor(readings.length / 2);
        const firstHalf = readings.slice(0, midPoint);
        const secondHalf = readings.slice(midPoint);
        const getTrend = (values) => {
            if (values.length < 2)
                return 'stable';
            const firstAvg = values.slice(0, Math.floor(values.length / 2)).reduce((a, b) => a + b, 0) / Math.floor(values.length / 2);
            const secondAvg = values.slice(Math.floor(values.length / 2)).reduce((a, b) => a + b, 0) / (values.length - Math.floor(values.length / 2));
            const diffPercent = ((secondAvg - firstAvg) / firstAvg) * 100;
            if (diffPercent > 5)
                return 'increasing';
            if (diffPercent < -5)
                return 'decreasing';
            return 'stable';
        };
        return {
            readings,
            averages: {
                avg_heart_rate: parseFloat(avg_heart_rate.toFixed(1)),
                avg_spo2: parseFloat(avg_spo2.toFixed(1)),
                avg_temperature: parseFloat(avg_temperature.toFixed(1)),
                avg_systolic_bp: parseFloat(avg_systolic_bp.toFixed(0)),
                avg_diastolic_bp: parseFloat(avg_diastolic_bp.toFixed(0)),
            },
            trends: {
                heart_rate_trend: getTrend(readings.map(r => r.heart_rate).filter(Boolean)),
                spo2_trend: getTrend(readings.map(r => r.spo2).filter(Boolean)),
                temperature_trend: getTrend(readings.map(r => r.temperature).filter(Boolean)),
            },
        };
    }
};
exports.HealthReadingsService = HealthReadingsService;
exports.HealthReadingsService = HealthReadingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(health_reading_entity_1.HealthReading)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], HealthReadingsService);
//# sourceMappingURL=health-readings.service.js.map