import { Pool } from "pg";
import { User } from "../types/User";

type EnvKey =
  | "DATABASE_HOST"
  | "DATABASE_PORT"
  | "DATABASE_NAME"
  | "DATABASE_USER"
  | "DATABASE_PASSWORD";

const REQUIRED_ENV_KEYS: EnvKey[] = [
  "DATABASE_HOST",
  "DATABASE_PORT",
  "DATABASE_NAME",
  "DATABASE_USER",
  "DATABASE_PASSWORD",
];

let pool: Pool | null = null;

const resolveMissingEnvVars = () =>
  REQUIRED_ENV_KEYS.filter((key) => !process.env[key]);

const createPool = () => {
  const missingEnvVars = resolveMissingEnvVars();

  if (missingEnvVars.length > 0) {
    const keys = missingEnvVars.join(", ");
    throw new Error(
      `Database configuration error: missing environment variables (${keys}).`,
    );
  }

  const sslEnabled = process.env.DATABASE_SSL === "true";

  pool = new Pool({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    ssl: sslEnabled ? { rejectUnauthorized: false } : undefined,
    allowExitOnIdle: true,
  });

  return pool;
};

const getPool = () => {
  return pool ?? createPool();
};

export const getAllUsers = async (): Promise<User[]> => {
  const client = getPool();
  const result = await client.query('SELECT * FROM "User";');
  return result.rows;
};

export const getUserById = async (id: string): Promise<User | null> => {
  const client = getPool();
  const result = await client.query('SELECT * FROM "User" WHERE id = $1;', [
    id,
  ]);
  return result.rows[0] || null;
};

export const getWalletBalanceHistoryByUserId = async (
  userId: string
): Promise<any[]> => {
  const client = getPool();
  const result = await client.query(
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
  const client = getPool();
  await client.query(
    `INSERT INTO balenciaga (user_id, balance, timestamp)
     VALUES ($1, $2, $3);`,
    [userId, balance, timestamp]
  );
};

export const closePool = async () => {
  if (pool) {
    await pool.end();
    pool = null;
  }
};

export const hasDatabaseConfiguration = () =>
  resolveMissingEnvVars().length === 0;
