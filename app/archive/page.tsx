import { Masthead, Footer } from "@/components/Chrome";
import { FloatingScrollMoon } from "@/components/ScrollMoon";
import { getPublishedPosts, getTags } from "@/lib/db";
import { ArchiveView } from "./ArchiveView";

export const dynamic = "force-dynamic";

export default async function ArchivePage() {
  const [posts, tags] = await Promise.all([getPublishedPosts(), getTags()]);
  return (
    <>
      <FloatingScrollMoon />
      <div className="shell">
        <Masthead page="archive" />
        <ArchiveView posts={posts} tags={tags} />
        <Footer />
      </div>
    </>
  );
}
