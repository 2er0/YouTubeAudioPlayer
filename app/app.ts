///<reference path="../node_modules/angular2/typings/browser.d.ts"/>

import {bootstrap} from 'angular2/platform/browser';
import {Component/*, View*/, NgZone, ViewEncapsulation} from 'angular2/core';
import {NgFor} from 'angular2/common';
import {MATERIAL_DIRECTIVES} from "ng2-material/all";

import {Resultlist} from './components/resultlist/resultlist';
import {Search} from './components/search/search';
import {Player} from './components/player/player';
import {Sidebar} from './components/sidebar/sidebar';
import {ResultService} from './components/resultlist/resultservice';
import {SysCom} from './components/syscom';
import {PlaylistService} from './components/sidebar/sidebarservice';

declare  function require(path: string) : any;
const electron = require('electron');
//import * as ipc from 'electron-ipc-tunnel';
//import IpcClient from "electron-ipc-tunnel/client";
//const IPcClient = require('electron-ipc-tunnel');
const ipc = electron.ipcRenderer;
//const ipc = new IpcClient();

@Component({
  selector: 'app',
  directives: [Search, Resultlist, Player, Sidebar, MATERIAL_DIRECTIVES],
  encapsulation: ViewEncapsulation.None,
  template: ` 
    <md-content id="tabing">
      <md-tabs md-dynamic-height md-border-bottom>
        <template md-tab label="YouTube Audio">
          <md-content class="md-padding">
            <search></search>
            <resultlist></resultlist> 
          </md-content>
        </template>
        <template md-tab label="Settings">
          <md-content class="md-padding">
            <sidebar id="SidebarMain"></sidebar>
          </md-content>
        </template>
      </md-tabs>
    </md-content>
    <player id="PlayerMain"></player>
  ` ,
  styles: [`
    #tabing {
      height: calc(100% - 90px);
      width: 100%;
      overflow: hidden;
    }
    search {
      width: 100%;
      height: 76px;
    }
    #SidebarMain {
      /*max-height: 270px;
      height: calc(100% - 90px);*/
    }
    #PlayerMain {
      margin: 5px;
      height: 80px;
    }
  `]
})

export class App {

  constructor() {}
}

bootstrap(App, [ResultService, SysCom, PlaylistService]);