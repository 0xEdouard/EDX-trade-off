import { Pool } from "pg";
import { User } from "../types/User";

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_SSL,
} = process.env;

const missingEnvVars = [
  ["DATABASE_HOST", DATABASE_HOST],
  ["DATABASE_PORT", DATABASE_PORT],
  ["DATABASE_NAME", DATABASE_NAME],
  ["DATABASE_USER", DATABASE_USER],
  ["DATABASE_PASSWORD", DATABASE_PASSWORD],
].filter(([, value]) => !value);

if (missingEnvVars.length > 0) {
  const keys = missingEnvVars.map(([key]) => key).join(", ");
  throw new Error(`Database configuration error: missing environment variables (${keys}).`);
}

const pool = new Pool({
  host: DATABASE_HOST,
  port: Number(DATABASE_PORT),
  database: DATABASE_NAME,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  ssl: DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  allowExitOnIdle: true,
});

export const getAllUsers = async (): Promise<User[]> => {
  const result = await pool.query('SELECT * FROM "User";');
  return result.rows;
};

export const getUserById = async (id: string): Promise<User | null> => {
  const result = await pool.query('SELECT * FROM "User" WHERE id = $1;', [id]);
  return result.rows[0] || null;
};

export const getWalletBalanceHistoryByUserId = async (
  userId: string
): Promise<any[]> => {
  const result = await pool.query(
    `SELECT * FROM Balenciaga
     WHERE user_id = $1
     ORDER BY timestamp ASC;`,
    [userId]
  );
  return result.rows;
};

export const addWalletBalanceHistory = async (
  userId: string,
  balance: number,
  timestamp: Date
): Promise<void> => {
  await pool.query(
    `INSERT INTO balenciaga (user_id, balance, timestamp)
     VALUES ($1, $2, $3);`,
    [userId, balance, timestamp]
  );
};

export const closePool = async () => {
  await pool.end();
};
