import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

console.log("URL de conexión:", process.env.DATABASE_URL);

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, 
});


