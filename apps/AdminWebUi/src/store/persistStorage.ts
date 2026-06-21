import type { Storage } from "redux-persist";

const persistStorage: Storage = {
  getItem(key) {
    return Promise.resolve(localStorage.getItem(key));
  },
  setItem(key, value) {
    return Promise.resolve(localStorage.setItem(key, value));
  },
  removeItem(key) {
    return Promise.resolve(localStorage.removeItem(key));
  },
};

export default persistStorage;
