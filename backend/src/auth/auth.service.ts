import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt  from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { compareData, hashData } from 'src/common/helpers/bcrypt.helper';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/RegisterDto ';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private async getTokens(user: User) {
    const payload = {
      sub: user.id,
      phone_number: user.phone_number,
      name: user.name,
      consent_given: user.consent_given,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>(
          'JWT_ACCESS_TOKEN_SECRET',
        ),
        expiresIn: this.configService.getOrThrow(
          'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
        ),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>(
          'JWT_REFRESH_TOKEN_SECRET',
        ),
        expiresIn: this.configService.getOrThrow(
          'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
        ),
      }),
    ]);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  private async saveRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await hashData(refreshToken);
    await this.userRepo.update(userId, {
      refresh_token: hashedRefreshToken,
    });
  }

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.userRepo.findOne({
      where: { phone_number: registerDto.phone_number },
    });

    if (existingUser) {
      throw new ConflictException('User with this phone number already exists');
    }

    // Hash password
    const hashedPassword = await hashData(registerDto.password);

    // Create new user
    const newUser = this.userRepo.create({
      phone_number: registerDto.phone_number,
      name: registerDto.name,
      password_hash: hashedPassword,
      doctor_name: registerDto.doctor_name,
      doctor_phone_number: registerDto.doctor_phone_number,
      consent_given: registerDto.consent_given || false,
      alert_preferences: registerDto.alert_preferences || {
        sms_enabled: true,
        risk_threshold: 'medium',
        alert_doctor: false,
      },
    });

    const savedUser = await this.userRepo.save(newUser);

    // Generate tokens
    const tokens = await this.getTokens(savedUser);
    await this.saveRefreshToken(savedUser.id, tokens.refresh_token);

    // Return user data without sensitive info
    const { password_hash, refresh_token, ...userWithoutSensitive } = savedUser;

    return {
      message: 'User registered successfully',
      user: userWithoutSensitive,
      tokens,
    };
  }

  async login(loginDto: LoginDto) {
    // Find user by phone number with password field
    const user = await this.userRepo.findOne({
      where: { phone_number: loginDto.phone_number },
      select: [
        'id',
        'phone_number',
        'name',
        'password_hash',
        'consent_given',
        'alert_preferences',
        'doctor_name',
        'doctor_phone_number',
        'created_at',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found with this phone number');
    }

    // Verify password
    const isPasswordValid = await compareData(
      loginDto.password,
      user.password_hash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.getTokens(user);
    await this.saveRefreshToken(user.id, tokens.refresh_token);

    // Remove sensitive data
    const { password_hash, ...userWithoutPassword } = user;

    return {
      message: 'Login successful',
      user: userWithoutPassword,
      tokens,
    };
  }

  async logout(userId: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepo.update(userId, { refresh_token: undefined });
    return { message: 'Logged out successfully' };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    // Find user with refresh token
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'phone_number', 'name', 'refresh_token', 'consent_given'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.refresh_token) {
      throw new UnauthorizedException('No refresh token found');
    }

    // Verify refresh token
    const refreshTokenMatches = await compareData(
      refreshToken,
      user.refresh_token,
    );
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Generate new tokens
    const tokens = await this.getTokens(user);
    await this.saveRefreshToken(user.id, tokens.refresh_token);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async getProfile(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: [
        'id',
        'phone_number',
        'name',
        'doctor_name',
        'doctor_phone_number',
        'consent_given',
        'alert_preferences',
        'created_at',
        'updated_at',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { user };
  }

  async updateProfile(userId: string, updateData: Partial<User>) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Remove sensitive fields that shouldn't be updated here
    delete updateData.id;
    delete updateData.password_hash;
    delete updateData.refresh_token;
    delete updateData.phone_number; // Phone number shouldn't be changed

    await this.userRepo.update(userId, updateData);

    return this.getProfile(userId);
  }
}
