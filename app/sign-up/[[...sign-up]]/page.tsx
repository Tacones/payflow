import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="auth-shell">
      <div className="auth-brand">PayFlow</div>
      <SignUp
        appearance={{
          elements: {
            card: "shadow-none border border-slate-200",
          },
        }}
        fallbackRedirectUrl="/dashboard"
        signInUrl="/sign-in"
      />
    </main>
  );
}
