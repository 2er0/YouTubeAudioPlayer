import {Injectable, EventEmitter} from 'angular2/core';
//import {ytscontent} from '../syscom';

declare  function require(path: string) : any;
const electron = require('electron');
const ipc = electron.ipcRenderer;

@Injectable()
export class PlaylistService{
  
  // playlist result from nodeJS
  _plaresultemitter : EventEmitter<any>;
  // person info rom nodeJS G+
  _pmitter : EventEmitter<any>;
  playlistcontent : Object[] = [];
  
  constructor() {
    
    this._plaresultemitter = new EventEmitter();
    this._plaresultemitter.emit(null);
    
    this._pmitter = new EventEmitter();
    this._pmitter.emit(null);
    
    ipc.on('playlist-result', (event, arg) => {
        this.playlistcontent = [];
        //console.log(arg);
        this.playlistcontent = arg;
        
        this._plaresultemitter.next(this.playlistcontent);
      })
      
    ipc.on('personinfo', (event, arg) => {
      this._pmitter.next(arg);
    })
  }
  
  getList(){
    return this.playlistcontent;
  }
  
}