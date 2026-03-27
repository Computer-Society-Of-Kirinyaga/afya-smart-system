import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({
  path: "../.env"
});

const USER_ID =
  process.env.SEED_USER_ID ||
  '7d576c5f-c5f2-44b8-bcb0-cb50f4e29bb6';

const TOTAL_READINGS = Number(process.env.SEED_TOTAL || 100);
const DAYS_BACK = Number(process.env.SEED_DAYS_BACK || 7);
const DELAY_MS = Number(process.env.SEED_DELAY_MS || 1000);


function getDatabaseConfig() {
  // Check if DATABASE_URL is provided
  // if (process.env.DATABASE_URL) {
  //   const databaseUrl = process.env.DATABASE_URL;
  //   const isLocal = databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1');
    
  //   return {
  //     connectionString: databaseUrl,
  //     ssl: isLocal ? false : { rejectUnauthorized: false },
  //   };
  // }
  
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


function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateHealthReading(timestamp: Date) {
  let heart_rate = 60 + Math.random() * 40; // 60-100 bpm
  let systolic_bp = 100 + Math.random() * 20; // 100-120 mmHg
  let diastolic_bp = 60 + Math.random() * 20; // 60-80 mmHg
  let spo2 = 95 + Math.random() * 4; // 95-99%
  let temperature = 36.5 + Math.random() * 0.7; // 36.5-37.2°C
  const steps = Math.floor(Math.random() * 500); // 0-500 steps per reading
  let sleep_hours: number | null = null;

  if (Math.random() < 0.1) {
    heart_rate = 110 + Math.random() * 40; // 110-150 bpm
    systolic_bp = 130 + Math.random() * 20; // 130-150 mmHg
    diastolic_bp = 85 + Math.random() * 15; // 85-100 mmHg
    spo2 = 88 + Math.random() * 6; // 88-94%
    temperature = 37.5 + Math.random() * 1; // 37.5-38.5°C
  }

  if (Math.random() < 0.05) {
    heart_rate = 150 + Math.random() * 30; // 150-180 bpm
    systolic_bp = 150 + Math.random() * 20; // 150-170 mmHg
    spo2 = 85 + Math.random() * 5; // 85-90%
    temperature = 38.5 + Math.random() * 1; // 38.5-39.5°C
  }

  const hour = timestamp.getHours();
  if (hour >= 22 || hour <= 6) {
    sleep_hours = 1 + Math.random() * 2; // 1-3 hours per segment
  }

  return {
    user_id: USER_ID,
    timestamp: timestamp.toISOString(),
    heart_rate: Math.round(heart_rate),
    systolic_bp: Math.round(systolic_bp),
    diastolic_bp: Math.round(diastolic_bp),
    spo2: Math.round(spo2),
    temperature: Number(temperature.toFixed(1)),
    steps,
    sleep_hours,
  };
}

async function seedHealthData() {
   const dbConfig = getDatabaseConfig();
  
  console.log('📡 Connecting to database...');
  
  // Create client with appropriate config
  const client = new Client({
    ...dbConfig,
    connectionTimeoutMillis: 30000,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    const userCheck = await client.query(
      'SELECT id FROM users WHERE id = $1',
      [USER_ID],
    );

    if (userCheck.rows.length === 0) {
      console.error(`User with ID ${USER_ID} not found!`);
      console.log('\nCreate a user first, for example:');
      console.log(
        `INSERT INTO users (id, name, phone_number, consent_given)\nVALUES ('${USER_ID}', 'Test User', '0799431541', true);`,
      );
      return;
    }

    console.log(
      `Streaming ${TOTAL_READINGS} health readings for user: ${USER_ID}`,
    );

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - DAYS_BACK);
    const intervalMs = (DAYS_BACK * 24 * 60 * 60 * 1000) / TOTAL_READINGS;

    let insertedCount = 0;

    for (let i = 0; i < TOTAL_READINGS; i++) {
      const timestamp = new Date(startDate.getTime() + i * intervalMs);
      const reading = generateHealthReading(timestamp);

      try {
        await client.query(
          `INSERT INTO health_readings
           (user_id, timestamp, heart_rate, systolic_bp, diastolic_bp, spo2, temperature, steps, sleep_hours)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            reading.user_id,
            reading.timestamp,
            reading.heart_rate,
            reading.systolic_bp,
            reading.diastolic_bp,
            reading.spo2,
            reading.temperature,
            reading.steps,
            reading.sleep_hours,
          ],
        );
        insertedCount++;

        if (insertedCount % 20 === 0 || insertedCount === TOTAL_READINGS) {
          console.log(
            `Inserted ${insertedCount}/${TOTAL_READINGS} readings...`,
          );
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('Error inserting reading:', message);
      }

      await sleep(DELAY_MS);
    }

    console.log(`\nnserted ${insertedCount} health readings.`);

    const summary = await client.query(
      `SELECT
         COUNT(*) as total_readings,
         MIN(timestamp) as first_reading,
         MAX(timestamp) as last_reading,
         AVG(heart_rate) as avg_heart_rate,
         AVG(spo2) as avg_spo2
       FROM health_readings
       WHERE user_id = $1`,
      [USER_ID],
    );

    const row = summary.rows[0];
    console.log('\nSummary:');
    console.log(`  Total readings: ${row.total_readings}`);
    console.log(
      `  Date range: ${new Date(row.first_reading).toLocaleDateString()} - ${new Date(row.last_reading).toLocaleDateString()}`,
    );
    console.log(`  Avg heart rate: ${Math.round(row.avg_heart_rate)} bpm`);
    console.log(`  Avg SpO2: ${Math.round(row.avg_spo2)}%`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error:', message);
  } finally {
    await client.end();
  }
}

seedHealthData();
