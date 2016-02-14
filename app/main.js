var app = require('app');  // Module to control application life.
app.commandLine.appendSwitch("disable-http-cache");

var BrowserWindow = require('browser-window');  // Module to create native browser window.

/* InterProcess Communication for NodeJS to Browser and back */
const ipcMain = require("electron").ipcMain;

// ----------------------------

// Report crashes to my server.
require('crash-reporter').start({
  productName: 'nodeyt',
  companyName: '2er0',
  submitURL: 'https://github.com/2er0/',
  autoSubmit: true
});

// ------------------- google api ----------

var CLIENT_ID = '';
var API_KEY = '';
var CLIENT_SECRET = '';
var REDIRECT_URL = '';

var accesstoken;

var scopes = [
  'https://www.googleapis.com/auth/plus.me',
  //'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube'
];

var OAUTH2_SCOPES = scopes;
var loadmine = false;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

var google = require('googleapis'); // google api
var oauth2Client;
var youtube;
var plus;

var GoAuth = require('./GoAuth.js');

GoAuth.getKey(function(data) {
  CLIENT_ID = data.CLIENT_ID;
  API_KEY = data.API_KEY;
  CLIENT_SECRET = data.CLIENT_SECRET;
  REDIRECT_URL = data.REDIRECT_URL;
  
  finalApiLoad();
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {

  // Create the browser window.
  mainWindow = new BrowserWindow({width: 600, height: 350});

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    app.quit();
  });
});

// ------------------- ipc interfaces ----------

ipcMain.on('search-string', function (event, arg) {
  youtube.search.list({ q: arg, maxResults: 25, part: 'snippet', type: 'video', videoEmbeddable: true }, function(err, resp) {
    if (err) {
      console.log(err);
      return;
    }
    event.sender.send('search-result', resp);
  });
});

ipcMain.on('load-login', function(event, arg) {
  getAccessToken(function () {
    
    youtube.playlists.list({mine: loadmine, maxResults: 25, part: 'snippet'}, function(err, resp) {
      
      if (err) {
        /*console.log("----------------- err --------------------")*/
        console.log(err);
        return;
        
      } else {
        /*console.log("----------------- resp--------------------")
        console.log(resp);*/
        event.sender.send('playlist-result', resp);
      }
      
    })
    
    plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, resp) {
      if (err) {
        console.log(err);
      } else {
        event.sender.send('personinfo', resp);
      }
    });
  })
});

ipcMain.on('load-playlist', function(event, arg) {
  loadPlaylistDetail(event, arg);
});

ipcMain.on('reload-playlists', function(event, arg) {
  reloadPlaylists(event);
});

ipcMain.on('add-playlist', function(event, arg) {
  youtube.playlists.insert({ part: 'snippet,status', resource: { 
      snippet: {
        title: arg,
        description: 'A private playlist created with YouTube Audio Player'
      },
      status: {
        privacyStatus: 'private'
      }
    }
 }, function(err, resp) {
   if (err) {
     console.log(err);
     return;
   } else {
     /*console.log(resp);*/
     reloadPlaylists(event);
   }
 })
})

ipcMain.on('add-video-to-list', function(event, arg) {
  console.log(arg.videoitem.videoId);
  youtube.playlistItems.insert({ part: 'snippet', resource: {
      snippet: {
        playlistId: arg.playlist.id,
        resourceId: {
          videoId: arg.videoitem.videoId,
          kind: 'youtube#video'
        }
      }
    }, function(err, resp) {
      console.log(err);
      /*console.log(resp);*/
    }
  })
  
  reloadPlaylists(event);
});

// ------------------- functions ---------------

function finalApiLoad() {

  var OAuth2 = google.auth.OAuth2;
  oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
  youtube = google.youtube({ version: 'v3', auth: API_KEY });
  plus = google.plus('v1');
};

function reloadPlaylists(event) {
  youtube.playlists.list({mine: loadmine, maxResults: 25, part: 'snippet'}, function(err, resp) {
      
    if (err) {
      /*console.log("----------------- err --------------------")*/
      console.log(err);
      return;
      
    } else {
      /*console.log("----------------- resp--------------------")
      console.log(resp);*/
      event.sender.send('playlist-result', resp);
    }
    
  })
}

function loadPlaylistDetail(event, arg) {
  
  youtube.playlistItems.list({ part: 'snippet', maxResults: 25, playlistId : arg.id}, function(erritems, respitems) {
            
    if (erritems) {
      /*console.log("->--------------- err -------------");*/
      console.log(erritems);
      return;
      
    } else {
      /*console.log("->--------------- resp--------------------")
      console.log(respitems);*/
      
      var playlist = {thumbnail: arg.snippet.thumbnails.medium.url,
                      title: arg.snippet.title};
      playlist.videoIds = [];
      
      for (var j = 0; j < respitems.items.length; j++) {
        playlist.videoIds.push(respitems.items[j].snippet.resourceId.videoId);
      }
      
      /*console.log(playlist);*/
      
      event.sender.send('playlist', playlist);
    }
  })
}

/*oauth2Client*/
function getAccessToken(callback) {

  var oauthWindow = null;

  // generate consent page url
  var url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // will return a refresh token
    scope: scopes // can be a space-delimited string or an array of scopes
  });

  oauthWindow = new BrowserWindow({ width: 600, height: 600, show: false,
    'node-integration': false });
  oauthWindow.loadURL(url);
  oauthWindow.show();
  oauthWindow.focus();

  oauthWindow.webContents.on('did-finish-load', function (event, url) {
    var title = oauthWindow.webContents.getTitle();
    if (title.indexOf("Success") > -1) {
        var code = title.substring(title.indexOf('code=')+5);
        oauthWindow.close();
        oauthWindow = null;
        oauth2Client.getToken(code,function(err,tokens){
            if(!err){
                oauth2Client.setCredentials(tokens);
                //console.log(tokens);
                youtube = google.youtube({ version: 'v3', auth: oauth2Client }); // set auth as service-level
                //google.options({ auth: oauth2Client }); // set auth as a global default - not working
                loadmine = true;
                callback();
            }
            else {
                console.err("Error" + err);
                loadmine = false;
                callback();
            }
        });
    }
  });
}