import { Component,EventEmitter,Input,Output } from '@angular/core';
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
    @Input() active:boolean;
    @Output() increaseNotif = new EventEmitter<any>();

    emitIncrease()
    {
        this.increaseNotif.emit();
    }

    constructor(private chatService: ChatService) {
        this.listenOnRooms();
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        $('#send').prop("disabled", true);
        $('#message-input').prop("disabled", true);
    }

    connect() {
        this.chatService.connect();
    }

    listenOnRooms() {
        this.chatService.listenOnRooms(this.chatService).subscribe(data => {
            
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


        $('#disconnect').prop("disabled", false);
        $('#room').prop("disabled", true);
        $('#rooms').prop("disabled", true);
        $('#join').prop("disabled", true);
        $('#send').prop("disabled", false);
        $('#message-input').prop("disabled", false);
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

            if(!this.active)
            {
                this.emitIncrease();
            }

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

    disconnectRoom(room) {
        var obj = { "name": this.currentUser.username, room };
        this.chatService.disconnectRoom(obj, this.chatService);

        $('#disconnect').prop("disabled", true);
        $('#room').prop("disabled", false);
        $('#rooms').prop("disabled", false);
        $('#join').prop("disabled", false);
        $('#send').prop("disabled", true);
        $('#message-input').prop("disabled", true);
    }

}

class MessageEntry {
    from: any;
    createdAt: any;
    text: any;
}