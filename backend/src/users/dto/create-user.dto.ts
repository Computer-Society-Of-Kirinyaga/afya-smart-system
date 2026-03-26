import { IsString, IsPhoneNumber, IsBoolean, IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AlertPreferencesDto {
  @IsBoolean()
  @IsOptional()
  sms_enabled?: boolean;

  @IsEnum(['low', 'medium', 'high'])
  @IsOptional()
  risk_threshold?: 'low' | 'medium' | 'high';

  @IsBoolean()
  @IsOptional()
  alert_doctor?: boolean;
}

export class CreateUserDto {
  @IsString()
  name: string;

  @IsPhoneNumber()
  phone_number: string;

  @IsString()
  @IsOptional()
  doctor_name?: string;

  @IsPhoneNumber()
  @IsOptional()
  doctor_phone_number?: string;

  @IsBoolean()
  consent_given: boolean;

  @ValidateNested()
  @Type(() => AlertPreferencesDto)
  @IsOptional()
  alert_preferences?: AlertPreferencesDto;
}