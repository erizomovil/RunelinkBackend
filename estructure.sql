CREATE TABLE IF NOT EXISTS Users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    photo TEXT,
    admin BOOLEAN DEFAULT FALSE
);

-- Table Groups
CREATE TABLE IF NOT EXISTS Groups (
    group_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    location VARCHAR(100),
    month INT,
    day INT
);

-- Table Characters
CREATE TABLE IF NOT EXISTS Characters (
    character_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    level INT,
    class VARCHAR(50),
    subclass VARCHAR(50),
    experience INT,
    health INT,
    speed INT,
    armor INT,
    broams INT,
    chips INT,
    rucks INT,
    frost INT,
    frags INT,
    photo TEXT,
    group_id INT REFERENCES Groups(group_id),
    user_id INT REFERENCES Users(user_id)
);

-- Table Items
CREATE TABLE IF NOT EXISTS Items (
    item_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    quantity INT,
    weight DECIMAL(10,2),
    character_id INT REFERENCES Characters(character_id)
);

-- Table Sessions
CREATE TABLE IF NOT EXISTS Sessions (
    session_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    date DATE,
    time TIME,
    host VARCHAR(100)
);

-- Table SessionUser (N:M relationship)
CREATE TABLE IF NOT EXISTS SessionUser (
    session_id INT REFERENCES Sessions(session_id),
    user_id INT REFERENCES Users(user_id),
    PRIMARY KEY (session_id, user_id)
);

-- Table Settings
CREATE TABLE IF NOT EXISTS Settings (
    setting_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id)
);
