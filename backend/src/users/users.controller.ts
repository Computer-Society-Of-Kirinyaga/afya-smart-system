import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch(':id/doctor')
  async updateDoctor(
    @Param('id') id: string,
    @Body() body: { doctor_name: string; doctor_phone_number: string },
  ) {
    return this.usersService.updateDoctorInfo(
      id,
      body.doctor_name,
      body.doctor_phone_number,
    );
  }

  // @UseGuards(JwtAuthGuard)
  @Patch(':id/preferences')
  async updatePreferences(
    @Param('id') id: string,
    @Body() preferences: User['alert_preferences'],
  ) {
    return this.usersService.updateAlertPreferences(id, preferences);
  }
}
