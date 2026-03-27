import {
  IsUUID,
  IsOptional,
  IsBoolean,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PredictionResponseDto } from 'src/ai-model/dto/ai-response.dto';

export class CreateRiskAssessmentDto {
  @IsUUID()
  user_id: string;

  @IsOptional()
  assessment_time?: Date;

  llm_input: string;

  @ValidateNested()
  @Type(() => PredictionResponseDto)
  llm_response: PredictionResponseDto;

  @IsEnum(['healthy', 'low', 'moderate', 'high'])
  risk_level: 'healthy' | 'low' | 'moderate' | 'high';

  @IsBoolean()
  @IsOptional()
  alert_sent?: boolean;
}
