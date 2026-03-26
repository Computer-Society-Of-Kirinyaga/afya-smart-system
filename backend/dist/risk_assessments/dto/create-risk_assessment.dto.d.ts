export declare class LlmResponseDto {
    risk_level: 'healthy' | 'low' | 'moderate' | 'high';
    risk_type: string;
    explanation: string;
    recommendation: string;
    confidence_score?: number;
    metrics_analyzed?: string[];
}
export declare class CreateRiskAssessmentDto {
    user_id: string;
    assessment_time?: Date;
    llm_input: string;
    llm_response: LlmResponseDto;
    risk_level: 'healthy' | 'low' | 'moderate' | 'high';
    alert_sent?: boolean;
}
