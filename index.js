const express = require('express');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

// --- RUTA DE PRUEBA ---
app.get('/', (req, res) => {
  res.send('Esto es runelink!!');
});

// --- USUARIOS ---
// Crear un usuario
app.post('/usuarios', async (req, res) => {
  const { nombre, email, foto, admin } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Usuarios (nombre, email, foto, admin) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, email, foto, admin || false]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error insertando usuario');
  }
});

// Listar usuarios
app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Usuarios');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error obteniendo usuarios');
  }
});

// --- GRUPOS ---
app.post('/grupos', async (req, res) => {
  const { nombre, localizacion, mes, dia } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Grupos (nombre, localizacion, mes, dia) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, localizacion, mes, dia]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creando grupo');
  }
});

app.get('/grupos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Grupos');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error obteniendo grupos');
  }
});

// --- PERSONAJES ---
app.post('/personajes', async (req, res) => {
  const {
    nombre, nivel, clase, subclase, experiencia, vida, velocidad,
    armadura, broams, chips, rucks, frost, frags, foto, id_grupo, id_usuario
  } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO Personajes
      (nombre, nivel, clase, subclase, experiencia, vida, velocidad, armadura, broams, chips, rucks, frost, frags, foto, id_grupo, id_usuario)
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
      [nombre, nivel, clase, subclase, experiencia, vida, velocidad, armadura, broams, chips, rucks, frost, frags, foto, id_grupo, id_usuario]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creando personaje');
  }
});

app.get('/personajes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Personajes');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error obteniendo personajes');
  }
});

// --- ITEMS ---
app.post('/items', async (req, res) => {
  const { nombre, cantidad, peso, id_personaje } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Items (nombre, cantidad, peso, id_personaje) VALUES ($1,$2,$3,$4) RETURNING *',
      [nombre, cantidad, peso, id_personaje]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creando item');
  }
});

app.get('/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Items');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error obteniendo items');
  }
});

// --- SESIONES ---
app.post('/sesiones', async (req, res) => {
  const { nombre, fecha, hora, host } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Sesiones (nombre, fecha, hora, host) VALUES ($1,$2,$3,$4) RETURNING *',
      [nombre, fecha, hora, host]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creando sesión');
  }
});

app.get('/sesiones', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Sesiones');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error obteniendo sesiones');
  }
});

// --- SESSIONUSUARIO (relación N:M) ---
app.post('/sessionusuario', async (req, res) => {
  const { id_sesion, id_usuario } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO SessionUsuario (id_sesion, id_usuario) VALUES ($1,$2) RETURNING *',
      [id_sesion, id_usuario]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creando relación sesión-usuario');
  }
});

app.get('/sessionusuario', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM SessionUsuario');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error obteniendo relaciones sesión-usuario');
  }
});

// --- AJUSTES ---
app.post('/ajustes', async (req, res) => {
  const { id_usuario } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Ajustes (id_usuario) VALUES ($1) RETURNING *',
      [id_usuario]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creando ajustes');
  }
});

app.get('/ajustes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Ajustes');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error obteniendo ajustes');
  }
});

// --- INICIAR SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
