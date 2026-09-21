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
    const body = await request.json();
    const data: { title?: string; amountCents?: number; dueDate?: Date; status?: "OPEN"|"OVERDUE"|"PAID" } = {};
    if (typeof body.title === "string") data.title = body.title.trim();
    if (body.amountCents !== undefined) data.amountCents = Number(body.amountCents);
    if (body.dueDate !== undefined) data.dueDate = new Date(body.dueDate);
    if (body.status === "OPEN" || body.status === "OVERDUE" || body.status === "PAID") data.status = body.status;
    if (data.title !== undefined && (!data.title || data.title.length > 180)) return NextResponse.json({ error: "Invalid title" }, { status: 400 });
    if (data.amountCents !== undefined && (!Number.isInteger(data.amountCents) || data.amountCents <= 0)) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    if (data.dueDate && Number.isNaN(data.dueDate.getTime())) return NextResponse.json({ error: "Invalid due date" }, { status: 400 });
    const invoice = await db.invoice.update({ where: { id }, data });
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
    const existing = await db.invoice.findFirst({ where: { id, workspaceId: workspace.id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await db.invoice.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
