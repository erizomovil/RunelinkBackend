const { Pool } = require('pg');
require('dotenv').config();
const fs = require('fs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    ca: fs.readFileSync('./ca.pem').toString(), // ruta al certificado Aiven
  },
});

module.exports = pool;