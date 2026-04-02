import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const API_URL = 'http://127.0.0.1:8000'; 

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  let token;
  
  if (Platform.OS === 'web') {
    token = localStorage.getItem('userToken');
  } else {
    token = await SecureStore.getItemAsync('userToken');
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;