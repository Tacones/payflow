import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { getWorkspaceByClerkUserId } from "@/lib/workspace";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    const userId = await requireUserId();
    const workspace = await getWorkspaceByClerkUserId(userId);
    const { id } = await params;
    const existing = await db.invoice.findFirst({ where: { id, workspaceId: workspace.id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (existing.status === "PAID") return NextResponse.json({ error: "Paid invoices cannot be edited" }, { status: 409 });

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    const data: { title?: string; amountCents?: number; dueDate?: Date } = {};

    if (typeof body.title === "string") data.title = body.title.trim();
    if (body.amountCents !== undefined) {
      const amount = Number(body.amountCents);
      if (!Number.isInteger(amount) || amount <= 0 || amount > 100_000_000_00) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
      data.amountCents = amount;
    }
    if (body.dueDate !== undefined) {
      if (typeof body.dueDate !== "string") return NextResponse.json({ error: "Invalid due date" }, { status: 400 });
      const date = new Date(body.dueDate);
      if (Number.isNaN(date.getTime())) return NextResponse.json({ error: "Invalid due date" }, { status: 400 });
      data.dueDate = date;
    }
    if (data.title !== undefined && (!data.title || data.title.length > 180)) return NextResponse.json({ error: "Invalid title" }, { status: 400 });
    if (Object.keys(data).length === 0) return NextResponse.json({ error: "No changes supplied" }, { status: 400 });

    const invoice = await db.invoice.update({ where: { id, workspaceId: workspace.id }, data });
    return NextResponse.json({ invoice });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const userId = await requireUserId();
    const workspace = await getWorkspaceByClerkUserId(userId);
    const { id } = await params;
    const existing = await db.invoice.findFirst({ where: { id, workspaceId: workspace.id }, include: { _count: { select: { payments: true } } } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (existing._count.payments > 0) return NextResponse.json({ error: "Paid invoices cannot be deleted" }, { status: 409 });
    await db.invoice.delete({ where: { id, workspaceId: workspace.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
