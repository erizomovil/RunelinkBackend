require('dotenv').config();
const pool = require('./db');
const fs = require('fs');

const sql = fs.readFileSync('estructure.sql', 'utf-8');

(async () => {
  try {
    await pool.query(sql);
    console.log('Base de datos creada correctamente ✅');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
