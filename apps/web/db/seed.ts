import { db, Objects } from 'astro:db';

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(Objects).values([
    { id: '1', type: 'folder', name: 'Documents', path: '/Documents', content: null, created_at: 1, updated_at: 1 },
    { id: '2', type: 'folder', name: 'Images', path: '/Images', content: null, created_at: 1, updated_at: 1 },
    { id: '3', type: 'markdown', name: 'notes.md', path: '/notes.md', content: { content: '# My Notes\n\nThis is a seeded note.' }, created_at: 1, updated_at: 1 },
    { id: '4', type: 'image', name: 'photo.jpg', path: '/photo.jpg', content: null, created_at: 1, updated_at: 1 },
    { id: '5', type: 'video', name: 'video.mp4', path: '/video.mp4', content: null, created_at: 1, updated_at: 1 },
  ]);
}
