// src/utils/customZustandStorage.js

const isLocalStorageAvailable = () => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

const customStorage = {
  getItem: (name) => {
    if (isLocalStorageAvailable()) {
      return Promise.resolve(localStorage.getItem(name));
    }
    return Promise.resolve(null);
  },
  setItem: (name, value) => {
    if (isLocalStorageAvailable()) {
      localStorage.setItem(name, value);
    }
    return Promise.resolve();
  },
  removeItem: (name) => {
    if (isLocalStorageAvailable()) {
      localStorage.removeItem(name);
    }
    return Promise.resolve();
  },
};

export default customStorage;
