import { defineDb, defineTable, column } from 'astro:db';

const Objects = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    type: column.text(),
    name: column.text(),
    path: column.text({ optional: true }),
    content: column.json({ optional: true }),
    properties: column.json({ optional: true }),
    created_at: column.number({ default: Math.floor(Date.now() / 1000) }),
    updated_at: column.number({ default: Math.floor(Date.now() / 1000) }),
  }
});

const Tags = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text({ unique: true }),
    color: column.text({ optional: true }),
  }
});

const ObjectTags = defineTable({
  columns: {
    object_id: column.text({ references: () => Objects.columns.id }),
    tag_id: column.text({ references: () => Tags.columns.id }),
  }
});

// https://astro.build/db/config
export const Relations = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    source_id: column.text({ references: () => Objects.columns.id }),
    target_id: column.text({ references: () => Objects.columns.id }),
    type: column.text(), // e.g., 'author', 'related', 'parent'
    data: column.json({ optional: true }), // e.g., { x: 10, y: 10 } for regions
    created_at: column.number({ default: Math.floor(Date.now() / 1000) }),
  }
});

export default defineDb({
  tables: { Objects, Tags, ObjectTags, Relations }
});
