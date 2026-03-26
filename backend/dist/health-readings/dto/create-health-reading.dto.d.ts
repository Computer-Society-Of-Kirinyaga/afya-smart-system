export declare class CreateHealthReadingDto {
    user_id: string;
    timestamp?: string;
    heart_rate?: number;
    systolic_bp?: number;
    diastolic_bp?: number;
    spo2?: number;
    temperature?: number;
    steps?: number;
    sleep_hours?: number;
}
export declare class BulkCreateHealthReadingDto {
    readings: CreateHealthReadingDto[];
}
