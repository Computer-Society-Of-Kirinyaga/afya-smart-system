import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AiModelService } from './ai-model.service';
import { HealthInputDto } from './dto/ai-input.dto';
import { PredictionResponseDto } from './dto/ai-response.dto';

@Controller('ai-model')
export class AiModelController {
  constructor(private readonly aiModelService: AiModelService) {}

  @Post('analyze')
  @HttpCode(HttpStatus.OK)
  async analyzeHealthData(
    @Body() input: HealthInputDto,
  ): Promise<PredictionResponseDto> {
    return this.aiModelService.analyzeHealthData(input);
  }

  @Post('predict')
  @HttpCode(HttpStatus.OK)
  async predictDisease(
    @Body() input: HealthInputDto,
  ): Promise<PredictionResponseDto> {
    return this.aiModelService.analyzeHealthData(input);
  }
}
