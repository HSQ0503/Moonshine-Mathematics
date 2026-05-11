"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import {
  createPost, updatePost, deletePost,
  createTag, deleteTag,
  updatePage,
  logActivity,
  uploadMedia, deleteMedia,
} from "@/lib/db";
import type { Post } from "@/lib/data";

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export type PostInput = {
  id?: string;
  number: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  date: string;
  readingTime: number;
  tag: string;
  status: "published" | "draft";
  body?: string;
};

export async function savePost(input: PostInput): Promise<{ id: string }> {
  await requireUser();
  let saved: Post;
  if (input.id) {
    saved = await updatePost(input.id, input);
    if (input.status === "published") {
      await logActivity("Published", saved.title);
    } else {
      await logActivity("Edited", saved.title);
    }
  } else {
    saved = await createPost({ ...input, featured: false, views: 0 });
    await logActivity(
      input.status === "draft" ? "Created" : "Published",
      input.status === "draft" ? `Draft: ${saved.title}` : saved.title,
    );
  }
  revalidatePath("/");
  revalidatePath("/archive");
  revalidatePath(`/post/${saved.slug}`);
  revalidatePath("/admin");
  return { id: saved.id };
}

export async function setPostStatus(id: string, status: "published" | "draft") {
  await requireUser();
  const updated = await updatePost(id, { status });
  await logActivity(status === "published" ? "Published" : "Unpublished", updated.title);
  revalidatePath("/");
  revalidatePath("/archive");
  revalidatePath("/admin");
}

export async function removePost(id: string) {
  await requireUser();
  const supabase = await createClient();
  const { data: existing } = await supabase.from("posts").select("title, slug").eq("id", id).maybeSingle();
  await deletePost(id);
  if (existing?.title) await logActivity("Deleted", existing.title);
  revalidatePath("/");
  revalidatePath("/archive");
  revalidatePath("/admin");
}

export async function addTag(name: string) {
  await requireUser();
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Tag name is required.");
  await createTag(trimmed);
  await logActivity("Tagged", `Added tag "${trimmed}"`);
  revalidatePath("/admin");
  revalidatePath("/archive");
}

export async function removeTag(name: string) {
  await requireUser();
  await deleteTag(name);
  await logActivity("Tagged", `Removed tag "${name}"`);
  revalidatePath("/admin");
  revalidatePath("/archive");
}

export async function savePageContent(slug: string, title: string, content: string) {
  await requireUser();
  await updatePage(slug, { title, content });
  await logActivity("Edited", `Page: ${title}`);
  revalidatePath("/admin");
  revalidatePath(`/${slug}`);
}

export async function uploadFile(input: { name: string; data: string; contentType: string }) {
  await requireUser();
  const bytes = Uint8Array.from(atob(input.data), c => c.charCodeAt(0));
  const file = await uploadMedia(input.name, bytes.buffer as ArrayBuffer, input.contentType);
  await logActivity("Uploaded", input.name);
  revalidatePath("/admin");
  return file;
}

export async function removeFile(name: string) {
  await requireUser();
  await deleteMedia(name);
  await logActivity("Removed", `Media: ${name}`);
  revalidatePath("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
