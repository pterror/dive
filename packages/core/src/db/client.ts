import Database from 'better-sqlite3';
import path from 'path';

// TODO: Make this configurable via env
const DB_PATH = path.join(process.cwd(), 'dive.db');

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!dbInstance) {
    dbInstance = new Database(DB_PATH);
    dbInstance.pragma('journal_mode = WAL');
  }
  return dbInstance;
}

export function initDb() {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS objects (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      content JSON,
      created_at INTEGER DEFAULT (unixepoch()),
      updated_at INTEGER DEFAULT (unixepoch())
    );
    
    CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      color TEXT
    );

    CREATE TABLE IF NOT EXISTS object_tags (
      object_id TEXT NOT NULL,
      tag_id TEXT NOT NULL,
      PRIMARY KEY (object_id, tag_id),
      FOREIGN KEY (object_id) REFERENCES objects(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );
  `);
}
