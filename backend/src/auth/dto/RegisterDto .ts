import {
  IsString,
  IsOptional,
  IsBoolean,
  MinLength,
  IsPhoneNumber,
  IsNumber,
  IsArray,
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

  @IsOptional()
  @IsNumber()
  age: number;

  @IsOptional()
  @IsNumber()
  gender: number;

  @IsOptional()
  @IsArray()
  medications: string[]; // e.g., ['Lisinopril 10mg', 'Metformin 500mg']

  @IsOptional()
  @IsArray()
  chronicConditions: string[]; // e.g., ['Hypertension', 'Type 2 Diabetes']
}
