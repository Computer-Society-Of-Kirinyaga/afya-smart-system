import {
  IsString,
  IsOptional,
  IsBoolean,
  MinLength,
  IsPhoneNumber,
} from 'class-validator';

export class RegisterDto {
  @IsPhoneNumber()
  phone_number: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  doctor_name?: string;

  @IsOptional()
  @IsPhoneNumber()
  doctor_phone_number?: string;

  @IsOptional()
  @IsBoolean()
  consent_given?: boolean;

  @IsOptional()
  alert_preferences?: {
    sms_enabled: boolean;
    risk_threshold: 'low' | 'medium' | 'high';
    alert_doctor: boolean;
  };
}
