const Database = require ("better-sqlite3");
const path = require ("path");

const db = new Database(path.join(__dirname, "pedidos.db"));

db.exec(`
    CREATE TABLE IF NOT EXISTS prayers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    prayer TEXT NOT NULL,
    date TEXT NOT NULL
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL
        )
`);

module.exports = db;