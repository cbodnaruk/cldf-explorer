import './style.css'
import 'tabulator-tables/dist/css/tabulator_semanticui.css'
import { getTableList } from '@app/preload'
import { tableListBoxItem } from './components'

const tableListBox: HTMLElement | null = document.getElementById("tableList")


window.electronAPI.onDatasetLoad(async () => loadTables(await getTableList()))

function loadTables(tableList: string[]): void {
  for (let table of tableList) {
    tableListBox?.appendChild(tableListBoxItem(table))

  }
}


