import {sha256sum} from './nodeCrypto.js';
import {versions} from './versions.js';
import {ipcRenderer} from 'electron';
import { type TablewData } from '../../../types/CLDFSpec.js';

function send(channel: string, message: string) {
  return ipcRenderer.invoke(channel, message);
}

export function getTableList():Promise<string[]>{
  return send('getTableList','')
}

export function getTable(name:string):Promise<TablewData>{
  return send('getTable',name)
}

export function showFileOpen():Promise<boolean>{
  return send('showFileOpen', '')
}

export function getRecentFiles():Promise<string[]>{
  return send('getRecentFiles','')
}

export function sendOpenRecentFile(filePath:string){
  return send('openFile',filePath)
}

export {sha256sum, versions, send};
