import { User } from 'src/users/entities/user.entity';
export declare class HealthReading {
    id: string;
    user_id: string;
    user: User;
    timestamp: Date;
    heart_rate: number;
    systolic_bp: number;
    diastolic_bp: number;
    spo2: number;
    temperature: number;
    steps: number;
    sleep_hours: number;
    created_at: Date;
}
