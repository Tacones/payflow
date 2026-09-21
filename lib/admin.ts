import { currentUser } from "@clerk/nextjs/server";

function listFromEnv(name: string) {
  return (process.env[name] ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdmin() {
  const user = await currentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  const adminEmails = listFromEnv("PAYFLOW_ADMIN_EMAILS");
  const adminUserIds = listFromEnv("PAYFLOW_ADMIN_USER_IDS");
  const primaryEmail = user.primaryEmailAddress?.emailAddress?.trim().toLowerCase();

  const allowed =
    adminUserIds.includes(user.id.toLowerCase()) ||
    (!!primaryEmail && adminEmails.includes(primaryEmail));

  if (!allowed) {
    throw new Error("FORBIDDEN");
  }

  return user;
}
