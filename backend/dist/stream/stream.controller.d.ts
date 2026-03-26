import { HealthReadingsService } from 'src/health-readings/health-readings.service';
import { Observable } from 'rxjs';
export declare class StreamController {
    private readonly healthReadingsService;
    constructor(healthReadingsService: HealthReadingsService);
    streamHealthData(userId: string): Observable<MessageEvent>;
    testHealthStream(): Observable<MessageEvent>;
}
