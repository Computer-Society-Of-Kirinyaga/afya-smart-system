import { Controller,Param, Sse } from '@nestjs/common';
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
}
