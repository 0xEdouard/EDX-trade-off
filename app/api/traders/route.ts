import { NextResponse } from 'next/server'
import { fetchTraderData, TraderInfo } from '../../lib/bybit-api'
import { addWalletBalanceHistory, getAllUsers } from '@/app/database/db';


let users: User[] = [];
let traders: TraderInfo[] = [];

await getAllUsers().then((users_db: User[]) => {
  users = users_db;
  traders = users.map((user: User) => ({
    name: user.name,
    apiKey: user.api_key,
    apiSecret: user.api_secret
  }));
});

export async function GET() {
  try {
    const traderData = await Promise.all(traders.map(fetchTraderData));
    console.log(traderData);
    const timestamp = Date.now();
    users.map(async (user: User) => {
      const balance = traderData.find(data => data.name == user.name)?.amount;
      const responseDB = await addWalletBalanceHistory(user.id, balance!, new Date(timestamp))
    })
    return NextResponse.json(traderData)
  } catch (error) {
    console.error('Error fetching trader data:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
