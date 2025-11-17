/**
 * AsyncStorage utility functions
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Save a value to AsyncStorage
 */
export const saveToStorage = async (key: string, value: unknown) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Failed to save ${key} to storage:`, error);
    throw error;
  }
};

/**
 * Load a value from AsyncStorage
 */
export const loadFromStorage = async <T = unknown>(
  key: string
): Promise<T | null> => {
  try {
    const item = await AsyncStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch (error) {
    console.error(`Failed to load ${key} from storage:`, error);
    throw error;
  }
};

/**
 * Remove a value from AsyncStorage
 */
export const removeFromStorage = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove ${key} from storage:`, error);
    throw error;
  }
};

/**
 * Clear all storage
 */
export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error("Failed to clear storage:", error);
    throw error;
  }
};
