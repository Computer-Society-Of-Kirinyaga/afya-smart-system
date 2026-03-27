import {
  IsString,
  IsNumber,
  IsArray,
  IsObject,
  IsOptional,
  MinLength,
  Min,
  Max,
} from 'class-validator';

export class VitalSignDto {
  @IsNumber()
  @Min(30)
  @Max(200)
  heartRate: number;

  @IsNumber()
  @Min(80)
  @Max(100)
  spo2: number;

  @IsNumber()
  @Min(35)
  @Max(42)
  temperature: number;

  @IsNumber()
  @Min(80)
  @Max(250)
  bloodPressureSystolic: number;

  @IsNumber()
  @Min(40)
  @Max(150)
  bloodPressureDiastolic: number;

  @IsNumber()
  @Min(8)
  @Max(30)
  respiratoryRate: number;

  @IsString()
  timestamp: string;
}

export class HealthInputDto {
  @IsString()
  @MinLength(1)
  deviceId: string;

  @IsString()
  @MinLength(1)
  patientId: string;

  @IsObject()
  symptoms: Record<string, number>;

  @IsArray()
  @MinLength(1, { message: 'At least one vital reading is required' })
  vitals: VitalSignDto[];

  @IsNumber()
  @Min(0)
  @Max(150)
  age: number;

  @IsNumber()
  gender: number; // 0 = Male, 1 = Female

  @IsOptional()
  @IsArray()
  chronicConditions: string[];

  @IsOptional()
  @IsArray()
  medications: string[];

  @IsString()
  timestamp: string;
}
