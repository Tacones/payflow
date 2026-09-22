import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { getWorkspaceByClerkUserId } from "@/lib/workspace";

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
function validEmail(value: string) {
  return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function GET() {
  try {
    const userId = await requireUserId(); const workspace = await getWorkspaceByClerkUserId(userId);
    const clients = await db.client.findMany({ where: { workspaceId: workspace.id }, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ clients });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await requireUserId(); const workspace = await getWorkspaceByClerkUserId(userId);
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    const name = clean(body.name, 120); const email = clean(body.email, 254); const company = clean(body.company, 160);
    const subscription = await db.subscription.findUnique({ where: { workspaceId: workspace.id }, select: { plan: true, status: true } });
    if ((!subscription || subscription.plan === "FREE") && (subscription?.status === "canceled" || !subscription || subscription.status === "active" || subscription.status === "trialing")) {
      const activeClients = await db.client.count({ where: { workspaceId: workspace.id } });
      if (activeClients >= 5) return NextResponse.json({ error: "Free plan limit reached. Upgrade to add more clients." }, { status: 403 });
    }
    if (!name || name.length > 120 || email.length > 254 || company.length > 160 || !validEmail(email)) return NextResponse.json({ error: "Invalid client data" }, { status: 400 });
    const client = await db.client.create({ data: { workspaceId: workspace.id, name, email: email || null, company: company || null } });
    return NextResponse.json({ client }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
