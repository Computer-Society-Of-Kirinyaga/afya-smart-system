import { Controller, Param, Sse } from '@nestjs/common';
import { HealthReadingsService } from 'src/health-readings/health-readings.service';
import { interval, Observable, switchMap } from 'rxjs';

@Controller('stream')
export class StreamController {
  constructor(private readonly healthReadingsService: HealthReadingsService) {}

  @Sse(':userId')
  streamHealthData(@Param('userId') userId: string): Observable<MessageEvent> {
    // Create an observable that emits every 5 seconds
    return interval(5000).pipe(
      switchMap(async () => {
        // Get the latest health reading for the user
        const readings =
          await this.healthReadingsService.findAllForUser(userId);
        const latestReading = readings[0];

        return {
          data: JSON.stringify(latestReading || { message: 'No data yet' }),
        } as MessageEvent;
      }),
    );
  }

  @Sse('health-test')
  testHealthStream(): Observable<MessageEvent> {
    return interval(3000).pipe(
      switchMap(async () => {
        const riskLevels = ['healthy', 'warning', 'critical'];
        const randomRisk =
          riskLevels[Math.floor(Math.random() * riskLevels.length)];

        return {
          data: JSON.stringify({
            id: Date.now(),
            heart_rate: 60 + Math.floor(Math.random() * 40),
            risk_level: randomRisk,
            timestamp: new Date().toISOString(),
            message: 'Test health data',
          }),
        } as MessageEvent;
      }),
    );
  }
}
