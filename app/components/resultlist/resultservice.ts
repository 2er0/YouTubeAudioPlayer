import {Injectable, EventEmitter} from 'angular2/core';
import {ytscontent} from '../syscom';

const electron = require('electron');
const ipc = electron.ipcRenderer;

@Injectable()
export class ResultService{
  
  // video search results from nodeJS
  _vidresultemitter : EventEmitter<any>;
  // playlist search result from nodeJS
  _plaresultemitter : EventEmitter<any>;
  
  resultlistcontent : ytscontent[] = [];
  
  playlistcontent : Object[] = [];
  
  constructor() {
    
    
    this._vidresultemitter = new EventEmitter();
    this._vidresultemitter.emit(null);
    
    this._plaresultemitter = new EventEmitter();
    this._plaresultemitter.emit(null);
    
    //test data
    //this.resultlistcontent.push({videoId: '', title: 'Resultlist...', thumbnail: '', channel: 'test'});
    //this.resultlistcontent.push({videoId: "ZTVNgzvxoV0", title: "The Best Of Vocal Deep House Chill Out Music 2015", 
                                  //thumbnail: "https://i.ytimg.com/vi/ZTVNgzvxoV0/default.jpg", channel: 'test'});
    
    ipc.on('search-result', (event, arg) => {
        this.resultlistcontent = [];
        for (var i = 0; i < arg.pageInfo.resultsPerPage; i ++) {
          
          var tmpid = arg.items[i].id;
          
          if (typeof(tmpid.videoId) !== "undefined") {
          
            var tmpsnip = arg.items[i].snippet;
            var titlelong = tmpsnip.title;
            
            var content : ytscontent = {videoId: tmpid.videoId, 
                                    title: titlelong, 
                                    thumbnail: tmpsnip.thumbnails.default.url, 
                                    channel: tmpsnip.channelTitle,
                                    type: 'video'};
                                    
            this.resultlistcontent.push(content);
          }
        }
        
        this._vidresultemitter.next(this.resultlistcontent);
      })
      
      ipc.on('playlist-result', (event, arg) => {
        this.playlistcontent = [];
        for (var i = 0; i < arg.items.length; i++) {
          this.playlistcontent.push({ id: arg.items[i].id, title: arg.items[i].snippet.title, show: false });
        }
        this._plaresultemitter.next(this.playlistcontent);
      })
  }
  
  getList(){
    return this.resultlistcontent;
  }
  
}
