import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="auth-shell">
      <div className="auth-brand">PayFlow</div>
      <SignIn
        appearance={{
          elements: {
            card: "shadow-none border border-slate-200",
          },
        }}
        fallbackRedirectUrl="/dashboard"
        signUpUrl="/sign-up"
      />
    </main>
  );
}
