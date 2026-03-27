import {
  IsObject,
  IsString,
  IsArray,
  IsEnum,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class PredictionResponseDto {
  @IsString()
  patientId: string;

  @IsString()
  disease: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  confidence: number;

  @IsObject()
  probabilities: Record<string, number>;

  @IsEnum(['NORMAL', 'WARNING', 'CRITICAL'])
  alertLevel: 'NORMAL' | 'WARNING' | 'CRITICAL';

  @IsArray()
  @IsString({ each: true })
  recommendations: string[];

  @IsNumber()
  processingTimeMs: number;

  @IsString()
  timeStamp: string;
}
