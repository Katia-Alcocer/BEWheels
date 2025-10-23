import { pool } from '../src/config/db.config.js';

async function test() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Resultado:', res.rows);
    await pool.end();
  } catch (err) {
    console.error('Error al conectar o ejecutar query:', err);
    process.exit(1);
  }
}

test();
