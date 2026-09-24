const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs/promises');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// === Задание 3: чтение каталога ===
ipcMain.handle('list-dir', async (event, dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries.map(e => ({ name: e.name, isDir: e.isDirectory() }));
});

// === Задание 4, вариант 1: диалог выбора каталога ===
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: 'Выберите каталог'
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});