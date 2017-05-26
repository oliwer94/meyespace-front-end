import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class LiveDataService {

    private url = 'https://meyespace-livedataservice.herokuapp.com';

    //private url = 'http://localhost:6001';
    socket: any;

    constructor(room: string, name: string) {
        this.socket = io(this.url);
        this.socket.connect(this.url);
        var params = { room, name };
        this.socket.emit('join', params, (error: any) => {
            if (error) {
                alert("An error has occured please reload the page to try to reconnect! " + error);
            }
            console.log(`Connected to live data service. Listening on Global and ${room} channels`);
        });
    }

    disconnect(instance: LiveDataService) {
        instance.socket.disconnect();
    }

    getGlobalList(instance: LiveDataService) {
        let observable = new Observable(observer => {
            instance.socket.on('global', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        })
        return observable;
    }

    getLocalList(instance: LiveDataService) {
        let observable = new Observable(observer => {
            //console.log(instance.socket);       
            instance.socket.on('local', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        })
        return observable;
    }

   

    getOnlineFriends(instance: LiveDataService) {
        let observable = new Observable(observer => {
            //console.log(instance.socket);       
            instance.socket.on('onlineFriend', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        })
        return observable;
    }

    getNotifications(instance: LiveDataService) {
        let observable = new Observable(observer => {
            //console.log(instance.socket);       
            instance.socket.on('notification', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        })
        return observable;
    }

    getOfflineFriends(instance: LiveDataService) {
        let observable = new Observable(observer => {
            //console.log(instance.socket);       
            instance.socket.on('offlineFriend', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        })
        return observable;
    }
}