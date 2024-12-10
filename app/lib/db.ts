import { Pool } from "pg";

const pool = new Pool({
    user: "postgres",
    host: "51.20.135.233",
    database: "edx",
    password: "eduroam",
    port: 5432
});

// DAO Functions

export const getAllUsers = async (): Promise<User[]> => {
  const result = await pool.query("SELECT * FROM \"user\";");
  return result.rows;
};

export const getUserById = async (id: string): Promise<User | null> => {
  const result = await pool.query("SELECT * FROM \"user\" WHERE id = $1;", [id]);
  return result.rows[0] || null;
};

export const getWalletBalanceHistoryByUserId = async (userId: string): Promise<any[]> => {
  const result = await pool.query(
    `SELECT * FROM balenciaga
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

