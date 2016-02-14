import {Component, View, NgZone, EventEmitter} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {NgIf} from 'angular2/common';
import {SysCom, ytscontent} from '../syscom';

declare var YT:any; // Magic - enables to use YouTube Iframe API

@Component({
  selector: 'player'
})
@View({
  directives: [MATERIAL_DIRECTIVES, NgIf],
  templateUrl: 'components/player/player.html',
  styles: [`
    [md-button] {
      margin: 0 0 0 0;
      padding: 8px 4px;
    }
    input[type="range"] {
      -webkit-appearance: none;
      width: 80px;
      height: 2px;
      background: #3f51b5;
      margin: auto;
    }
  `]
})

export class Player {
  
  private _syscom : SysCom;
  private _ngZone : NgZone;
  
  playeraktive : boolean = false;
  playstop : boolean = true;
  mute : boolean = false;
  playlist : boolean = false;
  shuffle : boolean = true;
  
  errorbox : boolean = false;
  errorcontent : string = "";
  
  playtoaudio : ytscontent;
  playlistaudio : Object = {};
  
  thumbnail : string = "";
  title : string = "";
  
  ytelement : any;
  ytcontent : any;
  
  
  constructor(syscom : SysCom,  zone : NgZone) {
    
    //this.playtoaudio = {videoId: ""};
    
    this._syscom = syscom;
    this._syscom._play.subscribe((data) => {
      this.setUpPlayer(data);
    })
    
    this._syscom._playlist.subscribe((data) => {
      this.setUpPlaylistPlay(data);
    })
    
    this._ngZone = zone;
    
    // use magic and create YouTube Iframe Player Object
    setTimeout(() => {
      this.ytcontent = new YT.Player('ytcontent', {
            height: '315',
            width: '500',
            videoId: '',
            events: {
              'onReady': this.onPlayerReady(),
              'onStateChange': this.onPlayerStateChange()
              //'onError' : this.displayError()
            }
      });
      
      // get every 2 seconds a status from the YouTube Object
      this._ngZone.run(() => {
        setInterval(() => {
          if (this.ytcontent.getPlayerState() == "-1") {
            this.displayError();
          } else {
            this.errorbox = false;
          }
        }, 2000)
      });
    }, 1000);
  }
  
  onPlayerReady() {
    
  }
    
  onPlayerStateChange() {
    
  }
  
  // hack - get Error-Info fram Iframe content
  displayError() {
    
    if (!this.errorbox) {
      
      this.errorbox = true;
      
      var ytelement = document.getElementsByTagName("iframe");
      if (ytelement.length > 0) {
        var tmp = ytelement[0].contentWindow.document.getElementsByClassName("ytp-error-content-wrap")
        this.errorcontent = tmp[0].childNodes[0].childNodes[0].nodeValue; 
      }
    }
    
    if (this.playlist) {
      this.ytcontent.nextVideo();
    }
  }
  
  // jump 30 seconds forward
  jumpforward() {
    this.ytcontent.seekTo(this.ytcontent.getCurrentTime() + 30);
  }
  
  // jump 30 seconds backward
  jumpbackward() {
    this.ytcontent.seekTo(this.ytcontent.getCurrentTime() - 30);
  }
  
  // inc Volume by 10%
  setVolumeUp() {
    this.ytcontent.setVolume(this.ytcontent.getVolume() + 10);
  }
  
  // dec Volume by 10%
  setVolumeDown() {
    this.ytcontent.setVolume(this.ytcontent.getVolume() - 10);
  }
  
  // play paused video
  play() {
    this.playstop = true;
    // old hack
    //this.ytcontent.postMessage('{"event":"command","func":"playVideo","args":""}','*');
    this.ytcontent.playVideo();
  }
  
  // pause playing video
  pause() {
    this.playstop = false;
    this.ytcontent.pauseVideo();
  }
  
  // mute volume
  volmute() {
    this.mute = true;
    this.ytcontent.mute();
  }
  
  // unmute volume
  unvolmute() {
    this.mute = false;
    this.ytcontent.unMute();
  }
  
  // play next video from playlist
  next() {
    this.ytcontent.nextVideo();
  }
  
  // play prev video from playlist
  prev() {
    this.ytcontent.previousVideo();
  }
  
  // set loop for playlist to true, is set by playlist play start
  loopPlaylist() {
    this.ytcontent.setLoop(true);
  }
  
  // shuffle playlist 
  shufflePlaylist() {
    this.shuffle = !this.shuffle;
    this.ytcontent.setShuffle(this.shuffle);
  }
  
  // start play of given video content
  setUpPlayer(item : ytscontent) {
    this.errorbox = false;
    this.playeraktive = true;
    this.shuffle = false;
    
    this.ytcontent.loadVideoById(item.videoId);
    this.playtoaudio = item;
    this.thumbnail = item.thumbnail;
    this.title = item.title;
    this.playlist = false;
    this.ytcontent.setLoop(false);
    this.ytcontent.setShuffle(this.shuffle);
  }
  
  // start playing of playlist in loop
  setUpPlaylistPlay(item : Object) {
    this.shuffle = true;
    
    this.playlistaudio = item;
    this.ytcontent.loadPlaylist(item.videoIds);
    this.thumbnail = item.thumbnail;
    this.title = "Playlist: " + item.title;
    this.playeraktive = true;
    this.playlist = true;
    this.ytcontent.setLoop(true);
    this.ytcontent.setShuffle(this.shuffle);
  }
  
}