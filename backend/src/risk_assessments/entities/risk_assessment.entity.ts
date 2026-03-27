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

export type RiskLevel = 'healthy' | 'low' | 'moderate' | 'high';

@Entity('risk_assessments')
export class RiskAssessment {
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
  assessment_time: Date;

  @Column({ type: 'text' })
  llm_input: string; // what was sent to LLM

  @Column({ type: 'jsonb' })
  llm_response: {
    risk_level: RiskLevel;
    risk_type: string;
    explanation: string;
    recommendation: string;
    confidence_score?: number; // Optional: 0-1
    metrics_analyzed?: string[]; // Optional: which metrics triggered the alert
  };

  @Column({
    type: 'enum',
    enum: ['healthy', 'low', 'moderate', 'high'],
    default: 'healthy',
  })
  @Index()
  risk_level: RiskLevel;

  @Column({ default: false })
  alert_sent: boolean;

  @Column({ type: 'timestamp', nullable: true })
  alert_sent_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
