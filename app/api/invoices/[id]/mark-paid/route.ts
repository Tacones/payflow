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
    await db.$transaction([
      db.invoice.update({ where: { id }, data: { status: "PAID" } }),
      db.payment.create({ data: { workspaceId: workspace.id, invoiceId: invoice.id, amountCents: invoice.amountCents, method: "manual" } }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
