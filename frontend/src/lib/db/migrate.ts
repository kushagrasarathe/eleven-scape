import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is not set in the environment variables');
  process.exit(1);
}

const sql = neon(databaseUrl);
const db = drizzle(sql);

async function main() {
  console.log('Running migrations');
  await migrate(db, { migrationsFolder: 'migrations' });
  console.log('Migrations complete');
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration failed');
  console.error(err);
  process.exit(1);
});
