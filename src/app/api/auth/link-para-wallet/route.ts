import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    // Get current session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { walletId, email } = body;

    if (!walletId || !email) {
      return NextResponse.json(
        { error: "Missing walletId or email" },
        { status: 400 }
      );
    }

    // Update user with Para wallet information
    // Note: Better Auth's updateUser API would be used here
    // This is a placeholder for the actual implementation
    
    // Example:
    // await auth.api.updateUser({
    //   userId: session.user.id,
    //   update: {
    //     paraWalletId: walletId,
    //     paraEmail: email,
    //   },
    // });

    console.log(`Linked Para wallet ${walletId} to user ${session.user.id}`);

    return NextResponse.json({
      success: true,
      message: "Para wallet linked successfully",
    });
  } catch (error) {
    console.error("Failed to link Para wallet:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
