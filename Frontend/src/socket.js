import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const socket = io(API_URL, {
  autoConnect: false,
  auth: {
    token: null,
  },
});

export const connectSocket = (token) => {
  if (!token) return;
  socket.auth.token = token;
  if (!socket.connected) socket.connect();
};

export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};