import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(createUserDto: CreateUserDto): Promise<User>;
    findOne(id: string): Promise<User | null>;
    updateDoctor(id: string, body: {
        doctor_name: string;
        doctor_phone_number: string;
    }): Promise<User | null>;
    updatePreferences(id: string, preferences: User['alert_preferences']): Promise<User | null>;
}
