import { Masthead, Footer } from "@/components/Chrome";
import { LoginForm } from "./LoginForm";

type SP = Promise<{ next?: string; error?: string }>;

export default async function LoginPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  return (
    <div className="shell">
      <Masthead page="admin" />
      <section style={{ maxWidth: 380, margin: "64px auto 96px" }}>
        <h2 style={{ fontFamily: "var(--serif)", fontWeight: 500, fontSize: 28, margin: "0 0 8px", letterSpacing: "-0.005em" }}>
          Editorial sign-in
        </h2>
        <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ink-mute)", fontSize: 15, margin: "0 0 28px" }}>
          Restricted to the editor of the journal.
        </p>
        <LoginForm next={sp.next} error={sp.error} />
      </section>
      <Footer />
    </div>
  );
}
