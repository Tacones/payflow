import { db } from "@/lib/db";

export async function getWorkspaceByClerkUserId(clerkUserId: string) {
  return db.workspace.upsert({
    where: { clerkUserId },
    update: {},
    create: { clerkUserId },
    select: { id: true, clerkUserId: true },
  });
}
