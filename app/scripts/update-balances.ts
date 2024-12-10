import { Pool } from 'pg'
import { RestClientV5 } from 'bybit-api'

const pool = new Pool({
    user: "postgres",
    host: "51.20.135.233",
    database: "edx",
    password: "eduroam",
    port: 5432
});

async function getAllUsers(): Promise<User[]> {
  const result = await pool.query('SELECT * FROM "user";')
  return result.rows
}

async function addWalletBalanceHistory(userId: string, balance: number, timestamp: Date): Promise<void> {
  await pool.query(
    `INSERT INTO balenciaga (user_id, balance, timestamp)
     VALUES ($1, $2, $3);`,
    [userId, balance, timestamp]
  )
}

async function fetchUserBalance(apiKey: string, apiSecret: string): Promise<number> {
  const client = new RestClientV5({
    key: apiKey,
    secret: apiSecret,
  })

  const response = await client.getWalletBalance({ accountType: 'UNIFIED' })
  return parseFloat(response.result.list[0].totalEquity)
}

async function updateBalances() {
  try {
    const users = await getAllUsers()
    const currentDate = new Date()
    
    for (const user of users) {
      const apiKey = user.api_key
      const apiSecret = user.api_secret
      
      if (apiKey && apiSecret) {
        const balance = await fetchUserBalance(apiKey, apiSecret)
        await addWalletBalanceHistory(user.id, balance, currentDate)
        console.log(`Updated balance for ${user.name}: $${balance}`)
      } else {
        console.log(`Skipping ${user.name}: API key or secret not found`)
      }
    }

    console.log('Balances updated successfully')
  } catch (error) {
    console.error('Error updating balances:', error)
  } finally {
    await pool.end()
  }
}

updateBalances()