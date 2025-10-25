import { auth } from "@/lib/auth";
import { setSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Para Login Endpoint
 * 
 * This endpoint creates a Better Auth session after successful Para authentication.
 * It's called from the client after Para wallet connection is established.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, walletAddress, walletId } = body;

    if (!email || !walletAddress) {
      return NextResponse.json(
        { error: "Email and wallet address are required" },
        { status: 400 }
      );
    }

    console.log("Para login attempt:", { email, walletAddress, walletId });

    // Check if user exists in Better Auth database
    let user = await db.query.user.findFirst({
      where: eq(schema.user.email, email),
    });

    if (!user) {
      // Create new user with Para wallet info
      console.log("Creating new user for Para wallet");
      const [newUser] = await db
        .insert(schema.user)
        .values({
          email,
          name: email.split("@")[0],
          emailVerified: true, // Para handles email verification
          paraWalletId: walletId || walletAddress,
          paraEmail: email,
        })
        .returning();

      user = newUser;
    } else {
      // Update existing user with Para wallet info if not already set
      if (!user.paraWalletId) {
        console.log("Updating existing user with Para wallet info");
        await db
          .update(schema.user)
          .set({
            paraWalletId: walletId || walletAddress,
            paraEmail: email,
          })
          .where(eq(schema.user.id, user.id));
      }
    }

    // Create a session for the user
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days
    const [session] = await db
      .insert(schema.session)
      .values({
        userId: user.id,
        expiresAt,
        token: crypto.randomUUID(),
        ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "",
        userAgent: req.headers.get("user-agent") || "",
      })
      .returning();

    // Set the session cookie
    const response = NextResponse.json({
      success: true,
      userId: user.id,
      email: user.email,
      session: {
        id: session.id,
        token: session.token,
      },
    });

    // Manually set the session cookie
    await setSessionCookie(
      {
        request: req,
        response,
        setCookie: (name: string, value: string, options: any) => {
          response.cookies.set(name, value, options);
        },
      } as any,
      {
        session,
        user,
      }
    );

    console.log("Para login successful:", { userId: user.id, sessionId: session.id });

    return response;
  } catch (error) {
    console.error("Para login error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
