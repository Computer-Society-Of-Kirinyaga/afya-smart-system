import {
  IsUUID,
  IsInt,
  IsOptional,
  Min,
  Max,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class CreateHealthReadingDto {
  @IsUUID()
  user_id: string;

  @IsDateString()
  @IsOptional()
  timestamp?: string;

  @IsInt()
  @Min(30)
  @Max(220)
  @IsOptional()
  heart_rate?: number;

  @IsInt()
  @Min(70)
  @Max(200)
  @IsOptional()
  systolic_bp?: number;

  @IsInt()
  @Min(40)
  @Max(120)
  @IsOptional()
  diastolic_bp?: number;

  @IsInt()
  @Min(70)
  @Max(100)
  @IsOptional()
  spo2?: number;

  @IsNumber()
  @Min(35)
  @Max(40)
  @IsOptional()
  temperature?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  steps?: number;

  @IsNumber()
  @Min(0)
  @Max(24)
  @IsOptional()
  sleep_hours?: number;
}

export class BulkCreateHealthReadingDto {
  readings: CreateHealthReadingDto[];
}
