import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;
  private messageSubject: Subject<string> = new Subject();
  private pvtMessageSubject: Subject<any> = new Subject();

  private connSubject: Subject<string> = new Subject();
  socketId:any;
  constructor() {
    // Connect to WebSocket server
    // this.socket = io('http://localhost:3000');
    this.socket = io('http://localhost:3000', {
      transports: ['websocket'],  // Use WebSocket transport only
      withCredentials: true
    });
    this.socket.on('connect', () => {
      console.log('Connected with socket ID:', this.socket.id);  // socket.id will give you the ID
      this.socketId = this.socket.id
    });
    this.socket.on('disconnect', () => {
      console.log('Connected with socket ID:', this.socket.id);  // socket.id will give you the ID
      this.socketId = ''
    });
  }
  getSocketId(){
   return this.socketId
  }

  sendPrivateMsg(toid:any,msg:any){
    this.socket.emit('private message', { to: toid, content: msg  });
  }

  listenPrivateMsg(){
    this.socket.on('private message', (obj ) => {
     console.log("🚀 ~ ChatService ~ this.socket.on ~ obj:", obj)
     let {from, content} =obj;
      console.log(`Message from ${from}: ${content}`);
      this.pvtMessageSubject.next({ from, content })
    });
  }

  getPrivateMessageData(){
    return this.pvtMessageSubject;
  }



  // Send a chat message to the server
  sendMessage(message: any): void {
    this.socket.emit('chat message', {...message,fromId:this.socketId});
  }
  sendUsername(uname: any): void {
    this.socket.emit('setMyUsername', uname );
  }

  // Listen for new chat messages from the server
  listenForMessages() {
    this.socket.on('chat message', (msg: any) => {
      this.messageSubject.next(msg);
    });
    this.socket.on('newConnection', (msg: any) => {
      this.connSubject.next(msg);
    });
  }

  // Observable to subscribe to new messages
  getMessages() {
    return this.messageSubject.asObservable();
  }
  getConn() {
    return this.connSubject.asObservable();
  }
}
