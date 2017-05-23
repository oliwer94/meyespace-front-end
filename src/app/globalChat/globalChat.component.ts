import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { AlertService, UserService, ChatService } from '../_services/index';
import * as $ from 'jquery';
import * as moment from 'moment';
var el: JQuery;

@Component({
    moduleId: module.id,
    selector: 'globalChat',
    templateUrl: 'globalChat.component.html',
    styleUrls: ['globalChat.component.css']
})

export class GlobalChatComponent {

    messageModel: any = {};
    currentUser: any;
    userList: any = [];
    messages: any = [];

    constructor(private chatService: ChatService) {
        this.listenOnRooms();
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    connect() {
        this.chatService.connect();
    }

    listenOnRooms() {
        this.chatService.listenOnRooms(this.chatService).subscribe(data => {
            console.log("rooms" + data);

            var _select = $('<select>');
            _select.empty(); // remove old options
            $.each(data, function (value) {
                _select.append($("<option></option>")
                    .attr("value", value).text(data[value]));
            });
            $('#rooms').append(_select.html());
        });
        this.getRooms();
    }

    getRooms() {
        this.chatService.getRooms(this.chatService);
    }

    joinRoom(room) {
        var obj = { "name": this.currentUser.username, room };
        this.chatService.joinRoom(obj, this.chatService);

        this.getNewMessage();
        this.getFreshUserList();
    }


    getFreshUserList() {
        this.chatService.getFreshUserList(this.chatService).subscribe((data: any) => {
            this.userList = [];
            data.forEach((user) => {
                this.userList.push(user);
            });
        });
    }


    getNewMessage() {
        this.chatService.getNewMessage(this.chatService).subscribe((data: any) => {
            var formattedTime = moment((data.createdAt) ? data.createdAt : moment.now()).format('h:mm a');
            var message: MessageEntry = new MessageEntry();
            message.createdAt = formattedTime;
            message.text = data.text;
            message.from = data.from;

            this.messages.push(message);

            this.scrollToBottom();
        });
    }

    scrollToBottom() {
        var messages = jQuery('#messages');
        var clientHeight = messages.prop('clientHeight');
        var scrollTop = messages.prop('scrollTop');
        var scrollHeight = messages.prop('scrollHeight');
        var newMessage = messages.children('li:last-child')
        var newMessageHeight = newMessage.innerHeight();
        var lastMessageHeight = newMessage.prev().innerHeight();

        if (clientHeight + scrollTop + lastMessageHeight + newMessageHeight >= scrollHeight) {
            messages.scrollTop(scrollHeight);
        }
    }

    sendMessage() {

        this.chatService.createMessage(this.messageModel.message, this.chatService);
        this.messageModel.message = "";
    }

}

class MessageEntry {
    from: any;
    createdAt: any;
    text: any;
}