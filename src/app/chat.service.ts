import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;
  private messageSubject: Subject<string> = new Subject();

  constructor() {
    // Connect to WebSocket server
    // this.socket = io('http://localhost:3000');
    this.socket = io('http://localhost:3000', {
      transports: ['websocket'],  // Use WebSocket transport only
      withCredentials: true
    });

  }

  // Send a chat message to the server
  sendMessage(message: string): void {
    this.socket.emit('chat message', message);
  }

  // Listen for new chat messages from the server
  listenForMessages() {
    this.socket.on('chat message', (msg: string) => {
      this.messageSubject.next(msg);
    });
  }

  // Observable to subscribe to new messages
  getMessages() {
    return this.messageSubject.asObservable();
  }
}
