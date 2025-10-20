const fs = require("fs");
const { Pool } = require('pg');

const caPath = "./ca.pem"; 
console.log("📜 Leyendo certificado de:", caPath);
console.log("Certificado (primeras 100 chars):", fs.readFileSync(caPath).toString().slice(0, 100));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    ca: fs.readFileSync(caPath).toString(),
  },
});

module.exports = pool;