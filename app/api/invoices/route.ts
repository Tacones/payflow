import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { getWorkspaceByClerkUserId } from "@/lib/workspace";

function parseAmount(value: unknown) {
  const amount = Number(value);
  return Number.isInteger(amount) && amount > 0 ? amount : null;
}

function parseDate(value: unknown) {
  if (typeof value !== "string" && !(value instanceof Date)) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

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
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    const workspace = await getWorkspaceByClerkUserId(userId);
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const clientId = typeof body.clientId === "string" ? body.clientId : "";
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const amountCents = parseAmount(body.amountCents);
    const dueDate = parseDate(body.dueDate);
    const currency = typeof body.currency === "string" ? body.currency.trim().toUpperCase() : "USD";

    if (!clientId || !title || title.length > 180 || !amountCents || !dueDate || !/^[A-Z]{3}$/.test(currency)) {
      return NextResponse.json({ error: "Invalid invoice data" }, { status: 400 });
    }

    const client = await db.client.findFirst({ where: { id: clientId, workspaceId: workspace.id }, select: { id: true } });
    if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

    const invoice = await db.invoice.create({
      data: { workspaceId: workspace.id, clientId: client.id, title, amountCents, currency, dueDate },
      include: { client: true },
    });
    return NextResponse.json({ invoice }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
