import {Component, View} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';

const electron = require('electron');
const ipc = electron.ipcRenderer;

@Component({
  selector: 'search'
})
@View({
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