import { Pool } from "pg";
import { User } from "../types/User";

const pool = new Pool({
  host: "127.0.0.1",
  port: 5432,
  database: "edx",
  user: "postgres",
  password: "eduroam",
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
