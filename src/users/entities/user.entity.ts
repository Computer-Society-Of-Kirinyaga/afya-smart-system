import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn,
  Index 
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  phone_number: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  doctor_name: string;

  @Column({ nullable: true })
  doctor_phone_number: string;

  @Column({ default: false })
  consent_given: boolean;

  @Column({ 
    type: 'jsonb', 
    default: { 
      sms_enabled: true, 
      risk_threshold: 'medium',
      alert_doctor: false  // Option to also alert doctor
    } 
  })
  alert_preferences: {
    sms_enabled: boolean;
    risk_threshold: 'low' | 'medium' | 'high';
    alert_doctor: boolean;
  };

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}