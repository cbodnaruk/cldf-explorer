import './style.css'
import './tabulator_semanticui.css'
import { getTableList } from '@app/preload'
import { showRecentFiles, tableListBoxItem, welcomeScreen } from './components'


export var showReferenceLinks: boolean = false



document.querySelector('main')?.appendChild(welcomeScreen())

showRecentFiles()

const tableListBox: HTMLElement | null = document.getElementById("tableList")


window.electronAPI.onDatasetLoad(async () => loadTables(await getTableList()))
window.electronAPI.onFileClose(()=>{window.location.reload()})


function loadTables(tableList: string[]): void {
  if (tableListBox) tableListBox.innerHTML = ""
  for (let table of tableList) {
    tableListBox?.appendChild(tableListBoxItem(table))
    document.querySelector('.welcomeScreen')?.remove()
  }
}

