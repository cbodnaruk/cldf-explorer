import { dialog } from 'electron'
import * as fs from 'fs/promises'
import path from 'path'
import { CLDFMetadata } from '../../../../types/CLDFSpec.js'
import { initDatasetHandler } from './DatasetHandler.js'

export let metadata: CLDFMetadata

export function openFile(): void{
    dialog.showOpenDialog({
        title:"Open CLDF Dataset",
        filters: [{name:"CLDF Metadata Header",extensions:["json"]}],
        properties:["openFile"]
    }).then(outcome =>{
        if (!outcome.canceled){
            const filePath = outcome.filePaths[0]
            readMetadata(filePath)
            process.env.DIR_PATH = path.dirname(filePath)
        }
    })
}

function readMetadata(path: string): void{
    fs.readFile(path, {encoding: 'utf-8'}).then(data=>{
        metadata = JSON.parse(data)
        initDatasetHandler(metadata)
    })

}