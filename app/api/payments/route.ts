import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { getWorkspaceByClerkUserId } from "@/lib/workspace";

export async function GET() {
  try {
    const userId = await requireUserId();
    const workspace = await getWorkspaceByClerkUserId(userId);
    const payments = await db.payment.findMany({
      where: { workspaceId: workspace.id },
      include: { invoice: { include: { client: true } } },
      orderBy: { paidAt: "desc" },
      take: 100,
    });
    return NextResponse.json({ payments });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
