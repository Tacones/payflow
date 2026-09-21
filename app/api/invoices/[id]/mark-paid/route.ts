import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { getWorkspaceByClerkUserId } from "@/lib/workspace";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  try {
    const userId = await requireUserId();
    const workspace = await getWorkspaceByClerkUserId(userId);
    const { id } = await params;
    const invoice = await db.invoice.findFirst({ where: { id, workspaceId: workspace.id } });
    if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (invoice.status === "PAID") return NextResponse.json({ ok: true });

    await db.$transaction(async (tx) => {
      const changed = await tx.invoice.updateMany({
        where: { id: invoice.id, workspaceId: workspace.id, status: { not: "PAID" } },
        data: { status: "PAID" },
      });
      if (changed.count === 1) {
        await tx.payment.create({
          data: { workspaceId: workspace.id, invoiceId: invoice.id, amountCents: invoice.amountCents, method: "manual" },
        });
      }
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
