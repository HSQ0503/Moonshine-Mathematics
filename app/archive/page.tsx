import { Masthead, Footer } from "@/components/Chrome";
import { getPublishedPosts, getTags } from "@/lib/db";
import { ArchiveView } from "./ArchiveView";

export const dynamic = "force-dynamic";

export default async function ArchivePage() {
  const [posts, tags] = await Promise.all([getPublishedPosts(), getTags()]);
  return (
    <div className="shell">
      <Masthead page="archive" />
      <ArchiveView posts={posts} tags={tags} />
      <Footer />
    </div>
  );
}
