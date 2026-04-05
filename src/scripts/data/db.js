import { openDB } from 'idb';

const DATABASE_NAME = 'story-app-db';
const STORE_NAME = 'stories';

const dbPromise = openDB(DATABASE_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  },
});

const StoryDB = {
  async getAll() {
    return (await dbPromise).getAll(STORE_NAME);
  },
  async put(story) {
    return (await dbPromise).put(STORE_NAME, story);
  },
  async delete(id) {
    return (await dbPromise).delete(STORE_NAME, id);
  },
};

export default StoryDB;