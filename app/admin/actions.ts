"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { createPost, updatePost, deletePost } from "@/lib/db";
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
  } else {
    saved = await createPost({
      ...input,
      featured: false,
      views: 0,
    });
  }
  revalidatePath("/");
  revalidatePath("/archive");
  revalidatePath(`/post/${saved.slug}`);
  revalidatePath("/admin");
  return { id: saved.id };
}

export async function setPostStatus(id: string, status: "published" | "draft") {
  await requireUser();
  await updatePost(id, { status });
  revalidatePath("/");
  revalidatePath("/archive");
  revalidatePath("/admin");
}

export async function removePost(id: string) {
  await requireUser();
  await deletePost(id);
  revalidatePath("/");
  revalidatePath("/archive");
  revalidatePath("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
