import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeOnlyPipe } from '../time-only.pipe';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [CommonModule, FormsModule, TimeOnlyPipe]
})
export class ChatComponent implements OnInit {
  message: string = '';
  messages: any[] = [];
  username: any = '';
  isUserNameSet: boolean = false;
  allUsersMap: { [key: string]: string } = {};

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    // Retrieve stored username if available
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
      this.isUserNameSet = true;
      this.chatService.sendUsername({ username: this.username });
    }

    // Listen for incoming messages
    this.chatService.listenForMessages();
    this.chatService.getMessages().subscribe((msg: any) => {
      this.messages.push(msg);
    });

    // Update connections and user list
    this.chatService.getConn().subscribe((connections: any) => {
      this.allUsersMap = connections;
      this.updateMessageUsernames();
      if (sessionStorage.getItem('username')) {
        this.username = sessionStorage.getItem('username');
      } else {
        this.username = this.allUsersMap[this.getMySocketId()]
      }
    });
  }

  getMySocketId(): string {
    return this.chatService.getSocketId();
  }

  sendMessage(): void {
    if (this.message.trim()) {
      this.chatService.sendMessage({
        message: this.message,
        username: this.username,
        time: new Date(),
      });
      this.message = ''; // Clear input after sending
    }
  }

  setUsername(): void {
    if (this.username.trim()) {
      sessionStorage.setItem('username', this.username);
      this.chatService.sendUsername({ username: this.username });
      this.isUserNameSet = true;
    }
  }

  updateMessageUsernames(): void {
    this.messages.forEach((msg) => {
      msg.username = this.allUsersMap[msg.fromId];
    });
  }
}
