import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async updateDoctorInfo(
    userId: string,
    doctorName: string,
    doctorPhone: string,
  ) {
    await this.usersRepository.update(userId, {
      doctor_name: doctorName,
      doctor_phone_number: doctorPhone,
    });
    return this.findOne(userId);
  }

  async updateAlertPreferences(
    userId: string,
    preferences: User['alert_preferences'],
  ) {
    await this.usersRepository.update(userId, {
      alert_preferences: preferences,
    });
    return this.findOne(userId);
  }

  async findOne(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByPhone(phoneNumber: string) {
    return this.usersRepository.findOne({
      where: { phone_number: phoneNumber },
    });
  }

  async findAll() {
    return this.usersRepository.find();
  }
}
