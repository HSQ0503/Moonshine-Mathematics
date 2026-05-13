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

// ─── tags ────────────────────────────────────────────────────────────────────

export async function getTags(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("tags").select("name").order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(r => r.name as string);
}

export async function createTag(name: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("tags").insert({ name });
  if (error) throw error;
}

export async function deleteTag(name: string): Promise<void> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("tag", name);
  if ((count ?? 0) > 0) {
    throw new Error(`Cannot delete "${name}" — ${count} post(s) still use it.`);
  }
  const { error } = await supabase.from("tags").delete().eq("name", name);
  if (error) throw error;
}

// ─── activity ────────────────────────────────────────────────────────────────

export type ActivityRow = { id: number; action: string; what: string; ts: string };

export async function getActivity(limit = 8): Promise<ActivityRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("activity")
    .select("*")
    .order("ts", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as ActivityRow[];
}

export async function logActivity(action: string, what: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("activity").insert({ action, what });
}

// ─── pages ───────────────────────────────────────────────────────────────────

export type Page = { slug: string; title: string; content: string };

export async function getPage(slug: string): Promise<Page | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .select("slug, title, content")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as Page | null;
}

export async function updatePage(slug: string, patch: { title?: string; content?: string }): Promise<void> {
  const supabase = await createClient();
  const row = { slug, title: patch.title ?? "", content: patch.content ?? "" };
  const { error } = await supabase.from("pages").upsert(row, { onConflict: "slug" });
  if (error) throw error;
}

// ─── media (Supabase Storage) ────────────────────────────────────────────────

export type MediaFile = { name: string; size: number; updatedAt: string; url: string };

const BUCKET = "media";

export async function listMedia(): Promise<MediaFile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from(BUCKET).list("", {
    limit: 200,
    sortBy: { column: "updated_at", order: "desc" },
  });
  if (error) throw error;
  const files = (data ?? []).filter(f => f.id !== null);
  return files.map(f => {
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(f.name);
    return {
      name: f.name,
      size: f.metadata?.size ?? 0,
      updatedAt: f.updated_at ?? f.created_at ?? new Date().toISOString(),
      url: pub.publicUrl,
    };
  });
}

export async function uploadMedia(name: string, file: ArrayBuffer, contentType: string): Promise<MediaFile> {
  const supabase = await createClient();
  const { error } = await supabase.storage.from(BUCKET).upload(name, file, {
    contentType,
    upsert: true,
  });
  if (error) throw error;
  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(name);
  return { name, size: file.byteLength, updatedAt: new Date().toISOString(), url: pub.publicUrl };
}

export async function deleteMedia(name: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.storage.from(BUCKET).remove([name]);
  if (error) throw error;
}

// ─── settings ────────────────────────────────────────────────────────────────

export type Settings = {
  authorName: string;
  authorInitials: string;
  deskLabel: string;
  deskSublabel: string;
  currentsReading: string;
  currentsResearch: string;
  currentsWriting: string;
};

const DEFAULT_SETTINGS: Settings = {
  authorName: "J. Calder",
  authorInitials: "JC",
  deskLabel: "",
  deskSublabel: "",
  currentsReading: "",
  currentsResearch: "",
  currentsWriting: "",
};

export async function getSettings(): Promise<Settings> {
  const supabase = await createClient();
  const full = await supabase
    .from("journal_settings")
    .select("author_name, author_initials, desk_label, desk_sublabel, currents_reading, currents_research, currents_writing")
    .eq("id", 1)
    .maybeSingle();
  let data = full.data as Record<string, string | null> | null;
  if (full.error) {
    const fallback = await supabase
      .from("journal_settings")
      .select("author_name, author_initials, desk_label, desk_sublabel")
      .eq("id", 1)
      .maybeSingle();
    if (fallback.error || !fallback.data) return DEFAULT_SETTINGS;
    data = fallback.data as Record<string, string | null>;
  }
  if (!data) return DEFAULT_SETTINGS;
  return {
    authorName: data.author_name ?? DEFAULT_SETTINGS.authorName,
    authorInitials: data.author_initials ?? DEFAULT_SETTINGS.authorInitials,
    deskLabel: data.desk_label ?? "",
    deskSublabel: data.desk_sublabel ?? "",
    currentsReading: data.currents_reading ?? "",
    currentsResearch: data.currents_research ?? "",
    currentsWriting: data.currents_writing ?? "",
  };
}

export async function updateSettings(patch: Partial<Settings>): Promise<void> {
  const supabase = await createClient();
  const row: Record<string, string | number> = { id: 1 };
  if (patch.authorName !== undefined) row.author_name = patch.authorName;
  if (patch.authorInitials !== undefined) row.author_initials = patch.authorInitials;
  if (patch.deskLabel !== undefined) row.desk_label = patch.deskLabel;
  if (patch.deskSublabel !== undefined) row.desk_sublabel = patch.deskSublabel;
  if (patch.currentsReading !== undefined) row.currents_reading = patch.currentsReading;
  if (patch.currentsResearch !== undefined) row.currents_research = patch.currentsResearch;
  if (patch.currentsWriting !== undefined) row.currents_writing = patch.currentsWriting;
  const { error } = await supabase.from("journal_settings").upsert(row, { onConflict: "id" });
  if (error) throw error;
}
