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
export default defineDb({
  tables: { Objects, Tags, ObjectTags }
});
