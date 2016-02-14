import {Component, View} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {NgIf, NgFor} from 'angular2/common';
import {PlaylistService} from './sidebarservice';
import {SysCom} from '../syscom';

const electron = require('electron');
const ipc = electron.ipcRenderer;

@Component({
  selector: 'sidebar'//,
  //providers: [PlaylistService]
})
@View({
  directives: [MATERIAL_DIRECTIVES, NgIf, NgFor],
  templateUrl: 'components/sidebar/sidebar.html',
  styleUrls: ['components/sidebar/sidebar.css']
})

export class Sidebar {
  
  private _syscom : SysCom;
  private _playlist : PlaylistService;
  
  login : boolean = false;
  handleprofile : boolean = false;
  displayadd : boolean = false;
  
  profilepic : string = "";
  
  playlists : Object = {};
  person : Object = {};

  constructor(playlist : PlaylistService, syscom : SysCom) {
    
    this._syscom = syscom;
    
    this._playlist = playlist;
    this._playlist._plaresultemitter.subscribe((data) => {
      this.playlists = data;
    })
    
    this._playlist._pmitter.subscribe((data) => {
      this.person = data;
      this.login = true;
      this.profilepic = data.image.url;
    })
    
  }
  
  // open googel oauth login
  loadlogin() {
    ipc.send('load-login', null);
  }
  
  // load playlist new
  playList(item : Object) {
    ipc.send('load-playlist', item);
  }
  
  // display options
  handleprof() {
    this.handleprofile = !this.handleprofile;
  }
  
  // display input box for new playlist name
  addPlaylist() {
    this.displayadd = true;
    setTimeout(function() {
      document.getElementById('addbox').focus();
    }, 500);
  }
  
  // save new created playlist
  addList(value : string) {
    ipc.send('add-playlist', value);
    this.displayadd = false;
    this.handleprof();
  }
  
  // escape - stop creating new playlist
  cancelList() {
    this.displayadd = false;
  }
  
  // load playlists new
  reloadplaylists() {
    ipc.send('reload-playlists', null);
    this.handleprofile = !this.handleprofile;
  }
  
  // handle logout
  logout() {
    this.login = false;
    this.handleprofile = false;
    this.playlists = {};
    this.person = {};
    
  }
}