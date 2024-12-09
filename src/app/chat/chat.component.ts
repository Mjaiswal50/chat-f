import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { TimeOnlyPipe } from "../time-only.pipe";
declare var bootstrap: any;


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
  style6 = 'orange'
  style7 = 'brown'
  style8 = 'indigo'
  style9 = 'lightsteelblue'
  style10 = 'black'
  style11 = 'papayawhip'
  style12 = 'mistyrose'

  messages: any[] = [];
  username:any='';
  isUserNameSet=false;
  mySocketId:any;
  allUsersMap:any=[];
  activeUserId: any;
  messageInput:any=''
  userChats: any=[];
  nMap:any={};
  constructor(private chatService: ChatService) { }

  sendPrivateMessage(){
    if (this.messageInput.trim() && this.activeUserId) {
      const message = this.messageInput.trim();
      this.chatService.sendPrivateMsg(this.activeUserId,message)

      // Add the message to chat history
      this.userChats[this.activeUserId].push({ content: message, isSender: true });
      this.messageInput = ''; // Clear input
    }
  }
  allIds(){
    return Object.keys(this.allUsersMap)
  }
  fn(){
    return !this.username
  }
  openChat(userId: any) {
    
    this.activeUserId = userId;
    // Initialize chat history if not already
    if (!this.userChats[userId]) {
      this.userChats[userId] = []
    }
    this.nMap[userId]=0;
    // Open the Bootstrap modal
    const modal = new bootstrap.Modal(document.getElementById('chatModal'));
    modal.show();
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
    this.chatService.listenPrivateMsg()
    this.chatService.getPrivateMessageData().subscribe((data: any) => {
      console.log("🚀 ~ ChatComponent ~ this.chatService.getPrivateMessageData ~ data:", data)
      const { from, content } = data;
      if (!this.userChats[from]) {
        this.userChats[from] = [];
      }
      this.userChats[from].push({ content, isSender: false });
      if (this.activeUserId !== from) {
        // this.nMap[from] = this.nMap[from] + 1;
        if (!this.nMap[from]) {
          this.nMap[from] = 0; // Initialize to 0 if not already defined
        }
        this.nMap[from] += 1; // Safely increment
      }






    });
    // Subscribe to the message observable
    this.chatService.getMessages().subscribe((msg:any) => {
      this.messages.push(msg);
    });
    this.chatService.getConn().subscribe((conMap:any) => {
      this.allUsersMap = conMap;
      // Object.keys(this.allUsersMap).forEach(key=> {
      //   if (!(this.nMap[key]>0)){
      //     this.nMap[key] = 0
      //   }
      // })
      this.updateMsgs()
      if(sessionStorage.getItem('username')){
        this.username = sessionStorage.getItem('username');
      }else{
        this.username = this.allUsersMap[this.getMySocketId()]
      }
    });


  }
  closeModal(){
    this.nMap[this.activeUserId]=0;
    this.activeUserId = ''
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
