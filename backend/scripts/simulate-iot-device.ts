import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({
  path: "../.env"
});

const USER_ID = '0849a9f5-4409-4c62-9444-cbb351df62a6';

function getDatabaseConfig() {
  // Check if DATABASE_URL is provided
  if (process.env.DATABASE_URL) {
    const databaseUrl = process.env.DATABASE_URL;
    const isLocal = databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1');
    
    return {
      connectionString: databaseUrl,
      ssl: isLocal ? false : { rejectUnauthorized: false },
    };
  }
  
  // Otherwise use individual parameters
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432;
  const user = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_DATABASE;
  
  if (!host || !user || !database) {
    throw new Error(
      'Missing database configuration. Provide either DATABASE_URL or DB_HOST, DB_USERNAME, DB_DATABASE'
    );
  }
  
  const isLocal = host === 'localhost' || host === '127.0.0.1';
  
  return {
    host,
    port,
    user,
    password: password || undefined,
    database,
    ssl: isLocal ? false : { rejectUnauthorized: false },
  };
}

const dbConfig = getDatabaseConfig()
  const client = new Client({
    ...dbConfig,
    connectionTimeoutMillis: 30000,
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
      [reading.user_id, reading.timestamp, reading.heart_rate, reading.systolic_bp, reading.diastolic_bp, reading.spo2, reading.temperature, reading.steps]
    );
    
    console.log(`Sent: HR=${reading.heart_rate}, BP=${reading.systolic_bp}/${reading.diastolic_bp}, SpO2=${reading.spo2}%`);
  }, 5000);
}

stream();