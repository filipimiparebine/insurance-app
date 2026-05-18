import * as SecureStore from 'expo-secure-store';

function createTokenCache() {
  return {
    async getToken(key: string) {
      try {
        return await SecureStore.getItemAsync(key);
      } catch {
        return null;
      }
    },
    async saveToken(key: string, token: string) {
      try {
        await SecureStore.setItemAsync(key, token);
      } catch {
      }
    },
    async deleteToken(key: string) {
      try {
        await SecureStore.deleteItemAsync(key);
      } catch {
      }
    },
  };
}

export const tokenCache = createTokenCache();
