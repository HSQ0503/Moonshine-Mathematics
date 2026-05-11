import { Masthead, Footer } from "@/components/Chrome";
import { PageContent } from "@/components/PageContent";
import { getPage } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const page = await getPage("about");
  const title = page?.title ?? "About this journal";
  const content = page?.content ?? "";

  return (
    <div className="shell">
      <Masthead page="about" />
      <article className="about-page">
        <h1>{title}</h1>
        {content ? (
          <PageContent content={content} />
        ) : (
          <p style={{ fontStyle: "italic", color: "var(--ink-mute)" }}>
            The about page hasn&apos;t been written yet. Sign in to the editorial panel to add content.
          </p>
        )}
      </article>
      <Footer />
    </div>
  );
}
