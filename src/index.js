const { app, BrowserWindow } = require('electron');

const path = require('path');
const url = require('url');

let mainWindow;

const windowConfig = {
  width: 400,
  height: 750
};

function createWindow() {
  // Create a browser window
  mainWindow = new BrowserWindow({ width: 400, height: 750});
  mainWindow.setMenu(null);

  // load the index.html file
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file',
    slashes: true
  }));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open dev tools
  mainWindow.webContents.openDevTools();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
