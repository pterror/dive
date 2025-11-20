import { db, Objects } from 'astro:db';

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(Objects).values([
    { id: '1', type: 'folder', name: 'Documents', path: '/documents', content: null, properties: {}, created_at: 1, updated_at: 1 },
    { id: '2', type: 'folder', name: 'Images', path: '/images', content: null, properties: {}, created_at: 1, updated_at: 1 },
    { id: '3', type: 'markdown', name: 'notes.md', path: '/notes.md', content: { content: '# My Notes\n\nThis is a seeded note.' }, properties: { author: 'Me', status: 'Draft' }, created_at: 1, updated_at: 1 },
    { id: '4', type: 'image', name: 'photo.jpg', path: '/photo.jpg', content: null, properties: { width: 1920, height: 1080 }, created_at: 1, updated_at: 1 },
    { id: '5', type: 'video', name: 'video.mp4', path: '/video.mp4', content: null, properties: { duration: '10:00' }, created_at: 1, updated_at: 1 },
    { id: '6', type: 'canvas', name: 'Brainstorm', path: '/brainstorm.canvas', content: { nodes: [], edges: [] }, properties: {}, created_at: 1, updated_at: 1 },
  ]);
}
