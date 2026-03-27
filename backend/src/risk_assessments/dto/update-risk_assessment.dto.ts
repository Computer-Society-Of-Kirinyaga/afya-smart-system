import { PartialType } from '@nestjs/mapped-types';
import { CreateRiskAssessmentDto } from './create-risk_assessment.dto';

export class UpdateRiskAssessmentDto extends PartialType(
  CreateRiskAssessmentDto,
) {}
