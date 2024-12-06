import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { TimeOnlyPipe } from "../time-only.pipe";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [CommonModule, FormsModule, TimeOnlyPipe]
})
export class ChatComponent implements OnInit {
  message: any = '';
  style1 = 'yellow';
  style2 = 'black'
  style3 = 'pink'
  style0 = 'red'
  style4='teal'
  style5='white'

  messages: any[] = [];
  username:any='';
  isUserNameSet=false;
  mySocketId:any;
  allUsersMap:any=[];
  constructor(private chatService: ChatService) { }

  allIds(){
    return Object.keys(this.allUsersMap)
  }
  fn(){
    return !this.username
  }
  ngOnInit(): void {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
      this.isUserNameSet = true;
      this.chatService.sendUsername({ username: this.username });

    }
    this.mySocketId = this.chatService.socketId;

    // Start listening for incoming messages
    this.chatService.listenForMessages();

    // Subscribe to the message observable
    this.chatService.getMessages().subscribe((msg:any) => {
      this.messages.push(msg);
      
    });
    this.chatService.getConn().subscribe((conMap:any) => {
      this.allUsersMap = conMap;
      this.updateMsgs()
      if(sessionStorage.getItem('username')){
        this.username = sessionStorage.getItem('username');
      }else{
        this.username = this.allUsersMap[this.getMySocketId()]
      }
    });
  }
  getMySocketId(){
    return this.chatService.getSocketId()
  }
  sendMessage(): void {
    if (this.message.trim()) {
      this.chatService.sendMessage({message:this.message,username:this.username,time:new Date()});
      this.message = ''; // Clear the message input
    }
  }
  setUsername(): void {
    // Store the username in sessionStorage
    if (this.username.trim()) {
      sessionStorage.setItem('username', this.username);
      this.chatService.sendUsername({ username: this.username });
      this.isUserNameSet = true;
    }
  }
  updateMsgs(){
    this.messages.forEach(data=>{
      data.username = this.allUsersMap[data.fromId]
    })
  }

}
