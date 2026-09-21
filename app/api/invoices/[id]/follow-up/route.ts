import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { getWorkspaceByClerkUserId } from "@/lib/workspace";

type Params = { params: Promise<{ id: string }> };

const templates = {
  GENTLE: "Hi {{client}}, just a quick note to follow up on invoice {{invoice}}. If you have any questions, I’m happy to help. Thanks!",
  PROFESSIONAL: "Hi {{client}}, I’m following up on invoice {{invoice}}. Could you please confirm the expected payment date? Thank you.",
  FINAL: "Hi {{client}}, this is a final follow-up regarding invoice {{invoice}}. Please let me know if there is anything needed from my side to complete payment.",
} as const;

export async function POST(request: Request, { params }: Params) {
  try {
    const userId = await requireUserId();
    const workspace = await getWorkspaceByClerkUserId(userId);
    const { id } = await params;
    const invoice = await db.invoice.findFirst({ where: { id, workspaceId: workspace.id }, include: { client: true } });
    if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const body = await request.json().catch(() => ({}));
    const template = body.template === "FINAL" || body.template === "PROFESSIONAL" ? body.template : "GENTLE";
    const custom = typeof body.message === "string" ? body.message.trim() : "";
    const message = custom || templates[template].replaceAll("{{client}}", invoice.client.name).replaceAll("{{invoice}}", invoice.title);
    const followUp = await db.followUp.create({ data: { workspaceId: workspace.id, invoiceId: invoice.id, template, message } });
    return NextResponse.json({ followUp }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
