import { NextResponse } from 'next/server'
import { fetchTraderData, TraderInfo } from '../../lib/bybit-api'

const traders: TraderInfo[] = [
  { name: 'DIESEL', apiKey: process.env.DIESEL_API_KEY!, apiSecret: process.env.DIESEL_API_SECRET! },
  { name: 'EDUARDO', apiKey: process.env.EDUARDO_API_KEY!, apiSecret: process.env.EDUARDO_API_SECRET! },
  { name: 'VANPA', apiKey: process.env.VANPA_API_KEY!, apiSecret: process.env.VANPA_API_SECRET! },
].filter(trader => trader.apiKey && trader.apiSecret);

export async function GET() {
  try {
    const traderData = await Promise.all(traders.map(fetchTraderData))
    return NextResponse.json(traderData)
  } catch (error) {
    console.error('Error fetching trader data:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
