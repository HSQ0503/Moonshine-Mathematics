import { Masthead, Footer } from "@/components/Chrome";
import { getPublishedPosts } from "@/lib/db";
import { ArchiveView } from "./ArchiveView";

export default async function ArchivePage() {
  const posts = await getPublishedPosts();
  return (
    <div className="shell">
      <Masthead page="archive" />
      <ArchiveView posts={posts} />
      <Footer />
    </div>
  );
}
