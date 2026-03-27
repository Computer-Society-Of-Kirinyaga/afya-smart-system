import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({
  path: '../.env',
});

const USER_ID = 'b032e3a1-61f9-4b80-ae8a-3e217e27625e';

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

async function stream() {
  await client.connect();
  console.log('Streaming data every 5 seconds...');

  setInterval(async () => {
    const reading = {
      user_id: USER_ID,
      timestamp: new Date(),
      heart_rate: 60 + Math.floor(Math.random() * 40),
      systolic_bp: 110 + Math.floor(Math.random() * 20),
      diastolic_bp: 70 + Math.floor(Math.random() * 15),
      spo2: 95 + Math.floor(Math.random() * 5),
      temperature: 36.5 + Math.random() * 0.7,
      steps: Math.floor(Math.random() * 100),
    };

    await client.query(
      `INSERT INTO health_readings (user_id, timestamp, heart_rate, systolic_bp, diastolic_bp, spo2, temperature, steps)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        reading.user_id,
        reading.timestamp,
        reading.heart_rate,
        reading.systolic_bp,
        reading.diastolic_bp,
        reading.spo2,
        reading.temperature,
        reading.steps,
      ],
    );

    console.log(
      `Sent: HR=${reading.heart_rate}, BP=${reading.systolic_bp}/${reading.diastolic_bp}, SpO2=${reading.spo2}%`,
    );
  }, 5000);
}

stream();
