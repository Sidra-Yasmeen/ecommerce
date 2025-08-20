import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../services/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const sql = fs.readFileSync(path.join(__dirname, '../../db/init.sql'), 'utf8');
  const statements = sql.split(/;\s*$/m).filter(Boolean);
  for (const stmt of statements) {
    if (stmt.trim()) {
      await db.query(stmt);
    }
  }
  console.log('Database seeded.');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
