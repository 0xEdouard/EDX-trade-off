import { RestClientV5 } from "bybit-api";
import {
  getAllUsers,
  addWalletBalanceHistory,
  closePool,
} from "../lib/db";

async function fetchUserBalance(
  apiKey: string,
  apiSecret: string
): Promise<number> {
  const client = new RestClientV5({
    key: apiKey,
    secret: apiSecret,
  });

  const response = await client.getWalletBalance({ accountType: "UNIFIED" });
  return parseFloat(response.result.list[0].totalEquity);
}

async function updateBalances() {
  try {
    const users = await getAllUsers();
    const currentDate = new Date();

    for (const user of users) {
      const apiKey = user.api_key;
      const apiSecret = user.api_secret;

      if (apiKey && apiSecret) {
        const balance = await fetchUserBalance(apiKey, apiSecret);
        await addWalletBalanceHistory(user.id, balance, currentDate);
        console.log(`Updated balance for ${user.name}: $${balance}`);
      } else {
        console.log(`Skipping ${user.name}: API key or secret not found`);
      }
    }

    console.log("Balances updated successfully");
  } catch (error) {
    console.error("Error updating balances:", error);
  } finally {
    await closePool();
  }
}

updateBalances();
