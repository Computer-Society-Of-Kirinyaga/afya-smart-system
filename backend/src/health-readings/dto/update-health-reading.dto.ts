import { PartialType } from '@nestjs/mapped-types';
import { CreateHealthReadingDto } from './create-health-reading.dto';

export class UpdateHealthReadingDto extends PartialType(
  CreateHealthReadingDto,
) {}
