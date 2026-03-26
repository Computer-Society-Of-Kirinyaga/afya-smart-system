import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    updateDoctorInfo(userId: string, doctorName: string, doctorPhone: string): Promise<User | null>;
    updateAlertPreferences(userId: string, preferences: User['alert_preferences']): Promise<User | null>;
    findOne(id: string): Promise<User | null>;
    findByPhone(phoneNumber: string): Promise<User | null>;
    findAll(): Promise<User[]>;
}
