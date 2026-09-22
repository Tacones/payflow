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
    const existing = await db.client.findFirst({ where: { id, workspaceId: workspace.id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : existing.name;
    const email = typeof body.email === "string" ? body.email.trim() : existing.email;
    const company = typeof body.company === "string" ? body.company.trim() : existing.company;
    if (!name || name.length > 120) return NextResponse.json({ error: "Invalid client data" }, { status: 400 });
    const client = await db.client.update({ where: { id, workspaceId: workspace.id }, data: { name, email: email || null, company: company || null } });
    return NextResponse.json({ client });
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
    const existing = await db.client.findFirst({ where: { id, workspaceId: workspace.id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const counts = await db.client.findUnique({ where: { id }, select: { _count: { select: { invoices: true } } } });
    if (counts?._count.invoices) return NextResponse.json({ error: "Clients with invoices cannot be deleted." }, { status: 409 });
    await db.client.delete({ where: { id, workspaceId: workspace.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
