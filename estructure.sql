-- Tabla Usuarios
CREATE TABLE IF NOT EXISTS Usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    foto TEXT,
    admin BOOLEAN DEFAULT FALSE
);

-- Tabla Grupos
CREATE TABLE IF NOT EXISTS Grupos (
    id_grupo SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    localizacion VARCHAR(100),
    mes INT,
    dia INT
);

-- Tabla Personajes
CREATE TABLE IF NOT EXISTS Personajes (
    id_personaje SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    nivel INT,
    clase VARCHAR(50),
    subclase VARCHAR(50),
    experiencia INT,
    vida INT,
    velocidad INT,
    armadura INT,
    broams INT,
    chips INT,
    rucks INT,
    frost INT,
    frags INT,
    foto TEXT,
    id_grupo INT REFERENCES Grupos(id_grupo),
    id_usuario INT REFERENCES Usuarios(id_usuario)
);

-- Tabla Items
CREATE TABLE IF NOT EXISTS Items (
    id_item SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    cantidad INT,
    peso DECIMAL(10,2),
    id_personaje INT REFERENCES Personajes(id_personaje)
);

-- Tabla Sesiones
CREATE TABLE IF NOT EXISTS Sesiones (
    id_sesion SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    fecha DATE,
    hora TIME,
    host VARCHAR(100)
);

-- Tabla SessionUsuario (relación N:M)
CREATE TABLE IF NOT EXISTS SessionUsuario (
    id_sesion INT REFERENCES Sesiones(id_sesion),
    id_usuario INT REFERENCES Usuarios(id_usuario),
    PRIMARY KEY (id_sesion, id_usuario)
);

-- Tabla Ajustes
CREATE TABLE IF NOT EXISTS Ajustes (
    id_ajuste SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES Usuarios(id_usuario)
);
