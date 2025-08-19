import { getTable, sendOpenRecentFile, showFileOpen } from "@app/preload"
import { TabulatorFull as Tabulator, type ColumnDefinition, type ColumnLookup } from 'tabulator-tables';
import type { ForeignKey, TablewData } from "../../../types/CLDFSpec"
import { contextMenu } from "./components";

export async function tableClick(e: MouseEvent): Promise<void> {
    const target = e.target as HTMLDivElement
    const tableName: string = target.id
    showTable(tableName,{})
}

let grid: Tabulator

interface showTableOptions {
    selectedKey?: string
    initialFilter?: filter
}



export async function showTable(tableName: string, opts: showTableOptions): Promise<void> {
    
    const tableWrapper = document.querySelector('#table')

    if (tableWrapper) {
        tableWrapper.innerHTML = ""

        const fullTable: TablewData = await getTable(tableName)

        const columns = []
        for (let col of fullTable.metadata.tableSchema.columns) {
            let colDef: ColumnDefinition = {title: col.name, field: col.name, headerFilter: 'input' }
            columns.push(colDef)
        }

        grid = new Tabulator('#table', {
            columns: columns,
            pagination: true

        })

        if (fullTable.referencedFKs) {
            let attrString: string = ""
            for (let fk of fullTable.referencedFKs) {
                attrString += fk.ownerName + ":" + fk.foreignKey.columnReference[0] + ","
            }
            document.getElementById("table")?.setAttribute('referencedFKs', attrString)
        }
        let foreignKeys: ForeignKey[] | undefined = fullTable.metadata.tableSchema.foreignKeys

        grid.on('tableBuilt', () => {
            grid.setData(fullTable.data).then(() => {
                if (opts) {
                    if (opts.selectedKey) {
                        for (let line in fullTable.data) {
                            if (fullTable.data[line].Name == opts.selectedKey) {
                                try {
                                    let pageSize = grid.getPageSize() as number
                                    let page: number = Math.ceil(parseInt(line) / pageSize)
                                    grid.setPage(page)
                                } catch (error) {
                                    console.log(error)
                                }

                            }
                        }
                    }
                    linkForeignKeys(foreignKeys)
                    if (opts.initialFilter) {
                        grid.setHeaderFilterValue(opts.initialFilter.field, opts.initialFilter.value)
                    }
                }
            })
            grid.on('pageLoaded', () => {
                linkForeignKeys(foreignKeys)
            })
            grid.on('dataFiltered', () => {
                linkForeignKeys(foreignKeys)
            })

        });



    }

}


function linkForeignKeys(foreignKeys?: ForeignKey[]) {
    if (foreignKeys) {
        for (let key of foreignKeys) {
            let instances = document.querySelector('.tabulator-table')?.querySelectorAll(`[tabulator-field="${key.columnReference[0]}"`) ?? document.querySelectorAll(`[tabulator-field="${key.columnReference[0]}"`)
            for (let cell of instances) {
                cell.classList.add('foreignKey')
                cell.addEventListener('click', () => {
                    showTable(key.reference.resource.split('.')[0]??'', { selectedKey: cell.textContent ?? undefined })
                })
            }
        }
    }
}

export function openFile() {
    showFileOpen().then((success: boolean) => {
        if (!success) {
            console.log("File open failed");

        } else {
            document.querySelector('.welcomeScreen')?.remove()
        }
    })
}

document.addEventListener('contextmenu', (e) => {
    document.querySelector('.contextMenu')?.remove()

    const menu = contextMenu(e)
    console.log(e);

    menu.style.top = e.clientY + 'px'
    menu.style.left = e.clientX + 'px'
    document.body.append(menu)
    document.addEventListener('click', hideMenu)

})

function hideMenu() {
    document.querySelector('.contextMenu')?.remove()
    document.removeEventListener('click', hideMenu)
}

export function filterByValue(e: Event) {
    let target = e.target as HTMLElement & {coreTarget: HTMLElement}
    let field: ColumnLookup = target.coreTarget.getAttribute('tabulator-field') ?? ''
    let value = target.coreTarget.textContent ??''

    console.log(field, value);


    grid.setHeaderFilterValue(field, value)

    console.log(e);

}

export function testMenu(e: Event) {
    console.log(e);

}

export function openReference(e: Event) {
    let target = e.target as HTMLElement & {coreTarget?: HTMLElement}
    target.coreTarget?.click()

}

interface filter {
    field: string,
    value: string

}

export async function openChildReference(e: Event) {
    let target = e.target as HTMLElement & {coreTarget?: HTMLElement}
    let reference = target.getAttribute('itemReference')
    if (reference) {
        let tableReference = reference.split(":")[0]
        let fieldReference = reference.split(":")[1]
        await showTable(tableReference, { initialFilter: { field: fieldReference, value: target.coreTarget?.textContent ?? '' } })
    }
}

export function openRecentFile(e:Event){
    let target = e.target as HTMLElement
    let path = target.getAttribute('fullPath') ?? ""
    sendOpenRecentFile(path)

}