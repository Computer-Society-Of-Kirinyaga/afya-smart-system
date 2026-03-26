import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HealthReadingsService } from './health-readings.service';
import { CreateHealthReadingDto } from './dto/create-health-reading.dto';
import { UpdateHealthReadingDto } from './dto/update-health-reading.dto';

@Controller('health-readings')
export class HealthReadingsController {
  constructor(private readonly healthReadingsService: HealthReadingsService) {}

  @Post()
  create(@Body() createHealthReadingDto: CreateHealthReadingDto) {
    return this.healthReadingsService.create(createHealthReadingDto);
  }

  @Get()
  findAll() {
    return this.healthReadingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.healthReadingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHealthReadingDto: UpdateHealthReadingDto) {
    return this.healthReadingsService.update(+id, updateHealthReadingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.healthReadingsService.remove(+id);
  }
}
