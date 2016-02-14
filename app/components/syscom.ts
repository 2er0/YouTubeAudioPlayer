import {Injectable, EventEmitter} from 'angular2/core';

const electron = require('electron');
const ipc = electron.ipcRenderer;

export interface ytscontent {
  videoId: string;
  title: string;
  thumbnail: string;
  channel: string;
  type: string;
}

@Injectable()
export class SysCom {
  
  _play : EventEmitter<any>;
  _playlist: EventEmitter<any>;
  toplay : Object;
  toplaylist: Object;
  
  constructor() {
    
    this._play = new EventEmitter();
    this._play.emit(null);
    
    this._playlist = new EventEmitter();
    this._playlist.emit(null);
    
    ipc.on('playlist', (event, arg) => {
      this.toplaylist = arg;
      this._playlist.next(this.toplaylist);
    })
    
  }
  
  playAudio(item : ytscontent) {
    this.toplay = item;
    this._play.next(this.toplay);
  }
  
  getToPlay() {
    return this.toplay;
  }
  
}