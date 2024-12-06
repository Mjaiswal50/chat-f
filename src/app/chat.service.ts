import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;
  private messageSubject: Subject<any> = new Subject();
  private connSubject: Subject<any> = new Subject();
  private socketId: any = '';

  constructor() {
    // Connect to WebSocket server
    this.socket = io('http://localhost:3000', {
      transports: ['websocket'], // Use WebSocket transport only
      withCredentials: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected with socket ID:', this.socket.id);
      this.socketId = this.socket.id;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.socketId = '';
    });
  }

  getSocketId(): string {
    return this.socketId;
  }

  // Send chat message to server
  sendMessage(message: any): void {
    this.socket.emit('chat message', { ...message, fromId: this.socketId });
  }

  // Send username to server
  sendUsername(userData: any): void {
    this.socket.emit('setMyUsername', userData);
  }

  // Listen for chat messages
  listenForMessages(): void {
    this.socket.on('chat message', (msg: any) => {
      this.messageSubject.next(msg);
    });

    this.socket.on('newConnection', (connections: any) => {
      this.connSubject.next(connections);
    });
  }

  // Observable for new messages
  getMessages() {
    return this.messageSubject.asObservable();
  }

  // Observable for user connections
  getConn() {
    return this.connSubject.asObservable();
  }
}
