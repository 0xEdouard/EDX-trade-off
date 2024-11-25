import { RestClientV5 } from "bybit-api";

export interface TraderInfo {
  name: string;
  apiKey: string;
  apiSecret: string;
}

export interface TraderData {
  name: string;
  amount: number;
  percentage: number;
}

const INITIAL_AMOUNT = 500;

export async function fetchTraderData(trader: TraderInfo): Promise<TraderData> {
  const client = new RestClientV5({
    key: trader.apiKey,
    secret: trader.apiSecret,
  });

  try {
    const response = await client.getWalletBalance({
      accountType: 'UNIFIED'
    });

    const totalEquity = parseFloat(response.result.list[0].totalEquity);
    const percentage = ((totalEquity - INITIAL_AMOUNT) / INITIAL_AMOUNT) * 100;

    return {
      name: trader.name,
      amount: totalEquity,
      percentage: parseFloat(percentage.toFixed(2)),
    };
  } catch (error) {
    console.error(`Error fetching data for ${trader.name}:`, error);
    return {
      name: trader.name,
      amount: 0,
      percentage: 0,
    };
  }
}
