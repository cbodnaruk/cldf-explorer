import { on } from 'node:events';
import * as exports from './index.js';
import {contextBridge, ipcRenderer} from 'electron';

const isExport = (key: string): key is keyof typeof exports => Object.hasOwn(exports, key);

for (const exportsKey in exports) {
  if (isExport(exportsKey)) {
    contextBridge.exposeInMainWorld(btoa(exportsKey), exports[exportsKey]);
  }
}

contextBridge.exposeInMainWorld('electronAPI',{
  onDatasetLoad: (callback: (value: any) => void) => ipcRenderer.on('loaded-message',(_event, value)=> callback(value)),
  onFileClose: (callback: (value: any) => void) => ipcRenderer.on('close-message',(_event, value)=> callback(value)),
})

// Re-export for tests
export * from './index.js';
