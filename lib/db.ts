import { createClient } from "@/utils/supabase/server";
import type { Post } from "./data";

type DbPost = {
  id: string;
  number: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  date: string;
  reading_time: number;
  tag: string;
  status: "published" | "draft";
  featured: boolean;
  views: number;
  body: string | null;
};

function fromRow(r: DbPost): Post {
  return {
    id: r.id,
    number: r.number,
    slug: r.slug,
    title: r.title,
    subtitle: r.subtitle,
    excerpt: r.excerpt,
    date: r.date,
    readingTime: r.reading_time,
    tag: r.tag,
    status: r.status,
    featured: r.featured,
    views: r.views,
    body: r.body ?? undefined,
  };
}

function toRow(p: Partial<Post>): Partial<DbPost> {
  const row: Partial<DbPost> = {};
  if (p.id !== undefined) row.id = p.id;
  if (p.number !== undefined) row.number = p.number;
  if (p.slug !== undefined) row.slug = p.slug;
  if (p.title !== undefined) row.title = p.title;
  if (p.subtitle !== undefined) row.subtitle = p.subtitle;
  if (p.excerpt !== undefined) row.excerpt = p.excerpt;
  if (p.date !== undefined) row.date = p.date;
  if (p.readingTime !== undefined) row.reading_time = p.readingTime;
  if (p.tag !== undefined) row.tag = p.tag;
  if (p.status !== undefined) row.status = p.status;
  if (p.featured !== undefined) row.featured = p.featured;
  if (p.views !== undefined) row.views = p.views;
  if (p.body !== undefined) row.body = p.body;
  return row;
}

export async function getPublishedPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("date", { ascending: false });
  if (error) throw error;
  return (data as DbPost[]).map(fromRow);
}

export async function getAllPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return (data as DbPost[]).map(fromRow);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? fromRow(data as DbPost) : null;
}

export async function getPostById(id: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? fromRow(data as DbPost) : null;
}

export async function createPost(p: Omit<Post, "id"> & { id?: string }): Promise<Post> {
  const supabase = await createClient();
  const row = toRow(p);
  if (!row.id) row.id = `p${Date.now().toString(36)}`;
  const { data, error } = await supabase
    .from("posts")
    .insert(row)
    .select()
    .single();
  if (error) throw error;
  return fromRow(data as DbPost);
}

export async function updatePost(id: string, patch: Partial<Post>): Promise<Post> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .update(toRow(patch))
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return fromRow(data as DbPost);
}

export async function deletePost(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
}
