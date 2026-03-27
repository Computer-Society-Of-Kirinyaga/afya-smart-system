import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
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

  //No point we dont have a unified system they are all individual
  // @Get()
  // findAll() {
  //   return this.healthReadingsService.findAll();
  // }

  @Get('latest-health/:id')
  findLatestReading(@Param('id') id: string) {
    return this.healthReadingsService.getLatestReading(id);
  }

  @Get('latest-health/:id')
  findAggregateReading(@Param('id') id: string) {
    return this.healthReadingsService.getAggregatedReadings(id);
  }

  @Get('health-reading/:id')
  findOne(@Param('id') id: string) {
    return this.healthReadingsService.findAllForUser(id);
  }

  //We do not expect udpate for health readings its realtime

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateHealthReadingDto: UpdateHealthReadingDto) {
  //   return this.healthReadingsService.update(+id, updateHealthReadingDto);
  // }

  // we do not expect delete, again its real time
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.healthReadingsService.remove(+id);
  // }
}
