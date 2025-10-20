const fs = require("fs");
const { Pool } = require('pg');

const caPath = "/etc/secrets/ca.pem"; // 👈 o "./ca.pem" según tu caso
console.log("📜 Leyendo certificado de:", caPath);
console.log("Certificado (primeras 100 chars):", fs.readFileSync(caPath).toString().slice(0, 100));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    ca: fs.readFileSync(caPath).toString(),
  },
});

module.exports = pool;