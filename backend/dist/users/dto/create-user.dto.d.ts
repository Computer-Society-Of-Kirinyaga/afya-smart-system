export declare class AlertPreferencesDto {
    sms_enabled?: boolean;
    risk_threshold?: 'low' | 'medium' | 'high';
    alert_doctor?: boolean;
}
export declare class CreateUserDto {
    name: string;
    phone_number: string;
    doctor_name?: string;
    doctor_phone_number?: string;
    consent_given: boolean;
    alert_preferences?: AlertPreferencesDto;
}
