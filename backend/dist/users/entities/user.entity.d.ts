export declare class User {
    id: string;
    phone_number: string;
    name: string;
    password_hash: string;
    doctor_name: string;
    doctor_phone_number: string;
    consent_given: boolean;
    alert_preferences: {
        sms_enabled: boolean;
        risk_threshold: 'low' | 'medium' | 'high';
        alert_doctor: boolean;
    };
    refresh_token?: string;
    created_at: Date;
    updated_at: Date;
}
