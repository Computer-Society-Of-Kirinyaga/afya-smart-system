import { IsUUID, IsOptional, IsBoolean, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class LlmResponseDto {
  @IsEnum(['healthy', 'low', 'moderate', 'high'])
  risk_level: 'healthy' | 'low' | 'moderate' | 'high';

  risk_type: string;
  explanation: string;
  recommendation: string;

  @IsOptional()
  confidence_score?: number;

  @IsOptional()
  metrics_analyzed?: string[];
}

export class CreateRiskAssessmentDto {
  @IsUUID()
  user_id: string;

  @IsOptional()
  assessment_time?: Date;

  llm_input: string;

  @ValidateNested()
  @Type(() => LlmResponseDto)
  llm_response: LlmResponseDto;

  @IsEnum(['healthy', 'low', 'moderate', 'high'])
  risk_level: 'healthy' | 'low' | 'moderate' | 'high';

  @IsBoolean()
  @IsOptional()
  alert_sent?: boolean;
}