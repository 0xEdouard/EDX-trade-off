import { NextResponse } from "next/server";
import { fetchTraderData, TraderInfo } from "../../lib/bybit-api";
import { getAllUsers } from "@/app/lib/db";
import { User } from "@/app/types/User";

let users: User[] = [];
let traders: TraderInfo[] = [];

if (process.env.NEXT_PHASE !== "PHASE_PRODUCTION_BUILD") {
  (async () => {
    try {
      const users_db = await getAllUsers();
      users = users_db;
      traders = users.map((user: User) => ({
        name: user.name,
        apiKey: user.api_key,
        apiSecret: user.api_secret,
      }));
    } catch (error) {
      console.error("Error initializing users and traders:", error);
    }
  })();
}

export async function GET() {
  try {
    const traderData = await Promise.all(traders.map(fetchTraderData));
    return NextResponse.json(traderData);
  } catch (error) {
    console.error("Error fetching trader data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
