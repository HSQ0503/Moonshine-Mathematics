import { AdminApp } from "./AdminApp";
import { getAllPosts, getTags, getActivity, listMedia, getPage } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [posts, tags, activity, media, aboutPage, homePage] = await Promise.all([
    getAllPosts(),
    getTags(),
    getActivity(8),
    listMedia(),
    getPage("about"),
    getPage("home"),
  ]);
  return (
    <AdminApp
      initialPosts={posts}
      initialTags={tags}
      initialActivity={activity}
      initialMedia={media}
      aboutPage={aboutPage ?? { slug: "about", title: "About", content: "" }}
      homePage={homePage ?? { slug: "home", title: "Journal", content: "" }}
    />
  );
}
