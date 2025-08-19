import { dialog, ipcMain } from 'electron'
import * as fs from 'fs/promises'
import path from 'path'
import { CLDFMetadata } from '../../../../types/CLDFSpec.js'
import { initDatasetHandler } from './DatasetHandler.js'
import Store from 'electron-store';
import { ipcSend } from './WindowManager.js'

const store = new Store();

export let metadata: CLDFMetadata
export let recentFiles: string[] = store.get('recentFiles', []) as string[]


export function openFile(): Promise<boolean> {
    return dialog.showOpenDialog({
        title: "Open CLDF Dataset",
        filters: [{ name: "CLDF Metadata Header", extensions: ["json"] }],
        properties: ["openFile"]
    }).then(outcome => {
        if (!outcome.canceled) {
            const filePath = outcome.filePaths[0]
            if (!recentFiles.includes(filePath)) {
                recentFiles.push(filePath)
                if (recentFiles.length > 5) {
                    recentFiles.shift()
                }
                console.log(recentFiles)
                store.set('recentFiles', recentFiles)
            } else {
                recentFiles.splice(recentFiles.indexOf(filePath), 1)
                recentFiles.push(filePath)
                store.set('recentFiles', recentFiles)
            }

            readMetadata(filePath)
            process.env.DIR_PATH = path.dirname(filePath)
            return true
        } else {
            return false
        }
    })
}

function readMetadata(path: string): void {
    fs.readFile(path, { encoding: 'utf-8' }).then(data => {
        metadata = JSON.parse(data)
        initDatasetHandler(metadata)
    })

}

ipcMain.handle('getRecentFiles', () => { return recentFiles })

ipcMain.handle('openFile', (event, filePath: string) => {
    recentFiles.splice(recentFiles.indexOf(filePath), 1)
    recentFiles.push(filePath)
    store.set('recentFiles', recentFiles)
    readMetadata(filePath)
    process.env.DIR_PATH = path.dirname(filePath)
})

export function closeFile() {
    ipcSend({ message: "Close", channel: "close-message" })
}