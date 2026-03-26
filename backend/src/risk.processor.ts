// import { Injectable } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';

// @Injectable()
// export class RiskProcessor {
//   constructor(
//     private readonly healthService: HealthService,
//     private readonly riskService: RiskService,
//     private readonly userService: UserService,
//   ) {}

//   @Cron('*/5 * * * *') // every 5 minutes
//   async processRisks() {
//     console.log('⏱ Running risk assessment job...');

//     // 1. Get users with recent readings (last 5 min)
//     const users = await this.userService.getUsersWithRecentReadings();

//     for (const user of users) {
//       // 2. Fetch last 5 readings
//       const readings = await this.healthService.getRecentReadings(user.id, 5);

//       if (!readings || readings.length === 0) continue;

//       // 3. Format for LLM (trend arrays)
//       const metrics = {
//         heart_rate: readings.map(r => r.heart_rate),
//         spo2: readings.map(r => r.spo2),
//         temperature: readings.map(r => r.temperature),
//         systolic_bp: readings.map(r => r.systolic_bp),
//         diastolic_bp: readings.map(r => r.diastolic_bp),
//       };

//       // 4. Run risk assessment
//       const riskResult = await this.riskService.analyze(metrics);

//       // 5. Save result
//       await this.riskService.saveAssessment(user.id, metrics, riskResult);

//       console.log(`Processed user ${user.id}: ${riskResult.risk_level}`);
//     }
//   }
// }