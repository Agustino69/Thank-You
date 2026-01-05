import { Person, SystemConfig } from '../types';
import { INITIAL_PEOPLE, DEFAULT_SYSTEM_CONFIG } from '../constants';

const STORAGE_KEY = 'gratitude_app_data';
const CONFIG_KEY = 'gratitude_app_config';

export const getPeople = (): Person[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migration logic: 
      // 1. Ensure all records have accessKeys
      // 2. Migrate single videoUrl to videoUrls array
      return parsed.map((p: any) => {
        let updated = { ...p };

        // Access Keys Migration
        if (!updated.accessKeys) {
            updated.accessKeys = updated.name ? [updated.name] : [];
        }

        // Video URL Migration
        if (updated.videoUrl && (!updated.videoUrls || updated.videoUrls.length === 0)) {
            updated.videoUrls = [updated.videoUrl];
        }
        
        return updated;
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

export const getSystemConfig = (): SystemConfig => {
  try {
    const stored = localStorage.getItem(CONFIG_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return DEFAULT_SYSTEM_CONFIG;
  } catch (e) {
    console.error("Error reading config", e);
    return DEFAULT_SYSTEM_CONFIG;
  }
};

export const saveSystemConfig = (config: SystemConfig): void => {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error("Error saving config", e);
  }
};