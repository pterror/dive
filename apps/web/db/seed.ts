import { db, Objects, ObjectTags, Tags } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(Objects).values([
    // Internal Objects (Markdown, Canvas)
    {
      id: "1",
      type: "markdown",
      name: "notes.md",
      content: { content: "# My Notes\n\nThis is a seeded note." },
      properties: { author: "Me", status: "Draft" },
      created_at: 1,
      updated_at: 1,
    },
    {
      id: "2",
      type: "canvas",
      name: "Brainstorm",
      content: { nodes: [], edges: [] },
      properties: {},
      created_at: 1,
      updated_at: 1,
    },

    // External Objects (Images, Videos) - Content is the path/reference
    {
      id: "3",
      type: "image",
      name: "photo.jpg",
      content: { path: "/images/photo.jpg" },
      properties: { width: 1920, height: 1080 },
      created_at: 1,
      updated_at: 1,
    },
    {
      id: "4",
      type: "video",
      name: "video.mp4",
      content: { path: "/video.mp4" },
      properties: { duration: "10:00" },
      created_at: 1,
      updated_at: 1,
    },
  ]);

  await db.insert(Tags).values([
    { id: "tag1", name: "Documents", color: "#3b82f6" },
    { id: "tag2", name: "Media", color: "#ef4444" },
  ]);

  await db.insert(ObjectTags).values([
    { object_id: "1", tag_id: "tag1" }, // notes.md -> Documents
    { object_id: "3", tag_id: "tag2" }, // photo.jpg -> Media
    { object_id: "4", tag_id: "tag2" }, // video.mp4 -> Media
  ]);
}
