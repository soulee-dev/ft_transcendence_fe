import { io } from 'socket.io-client';

const ENDPOINT = 'http://localhost:3000';  // replace with your server's endpoint

class SocketService {
  socket: any;

  connect() {
    this.socket = io(ENDPOINT);
  }

  movePaddle(data: { player: 'A' | 'B', y: number }) {
    this.socket.emit('movePaddle', data);
  }

  onMovePaddle(callback: (data: any) => void) {
    this.socket.on('movePaddle', callback);
  }
  
  onMove(callback: (data: any) => void) {
    this.socket.on('move', callback);
  }
}

export const socketService = new SocketService();
