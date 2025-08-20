import * as fs from "fs/promises"
import { CLDFMetadata, TablewData as TablewData, Table, TableMap, ForeignKey, Datum, FKLookupList, FKReference } from "../../../../types/CLDFSpec.js"
import * as csv from 'csv/sync'
import { Data, ipcMain } from "electron"
import { ipcSend } from "./WindowManager.js"
import { send } from "@app/preload"

export var datasetHandler:DatasetHandler

export function initDatasetHandler(metadata:CLDFMetadata){
    datasetHandler = new DatasetHandler(metadata)
}


export class DatasetHandler {
    metadata: CLDFMetadata
    tables: TableMap = {}
    foreignKeyLookupList: FKLookupList = {}
    constructor(metadata:CLDFMetadata){
        this.metadata = metadata
        for (let table of metadata.tables){
                        if (table.tableSchema.foreignKeys){
                for (let key of table.tableSchema.foreignKeys){
                    let tableName = key.reference.resource.split('.')[0]
                    if (!this.foreignKeyLookupList[tableName]){
                        let newList: FKReference[] = []
                        newList.push({foreignKey:key,ownerName:table.url.split('.')[0]})
                        this.foreignKeyLookupList[tableName] = newList;
                    } else {
                        this.foreignKeyLookupList[key.reference.resource.split('.')[0]].push({foreignKey:key,ownerName:table.url.split('.')[0]})
                    }
                }
            }
        }
        for (let table of metadata.tables){

            fs.readFile(`${process.env.DIR_PATH}/${table.url}`).then(tableData=>{
                const parsedData:Object[] = csv.parse(tableData, {
                    columns: true,
                    delimiter:getDelimiter(table,metadata)
                })
                let tableName: string = table.url.split('.')[0]
                let dataTable: TablewData = {metadata:table,data:parsedData,referencedFKs:this.foreignKeyLookupList[tableName],primaryKey:table.tableSchema.primaryKey[0]}
                this.tables[tableName] = dataTable
                if (Object.keys(this.tables).length == metadata.tables.length){
                    this.completeLoading()
                }
            })
        }
    }
    completeLoading():void{
        ipcSend({message:"Loaded",channel:"loaded-message"})
    }
    
    get tableList() : string[] {
        let tableList: string[] = [] 
        for (let table of this.metadata.tables){
            tableList.push(table.url.split('.')[0])
        }
        return tableList
    }
    
    getTable(table:string):TablewData{
        let foreignKeys: ForeignKey[] = this.tables[table].metadata.tableSchema.foreignKeys ?? []
        let clone = structuredClone(this.tables[table])
        if (foreignKeys.length > 0){
            for (let key of foreignKeys){
                let referenceTable = this.tables[key.reference.resource.split('.')[0]]
                let referenceColumn = key.reference.columnReference[0]
                let column = key.columnReference[0]
                let hashMap: Datum = {}
                for (let reference of referenceTable.data){
                    hashMap[reference[referenceColumn]] = reference.Name ?? reference.Value
                }
                for (let line of clone.data){
                    line[column+"_ref"] = line[column]
                    line[column] = hashMap[line[column]]
                    
                }
            }
        }

        return clone
    }
}

function getDelimiter(table: Table, metadata: CLDFMetadata): string{
    if (table.dialect && table.dialect.delimiter){
        return table.dialect.delimiter
    } else if (metadata.dialect && metadata.dialect.delimiter){
        return metadata.dialect.delimiter
    } else {
        return ","
    }
}

ipcMain.handle('getTableList',()=>{return datasetHandler.tableList})
ipcMain.handle('getTable',(event,table:string)=>{return datasetHandler.getTable(table)})