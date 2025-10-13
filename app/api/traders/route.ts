import { NextResponse } from "next/server";
import { fetchTraderData, type TraderInfo } from "@/app/lib/bybit-api";
import {
  getAllUsers,
  hasDatabaseConfiguration,
} from "@/app/lib/db";
import { User } from "@/app/types/User";

const REQUIRED_DB_ENV = [
  "DATABASE_HOST",
  "DATABASE_PORT",
  "DATABASE_NAME",
  "DATABASE_USER",
  "DATABASE_PASSWORD",
] as const;

const phase = process.env.NEXT_PHASE;

const toTraderInfo = (user: User): TraderInfo => ({
  name: user.name,
  apiKey: user.api_key,
  apiSecret: user.api_secret,
});

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!hasDatabaseConfiguration()) {
      const missing = REQUIRED_DB_ENV.filter((key) => !process.env[key]);

      if (phase === "phase-production-build") {
        console.warn(
          `Skipping trader fetch during build: missing env vars (${missing.join(
            ", ",
          )}).`,
        );
        return NextResponse.json([]);
      }

      console.error(
        `Trader API misconfiguration: missing env vars (${missing.join(", ")}).`,
      );
      return NextResponse.json(
        { error: "Database configuration incomplete." },
        { status: 500 },
      );
    }

    const users = await getAllUsers();

    const traders = users
      .filter((user) => user.api_key && user.api_secret)
      .map(toTraderInfo);

    if (traders.length === 0) {
      return NextResponse.json([]);
    }

    const traderData = await Promise.all(traders.map(fetchTraderData));
    return NextResponse.json(traderData);
  } catch (error) {
    console.error("Error fetching trader data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
