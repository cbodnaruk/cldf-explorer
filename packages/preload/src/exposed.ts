import * as exports from './index.js';
import {contextBridge, ipcRenderer} from 'electron';

const isExport = (key: string): key is keyof typeof exports => Object.hasOwn(exports, key);

for (const exportsKey in exports) {
  if (isExport(exportsKey)) {
    contextBridge.exposeInMainWorld(btoa(exportsKey), exports[exportsKey]);
  }
}

contextBridge.exposeInMainWorld('electronAPI',{
  onDatasetLoad: (callback) => ipcRenderer.on('loaded-message',(_event, value)=> callback(value))
})

// Re-export for tests
export * from './index.js';
