import { db, Objects } from "astro:db";

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
}
