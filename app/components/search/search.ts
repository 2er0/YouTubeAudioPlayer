import {Component} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';

declare  function require(path: string) : any;
const electron = require('electron');
const ipc = electron.ipcRenderer;

@Component({
  selector: 'search',
  directives: [MATERIAL_DIRECTIVES],
  templateUrl: 'components/search/search.html',
  styleUrls: ['components/search/search.css']
})

export class Search {

  values='';
  
  constructor() {}
    
  onKey(value:string) {
    this.values = value;
    
    /* start search after enter-key-up with Google YouTube API in NodeJS */
    ipc.send('search-string', this.values);
  } 
}