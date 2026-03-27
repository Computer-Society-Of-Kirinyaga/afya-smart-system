import { IsString, IsNumber, Min, Max } from 'class-validator';
import { HealthReading } from 'src/health-readings/entities/health-reading.entity';

// export class VitalSignDto {
//   @IsNumber()
//   @Min(30)
//   @Max(200)
//   heartRate: number;

//   @IsNumber()
//   @Min(80)
//   @Max(100)
//   spo2: number;

//   @IsNumber()
//   @Min(35)
//   @Max(42)
//   temperature: number;

//   @IsNumber()
//   @Min(80)
//   @Max(250)
//   bloodPressureSystolic: number;

//   @IsNumber()
//   @Min(40)
//   @Max(150)
//   bloodPressureDiastolic: number;

//   @IsNumber()
//   @Min(8)
//   @Max(30)
//   respiratoryRate: number;

//   @IsString()
//   timestamp: string;
// }

export class HealthInputDto {
  readings: Array<{
    timestamp: Date;
    heart_rate: number;
    systolic_bp: number;
    diastolic_bp: number;
    spo2: number;
    temperature: number;
  }>;

  averages: {
    heart_rate: number;
    spo2: number;
    temperature: number;
  };

  medications: string[];
  chronicConditions: string[];
  age?: number;
  gender?: number;
}
