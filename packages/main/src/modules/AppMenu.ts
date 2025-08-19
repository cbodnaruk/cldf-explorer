import { app, Menu, MenuItemConstructorOptions } from 'electron';
import { closeFile, openFile } from './FileHandler.js';



const MenuTemplate: MenuItemConstructorOptions[] = [

  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
        {
            label: 'Open Dataset',
            click: openFile
        },
        {label: "Close Dataset",
          click: closeFile
        },
      { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      { role: 'close' }

    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://electronjs.org')
        }
      }
    ]
  }
]

export const AppMenu = Menu.buildFromTemplate(MenuTemplate)