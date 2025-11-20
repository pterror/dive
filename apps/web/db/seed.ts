import { db, Objects } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(Objects).values([
    // Folders (Root)
    {
      id: "1",
      type: "folder",
      name: "Documents",
      parent_id: null,
      path: "/documents",
      content: null,
      properties: {},
      created_at: 1,
      updated_at: 1,
    },
    {
      id: "2",
      type: "folder",
      name: "Images",
      parent_id: null,
      path: "/images",
      content: null,
      properties: {},
      created_at: 1,
      updated_at: 1,
    },

    // Files in Documents
    {
      id: "3",
      type: "markdown",
      name: "notes.md",
      parent_id: "1",
      path: "/documents/notes.md",
      content: { content: "# My Notes\n\nThis is a seeded note." },
      properties: { author: "Me", status: "Draft" },
      created_at: 1,
      updated_at: 1,
    },
    {
      id: "6",
      type: "canvas",
      name: "Brainstorm",
      parent_id: "1",
      path: "/documents/brainstorm.canvas",
      content: { nodes: [], edges: [] },
      properties: {},
      created_at: 1,
      updated_at: 1,
    },

    // Files in Images
    {
      id: "4",
      type: "image",
      name: "photo.jpg",
      parent_id: "2",
      path: "/images/photo.jpg",
      content: null,
      properties: { width: 1920, height: 1080 },
      created_at: 1,
      updated_at: 1,
    },

    // Files in Root
    {
      id: "5",
      type: "video",
      name: "video.mp4",
      parent_id: null,
      path: "/video.mp4",
      content: null,
      properties: { duration: "10:00" },
      created_at: 1,
      updated_at: 1,
    },
  ]);
}
