import { Person } from '../types';
import { INITIAL_PEOPLE } from '../constants';

const STORAGE_KEY = 'gratitude_app_data';

export const getPeople = (): Person[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migration logic: Ensure all records have accessKeys
      // If legacy 'name' exists but 'accessKeys' doesn't, migrate it.
      return parsed.map((p: any) => {
        if (!p.accessKeys) {
          return {
            ...p,
            accessKeys: p.name ? [p.name] : []
          };
        }
        return p;
      });
    }
    return INITIAL_PEOPLE;
  } catch (e) {
    console.error("Error reading from storage", e);
    return INITIAL_PEOPLE;
  }
};

export const savePeople = (people: Person[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
  } catch (e) {
    console.error("Error saving to storage", e);
    alert("Error saving data. LocalStorage might be full.");
  }
};