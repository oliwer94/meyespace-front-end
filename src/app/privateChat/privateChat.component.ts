import { Component, Input, OnChanges,Output, SimpleChange,EventEmitter } from '@angular/core';
import { AlertService } from '../_services/index';
import * as $ from 'jquery';
import * as moment from 'moment';
var el: JQuery;

@Component({
    moduleId: module.id,
    selector: 'privateChat',
    templateUrl: 'privateChat.component.html',
    styleUrls: ['privateChat.component.css']
})

export class PrivateChatComponent {

    messageModel: any = {};
    currentUser: any;

    @Input() activeConversation: any = [];
    @Output() newMessage = new EventEmitter<Object>();
    @Output() hideChatPanel = new EventEmitter<boolean>();

    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
       // this.activeConversation = {"from":"Oliwer","messages":[{text:"bla bla vla",from:"Oliwer",createdAt:"now"},{"text":"bla bla vla","from":"Oliwer","createdAt":"now"},{"text":"bla bla vla","from":"Oliwer","createdAt":"now"},{"text":"bla bla vla","from":"Oliwer","createdAt":"now"},{"text":"bla bla vla","from":"Oliwer","createdAt":"now"}]};
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        let log: string[] = [];
        for (let propName in changes) {
            if (propName === "activeConversation") {
                this.scrollToBottom();
                break;
            }
        }
    }

    close()
    {
        this.hideChatPanel.emit(true);   
    }

    scrollToBottom() {
        var messages = jQuery('#privateMessages');
        var clientHeight = 260;// messages.prop('clientHeight');
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
        this.newMessage.emit({"text":this.messageModel.message,"from":this.currentUser.username});
        this.messageModel.message = "";
    }
}

class MessageEntry {
    from: any;
    createdAt: any;
    text: any;
}