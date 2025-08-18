import { getTable } from "@app/preload"
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import type { ForeignKey, TablewData } from "../../../types/CLDFSpec"

export async function tableClick(e: MouseEvent): Promise<void> {
    const target = e.target as HTMLDivElement
    const tableName: string = target.id
    showTable(tableName)
}

export async function showTable(tableName: string, selectedKey?: string): Promise<void> {

    const tableWrapper = document.querySelector('#table')

    if (tableWrapper) {
        tableWrapper.innerHTML = ""

        const fullTable: TablewData = await getTable(tableName)

        const columns = []
        for (let col of fullTable.metadata.tableSchema.columns) {
            columns.push({ title: col.name, field: col.name, headerFilter: 'input' })
        }

        const grid: Tabulator = new Tabulator('#table', {
            columns: columns,
            pagination: true

        })


        let foreignKeys: ForeignKey[] | undefined = fullTable.metadata.tableSchema.foreignKeys

        grid.on('tableBuilt', () => {
            grid.setData(fullTable.data).then(() => {
                if (selectedKey) {
                    for (let line in fullTable.data) {
                        if (fullTable.data[line].Name == selectedKey) {
                            try {
                                let pageSize = grid.getPageSize()
                                let page = Math.ceil(line/pageSize)
                                grid.setPage(page)
                            } catch (error) {
                                console.log(error)
                            }
                            
                        }
                    }
                }
                linkForeignKeys(grid, foreignKeys)
                
            })
            grid.on('pageLoaded', () => {
                linkForeignKeys(grid, foreignKeys)
            })
            grid.on('dataFiltered', () => {
                linkForeignKeys(grid, foreignKeys)
            })

        });



    }

}
function linkForeignKeys(grid, foreignKeys) {
    if (foreignKeys) {
        for (let key of foreignKeys) {
            let instances = document.querySelector('.tabulator-table')?.querySelectorAll(`[tabulator-field="${key.columnReference[0]}"`) ?? document.querySelectorAll(`[tabulator-field="${key.columnReference[0]}"`)
            for (let cell of instances) {
                cell.classList.add('foreignKey')
                cell.addEventListener('click', (e) => {
                    showTable(key.reference.resource.split('.')[0], cell.textContent)
                })
            }
        }
    }
}