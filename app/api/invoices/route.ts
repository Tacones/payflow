import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { getWorkspaceByClerkUserId } from "@/lib/workspace";

export async function GET() {
  try {
    const userId = await requireUserId();
    const workspace = await getWorkspaceByClerkUserId(userId);
    const invoices = await db.invoice.findMany({
      where: { workspaceId: workspace.id },
      include: { client: true },
      orderBy: { dueDate: "asc" },
    });
    return NextResponse.json({ invoices });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
