#!/usr/bin/env bun
/**
 * Test Drizzle Database Connection
 * 
 * This script verifies that:
 * 1. Database connection works
 * 2. All tables exist
 * 3. Drizzle ORM is properly configured
 */

import { db } from "../src/db";
import { user, session, account, verification, oauthApplication, oauthAccessToken, oauthConsent } from "../src/db/schema";
import { sql } from "drizzle-orm";

async function testConnection() {
  console.log("🔍 Testing Drizzle Database Connection...\n");

  try {
    // Test 1: Basic connection
    console.log("1️⃣  Testing database connection...");
    const result = await db.execute(sql`SELECT 1 as test`);
    console.log("   ✅ Database connection successful\n");

    // Test 2: Check tables exist
    console.log("2️⃣  Checking tables...");
    const tables = [
      { name: "user", schema: user },
      { name: "session", schema: session },
      { name: "account", schema: account },
      { name: "verification", schema: verification },
      { name: "oauthApplication", schema: oauthApplication },
      { name: "oauthAccessToken", schema: oauthAccessToken },
      { name: "oauthConsent", schema: oauthConsent },
    ];

    for (const table of tables) {
      try {
        await db.select().from(table.schema).limit(1);
        console.log(`   ✅ ${table.name} table exists`);
      } catch (error) {
        console.log(`   ❌ ${table.name} table missing`);
        throw error;
      }
    }

    console.log("\n3️⃣  Checking table counts...");
    const userCount = await db.select().from(user);
    const sessionCount = await db.select().from(session);
    const accountCount = await db.select().from(account);
    
    console.log(`   📊 Users: ${userCount.length}`);
    console.log(`   📊 Sessions: ${sessionCount.length}`);
    console.log(`   📊 Accounts: ${accountCount.length}`);

    console.log("\n✨ All tests passed!");
    console.log("🎉 Drizzle ORM is properly configured and connected to Neon PostgreSQL\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Database test failed:");
    console.error(error);
    process.exit(1);
  }
}

testConnection();
