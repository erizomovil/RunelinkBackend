const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());


// --- RUTA DE PRUEBA ---
app.get('/', (req, res) => {
  res.send('Esto es runelink!!');
});

// --- USERS ---
app.post('/users', async (req, res) => {
  const { name, email, photo, admin } = req.body;

  try {
    // 1️⃣ Verificar si el usuario ya existe
    const existingUser = await pool.query(
      'SELECT * FROM Users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      // 2️⃣ Si existe, devolverlo directamente
      return res.json(existingUser.rows[0]);
    }

    // 3️⃣ Si no existe, insertarlo
    const result = await pool.query(
      'INSERT INTO Users (name, email, photo, admin) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, photo, admin || false]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).send('Error inserting or fetching user');
  }
});

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching users');
  }
});

// --- GROUPS ---
app.post('/groups', async (req, res) => {
  const { name, location, month, day } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Groups (name, location, month, day) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, location, month, day]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating group');
  }
});

app.get('/groups', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Groups');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching groups');
  }
});

// --- CHARACTERS ---
app.post('/characters', async (req, res) => {
  const {
    name,
    level,
    class: charClass,
    subclass,
    experience,
    health,
    speed,
    armor,
    broams,
    chips,
    rucks,
    frost,
    frags,
    photo,
    group_id,
    user_id
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO Characters
      (name, level, class, subclass, experience, health, speed, armor, broams, chips, rucks, frost, frags, photo, group_id, user_id)
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
      RETURNING *`,
      [name, level, charClass, subclass, experience, health, speed, armor, broams, chips, rucks, frost, frags, photo, group_id, user_id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error creating character:", err);
    res.status(500).send('Error creating character');
  }
});

app.get('/characters/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM Characters WHERE user_id = $1',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching characters by user');
  }
});

app.put('/characters/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name,
    level,
    class: charClass,
    subclass,
    experience,
    health,
    speed,
    armor,
    broams,
    chips,
    rucks,
    frost,
    frags,
    photo,
    group_id,
    user_id
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE Characters
       SET name = $1,
           level = $2,
           class = $3,
           subclass = $4,
           experience = $5,
           health = $6,
           speed = $7,
           armor = $8,
           broams = $9,
           chips = $10,
           rucks = $11,
           frost = $12,
           frags = $13,
           photo = $14,
           group_id = $15,
           user_id = $16
       WHERE character_id = $17
       RETURNING *`,
      [
        name,
        level,
        charClass,
        subclass,
        experience,
        health,
        speed,
        armor,
        broams,
        chips,
        rucks,
        frost,
        frags,
        photo,
        group_id,
        user_id,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Character not found');
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating character:", err);
    res.status(500).send('Error updating character');
  }
});

app.get('/characters/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM Characters WHERE character_id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Character not found');
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching character by id:', err);
    res.status(500).send('Error fetching character');
  }
});

app.get('/characters', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Characters');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching characters');
  }
});

// --- INVENTORY / ITEMS ---

// Obtener todos los items de un personaje
app.get('/characters/:characterId/items', async (req, res) => {
  const { characterId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM Items WHERE character_id = $1 ORDER BY item_id DESC',
      [characterId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching character items:", err);
    res.status(500).send('Error fetching character items');
  }
});

// Añadir un nuevo item al personaje
app.post('/characters/:characterId/items', async (req, res) => {
  const { characterId } = req.params;
  const { name, quantity, weight } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Items (name, quantity, weight, character_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, quantity, weight, characterId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error creating item:", err);
    res.status(500).send('Error creating item');
  }
});

// Actualizar un item existente
app.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { name, quantity, weight } = req.body;
  try {
    const result = await pool.query(
      'UPDATE Items SET name = $1, quantity = $2, weight = $3 WHERE item_id = $4 RETURNING *',
      [name, quantity, weight, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating item:", err);
    res.status(500).send('Error updating item');
  }
});

// Eliminar un item
app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Items WHERE item_id = $1', [id]);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).send('Error deleting item');
  }
});


// --- SESSIONS ---
app.post('/sessions', async (req, res) => {
  const { name, date, time, host } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Sessions (name, date, time, host) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, date, time, host]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating session');
  }
});

app.get('/sessions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Sessions');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching sessions');
  }
});

// --- SESSIONUSER ---
app.post('/sessionuser', async (req, res) => {
  const { session_id, user_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO SessionUser (session_id, user_id) VALUES ($1,$2) RETURNING *',
      [session_id, user_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating session-user relation');
  }
});

app.get('/sessionuser', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM SessionUser');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching session-user relations');
  }
});

// --- SETTINGS ---
app.post('/settings', async (req, res) => {
  const { user_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Settings (user_id) VALUES ($1) RETURNING *',
      [user_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating settings');
  }
});

app.get('/settings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Settings');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching settings');
  }
});

// --- INICIAR SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
