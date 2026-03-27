import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';

@Entity('health_readings')
export class HealthReading {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Index()
  timestamp: Date;

  @Column({ type: 'int', nullable: true })
  heart_rate: number; // bpm, normal 60-100

  @Column({ type: 'int', nullable: true })
  systolic_bp: number; // mmHg, normal <120

  @Column({ type: 'int', nullable: true })
  diastolic_bp: number; // mmHg, normal <80

  @Column({ type: 'int', nullable: true })
  spo2: number; // %, normal >95

  @Column({ type: 'float', nullable: true })
  temperature: number; // °C, normal 36.1-37.2

  @Column({ type: 'int', nullable: true })
  steps: number;

  @Column({ type: 'float', nullable: true })
  sleep_hours: number;

  @CreateDateColumn()
  created_at: Date;
}
