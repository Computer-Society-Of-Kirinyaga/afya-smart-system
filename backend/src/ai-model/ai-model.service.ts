import { GoogleGenAI } from '@google/genai';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthInputDto } from './dto/ai-input.dto';
import { PredictionResponseDto } from './dto/ai-response.dto';

@Injectable()
export class AiModelService {
  private readonly logger = new Logger(AiModelService.name);
  private genAI: GoogleGenAI;
  private model: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY environment variable is not set. Please configure it.',
      );
    }

    this.genAI = new GoogleGenAI({ apiKey });
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-pro',
      systemInstruction: this.getSystemPrompt(),
    });
  }

  private getSystemPrompt(): string {
    return `You are an advanced health analytics AI system for a smart healthcare platform in Kenya. 
Your role is to analyze patient vital signs, symptoms, and medical history to:
1. Identify potential health risks and diseases
2. Generate personalized health recommendations
3. Determine alert levels for medical attention

You must respond ONLY with a valid JSON object (no markdown, no extra text) in this exact format:
{
  "disease": "string (primary condition detected or 'healthy')",
  "confidence": number (0-1),
  "alertLevel": "string (NORMAL, WARNING, or CRITICAL)",
  "probabilities": {
    "healthy": number (0-1),
    "hypertension": number (0-1),
    "diabetes": number (0-1),
    "arthritis": number (0-1),
    "asthma": number (0-1),
    "pneumonia": number (0-1),
    "uti": number (0-1),
    "covid19": number (0-1),
    "copd": number (0-1),
    "migraine": number (0-1)
  },
  "recommendations": ["string", "string", "string"],
  "reasoning": "string (brief explanation of analysis)"
}

Alert Level Guidance:
- CRITICAL: Immediate medical attention needed (chest pain, severe breathing issues, BP >180/120, high fever >39°C, SpO2 <90%, etc.)
- WARNING: Elevated risk, medical consultation recommended (BP 140-180, SpO2 90-95%, fever 38-39°C, multiple concerning symptoms, etc.)
- NORMAL: Standard monitoring and preventive care

Consider context: chronic conditions, medications, age, and vital sign trends. For elderly patients (>60), lower thresholds for WARNING level.`;
  }

  async analyzeHealthData(
    input: HealthInputDto,
  ): Promise<PredictionResponseDto> {
    const startTime = Date.now();

    try {
      // Validate input
      this.validateInput(input);

      // Build analysis prompt
      const prompt = this.buildAnalysisPrompt(input);

      this.logger.debug(
        `Processing health analysis for patient ${input.patientId}`,
      );

      // Call Gemini API
      const result = await this.model.generateContent(prompt);
      const responseText = String(result.response.text());

      // Parse and validate response
      const aiResponse = this.parseAIResponse(responseText);

      // Calculate processing time
      const processingTime = Date.now() - startTime;

      // Build final response
      const response: PredictionResponseDto = {
        patientId: input.patientId,
        disease: aiResponse.disease,
        confidence: aiResponse.confidence,
        probabilities: aiResponse.probabilities,
        alertLevel: aiResponse.alertLevel,
        recommendations: aiResponse.recommendations,
        processingTimeMs: processingTime,
        timeStamp: new Date().toISOString(),
      };

      this.logger.log(
        `Health analysis completed for patient ${input.patientId} - Alert Level: ${response.alertLevel}`,
      );

      return response;
    } catch (error) {
      this.logger.error(
        `Error analyzing health data for patient ${input.patientId}:`,
        error,
      );

      if (error instanceof BadRequestException) {
        throw error;
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      throw new HttpException(
        {
          message: 'Failed to analyze health data',
          error: errorMessage,
          patientId: input?.patientId || 'unknown',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private validateInput(input: HealthInputDto): void {
    if (!input) {
      throw new BadRequestException('Input data is required');
    }

    if (!input.patientId) {
      throw new BadRequestException('Patient ID is required');
    }

    if (!input.vitals || input.vitals.length === 0) {
      throw new BadRequestException('At least one set of vitals is required');
    }

    if (!input.symptoms || Object.keys(input.symptoms).length === 0) {
      throw new BadRequestException('At least one symptom entry is required');
    }

    if (!Number.isInteger(input.age) || input.age < 0 || input.age > 150) {
      throw new BadRequestException('Valid age is required (0-150)');
    }

    if (![0, 1].includes(input.gender)) {
      throw new BadRequestException(
        'Valid gender is required (0=Male, 1=Female)',
      );
    }
  }

  private buildAnalysisPrompt(input: HealthInputDto): string {
    const latestVitals = input.vitals[input.vitals.length - 1];

    const symptomsText = Object.entries(input.symptoms)
      .map(([symptom, severity]) => `- ${symptom}: ${severity}/10`)
      .sort((a, b) => {
        const severityA = parseInt(a.split(': ')[1]);
        const severityB = parseInt(b.split(': ')[1]);
        return severityB - severityA;
      })
      .join('\n');

    const chronicConditions =
      input.chronicConditions?.length > 0
        ? input.chronicConditions.join(', ')
        : 'None reported';

    const medicationList =
      input.medications?.length > 0
        ? input.medications.join(', ')
        : 'None reported';

    const vitalsTrend =
      input.vitals.length > 1
        ? `\n[TREND DATA: ${input.vitals.length} readings - can analyze trends over time]`
        : '';

    return `Analyze this patient's health data and provide comprehensive risk assessment:

PATIENT PROFILE:
- Age: ${input.age} years
- Gender: ${input.gender === 0 ? 'Male' : 'Female'}
- Chronic Conditions: ${chronicConditions}
- Current Medications: ${medicationList}
- Device ID: ${input.deviceId || 'N/A'}

LATEST VITAL SIGNS:
- Heart Rate: ${latestVitals.heartRate} bpm (normal: 60-100)
- Blood Pressure: ${latestVitals.bloodPressureSystolic}/${latestVitals.bloodPressureDiastolic} mmHg (normal: <120/80)
- SpO2: ${latestVitals.spo2}% (normal: >95%)
- Temperature: ${latestVitals.temperature}°C (normal: 36.1-37.2)
- Respiratory Rate: ${latestVitals.respiratoryRate} /min (normal: 12-20)
- Reading Time: ${latestVitals.timestamp}${vitalsTrend}

REPORTED SYMPTOMS (by severity):
${symptomsText}

Data Timestamp: ${input.timestamp}

ANALYSIS REQUIREMENTS:
1. Assess vital sign abnormalities against normal ranges
2. Evaluate symptom patterns and cumulative severity
3. Consider interactions with chronic conditions
4. Apply age-appropriate risk factors
5. Assess medication effectiveness and potential side effects
6. Identify any critical red flags requiring immediate attention
7. Provide 3 actionable, practical recommendations specific to this patient

Return ONLY valid JSON response, no markdown or additional text.`;
  }

  private parseAIResponse(responseText: string): PredictionResponseDto {
    try {
      // Remove markdown code blocks if present
      const cleanedText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const aiResponse = JSON.parse(cleanedText) as PredictionResponseDto;

      // Validate required fields
      const requiredFields = [
        'disease',
        'confidence',
        'alertLevel',
        'probabilities',
        'recommendations',
      ];

      for (const field of requiredFields) {
        if (!(field in aiResponse)) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Validate alert level
      const validAlertLevels = ['NORMAL', 'WARNING', 'CRITICAL'];
      if (!validAlertLevels.includes(aiResponse.alertLevel)) {
        this.logger.warn(
          `Invalid alert level "${aiResponse.alertLevel}", defaulting to NORMAL`,
        );
        aiResponse.alertLevel = 'NORMAL';
      }

      // Ensure confidence is within 0-1 range
      aiResponse.confidence = Math.max(
        0,
        Math.min(1, parseFloat(String(aiResponse.confidence))),
      );

      // Validate probabilities sum to approximately 1
      const probabilitiesSum = Object.values(aiResponse.probabilities).reduce(
        (sum, val: any) => sum + parseFloat(val),
        0,
      );

      if (Math.abs(probabilitiesSum - 1.0) > 0.01) {
        this.logger.warn(
          `Probabilities sum to ${probabilitiesSum}, normalizing...`,
        );
        // Normalize probabilities
        for (const key in aiResponse.probabilities) {
          aiResponse.probabilities[key] = parseFloat(
            String(
              parseFloat(String(aiResponse.probabilities[key])) /
                probabilitiesSum,
            ),
          );
        }
      }

      // Validate recommendations array
      if (
        !Array.isArray(aiResponse.recommendations) ||
        aiResponse.recommendations.length === 0
      ) {
        aiResponse.recommendations = ['Maintain regular check-ups'];
      }

      return aiResponse;
    } catch (error) {
      this.logger.error('Failed to parse AI response:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        {
          message: 'Invalid response format from AI model',
          details: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Helper method to determine if an alert should be triggered
  getAlertDetails(prediction: PredictionResponseDto): {
    shouldAlert: boolean;
    urgency: 'low' | 'medium' | 'high';
    message: string;
  } {
    const alertLevelMap = {
      NORMAL: { shouldAlert: false, urgency: 'low' as const },
      WARNING: { shouldAlert: true, urgency: 'medium' as const },
      CRITICAL: { shouldAlert: true, urgency: 'high' as const },
    };

    const config = alertLevelMap[prediction.alertLevel] || alertLevelMap.NORMAL;

    return {
      shouldAlert: config.shouldAlert,
      urgency: config.urgency,
      message: this.generateAlertMessage(prediction),
    };
  }

  private generateAlertMessage(prediction: PredictionResponseDto): string {
    const diseaseInfo =
      prediction.disease !== 'healthy'
        ? `Risk: ${prediction.disease} (${(prediction.confidence * 100).toFixed(1)}% confidence)`
        : 'Status: Healthy';

    return `[${prediction.alertLevel}] Patient ${prediction.patientId} - ${diseaseInfo}`;
  }
}
