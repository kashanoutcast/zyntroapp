import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const SERVER_BASE_URL = "http://localhost:8080/";

export const SERVER = axios.create({
  baseURL: SERVER_BASE_URL,
  withCredentials: true,
});
