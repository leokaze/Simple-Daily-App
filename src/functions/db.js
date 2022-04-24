import Dexie from "dexie";

export const db = new Dexie('notasDatabase');
db.version(1).stores({
  notas: '++id, title, content, checked, dateCreated, dateModified, color'
});