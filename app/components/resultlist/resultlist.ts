import {Component, NgZone, Output, EventEmitter} from 'angular2/core';
import {NgFor, NgIf} from 'angular2/common';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {ResultService} from './resultservice';
import {SysCom, ytscontent} from '../syscom';

declare  function require(path: string) : any;
const electron = require('electron');
const ipc = electron.ipcRenderer;

@Component({
  selector: 'resultlist',
  //providers: [ResultService]
  directives: [MATERIAL_DIRECTIVES, NgFor, NgIf],
  templateUrl: 'components/resultlist/resultlist.html',
  styleUrls: ['components/resultlist/resultlist.css']
})

export class Resultlist {
  
  private _result : ResultService;  // result from search over nodeJS
  private _ngZone : NgZone;         // create async zone for results from nodeJS 
  private _syscom : SysCom;         // communication between components
  
  resultlistcontent : Object[] = [];  // result from search over nodeJS
  playlistcontent : Object[] = [];  // available playlist after login
  
  playlists : boolean = false;      // enable add butten after logon
  tutorial : boolean = true; 
  
  // get Services over constructor to current component
  constructor(result : ResultService, zone : NgZone, syscom : SysCom) {
    
    this._result = result;
    // init result list
    this.resultlistcontent = this._result.getList();
    
    this._syscom = syscom;
    
    this._ngZone = zone;
    // todo: beta-test if it works without async-zone
    /*this._ngZone.run(() => {
      setInterval(() => {*/
        this._result._vidresultemitter.subscribe((data) => {
          this.tutorial = false;
          this.resultlistcontent = data;
        })
      /*}, 1000);
    })*/
    
    this._result._plaresultemitter.subscribe((data) => {
      this.playlistcontent = data;
      this.playlists = true;
    })
  }
  
  isEmpty() : boolean {
    if (this.resultlistcontent.length == 0) { 
      return true;
    } else {
      return false;
    }
  }
  // send clicked video infos to player component
  playItem(item : ytscontent) {
    this._syscom.playAudio(item);
  }
  
  addTo(item : Object) {
    item.show = true;
  }
  
  close(item : Object) {
    item.show = false;
  }
  
  addToList(video : Object, list : Object) {
    ipc.send('add-video-to-list', {videoitem: video, playlist: list});
    video.show = false;
  }
}


/*interface Result {
  videoId: string;
  title: string;
  thumbnail: string;
  channel: string;
}*/

    /*result:ResultService,*/
    /*zone:NgZone*/
    //this._result = result;
    //this.getList();
    //this.resultlistcontent = this._result.getList();
    
    /*this._ngZone = zone;
    this._ngZone.run(() => {
      ipc.on('search-result', (event, arg) => {
        this.resultlistcontent = [];
        for (var i = 0; i < arg.pageInfo.resultsPerPage; i ++) {
          var tmpid = arg.items[i].id;
          var tmpsnip = arg.items[i].snippet;
          this.resultlistcontent.push( { videoId: tmpid.videoId, 
                                  title: tmpsnip.title, 
                                  thumbnail: tmpsnip.thumbnails.default.url, 
                                  channel: tmpsnip.channelTitle});
        }
        console.log(this.resultlistcontent);
        
      })
    })*/


  /*getList(){
    let self = this;
	  this.resultlistcontent = this._result.getList();
	};*/
  
  /*ngAfterContentChecked(){
    console.log("afterContentCheck");
    //this.resultlistcontent = this._result.getList();
  }
  
  ngAfterViewChecked(){
    console.log("afterViewCheck");
    //this.resultlistcontent = this._result.getList();
  }*/
  
  
  
  /*private resultlistcontent: Result[] = [{videoId: '', title: 'Resultlist...', thumbnail: '', channel: 'test'},
  {videoId: "ZTVNgzvxoV0", title: "The Best Of Vocal Deep House Chill Out Music 2015", thumbnail: "https://i.ytimg.com/vi/ZTVNgzvxoV0/default.jpg", channel: 'test'}];
  private _ngZone:NgZone;

  constructor(zone:NgZone) {
    console.log(this.resultlistcontent.length);
    this._ngZone = zone;
    this._ngZone.run(() => {
      
    })
  }*/
  
    /*@Output() playsound = new EventEmitter();
  
  private _result : ResultService;
  private _syscom : SysCom;
  private _ngZone : NgZone;
  
  public resultlistcontent : Object[] = [];
  
  constructor(result : ResultService, zone : NgZone, syscom : SysCom) {
    
    this._result = result;
    this.resultlistcontent = this._result.getList();
    
    this._syscom = syscom;
    
    this._ngZone = zone;
    this._ngZone.run(() => {
      setInterval(() => {
        this._result._emitter.subscribe((data) => {
          this.resultlistcontent = data;
        })
      }, 1000);
    })
  }
  
  playItem(item : Object) {
    console.log("result" + item);
    this.playsound.next(item);
    this._syscom.playaudio = item;
    this._syscom.playAudio();
  }
  */