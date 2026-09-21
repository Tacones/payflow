import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const clerkUserId = await requireUserId();

    const workspace = await db.workspace.upsert({
      where: { clerkUserId },
      update: {},
      create: { clerkUserId },
      select: { id: true, createdAt: true },
    });

    return NextResponse.json({ workspace });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
