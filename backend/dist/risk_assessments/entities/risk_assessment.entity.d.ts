import { User } from 'src/users/entities/user.entity';
export type RiskLevel = 'healthy' | 'low' | 'moderate' | 'high';
export declare class RiskAssessment {
    id: string;
    user_id: string;
    user: User;
    assessment_time: Date;
    llm_input: string;
    llm_response: {
        risk_level: RiskLevel;
        risk_type: string;
        explanation: string;
        recommendation: string;
        confidence_score?: number;
        metrics_analyzed?: string[];
    };
    risk_level: RiskLevel;
    alert_sent: boolean;
    alert_sent_at: Date;
    created_at: Date;
}
