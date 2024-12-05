import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [CommonModule,FormsModule]
})
export class ChatComponent implements OnInit {
  message: any = '';
  messages: any[] = [];
  username='';
  isUserNameSet=false;
  mySocketId:any;
  allUsers:any=[];
  constructor(private chatService: ChatService) { }

  fn(){
    return !this.username
  }
  ngOnInit(): void {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
      this.isUserNameSet = true;
    }
    this.mySocketId = this.chatService.socketId;

    // Start listening for incoming messages
    this.chatService.listenForMessages();

    // Subscribe to the message observable
    this.chatService.getMessages().subscribe((msg:any) => {
      this.messages.push(msg);
    });
    this.chatService.getConn().subscribe((conArr:any) => {
      this.allUsers=conArr;
    });
  }
  getMySocketId(){
    return this.chatService.getSocketId()
  }
  sendMessage(): void {
    if (this.message.trim()) {
      this.chatService.sendMessage({message:this.message,username:this.username});
      this.message = ''; // Clear the message input
    }
  }
  setUsername(): void {
    // Store the username in sessionStorage
    if (this.username.trim()) {
      sessionStorage.setItem('username', this.username);
      this.isUserNameSet = true;
    }
  }
}
