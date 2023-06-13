<<<<<<< Updated upstream
import { io } from 'socket.io-client';
=======
>>>>>>> Stashed changes
import { getHost } from './host';

console.log('Hosts ===', getHost());
const URL =
  process.env.NODE_ENV === 'production'
    ? `https://${getHost()}/socket.io`
    : `http://${getHost()}/socket.io`;

<<<<<<< Updated upstream
export const socket = io(URL);
=======
export const SOCKET_MSG = {
  keysend_error: 'keysend_error',
  keysend_success: 'keysend_success',
  invoice_success: 'invoice_success',
  assign_success: 'assign_success',
  lnauth_success: 'lnauth_success',
  user_connect: 'user_connect'
};

let socket: WebSocket | null = null;

export const createSocketInstance = (): WebSocket => {
  if (!socket || !socket.OPEN) {
    socket = new WebSocket(URL);
  }
  return socket;
};

export const getSocketInstance = (): WebSocket => {
  if (!socket) {
    throw new Error('Socket instance not created. Call createSocketInstance first.');
  }
  return socket;
};
>>>>>>> Stashed changes
