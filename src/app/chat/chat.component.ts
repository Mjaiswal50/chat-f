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
  message: string = '';
  messages: string[] = [];

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    // Start listening for incoming messages
    this.chatService.listenForMessages();

    // Subscribe to the message observable
    this.chatService.getMessages().subscribe((msg) => {
      this.messages.push(msg);
    });
  }

  sendMessage(): void {
    if (this.message.trim()) {
      this.chatService.sendMessage(this.message);
      this.message = ''; // Clear the message input
    }
  }
}
