import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class ChatService {

    private url = 'https://meyespace-chatservice.herokuapp.com';

    //private url = 'http://localhost:7000';
    socket: any;


    constructor() {
        this.connect();
    }

    getRooms(instance: ChatService) {
        instance.socket.emit('getRooms');
    }

    listenOnRooms(instance: ChatService) {
        let observable = new Observable(observer => {
            instance.socket.on('getRooms', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        })
        return observable;
    }
    registerToPrivate(instance: ChatService, name) {
        instance.socket.emit('register', name);
    }
    connect() {
        if (this.socket != null) {
            this.socket.disconnect();
        }
        this.socket = io(this.url);
        this.socket.connect(this.url);
    }

    joinRoom(params, instance: ChatService) {
        instance.socket.emit('join', params, (error: any) => {
            if (error) {
                alert("An error has occured please reload the page to try to reconnect! " + error);
            }
            console.log(`Connected to live data service. Listening on Global and ${params.room} channels`);
        });
    }

    getFreshUserList(instance: ChatService) {
        let observable = new Observable(observer => {
            instance.socket.on('updateUserList', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        })
        return observable;
    }

    disconnect(instance: ChatService) {
        instance.socket.disconnect();
    }

    getNewMessage(instance: ChatService) {
        let observable = new Observable(observer => {
            //console.log(instance.socket);       
            instance.socket.on('newMessage', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        })
        return observable;
    }

    createMessage(message, instance: ChatService) {
        instance.socket.emit('createMessage', message);
    }


    getPrivateMessages(instance: ChatService) {
        let observable = new Observable(observer => {
            instance.socket.on('private', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        })
        return observable;
    }

    sendPrivateMessages(instance: ChatService, to, message) {
        var params = { to, message };
        instance.socket.emit("private", params);
    }
}