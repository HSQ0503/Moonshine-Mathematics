import { AdminApp } from "./AdminApp";
import { getAllPosts } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const posts = await getAllPosts();
  return <AdminApp initialPosts={posts} />;
}
