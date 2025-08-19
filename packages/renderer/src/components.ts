import { getRecentFiles } from "@app/preload"
import { filterByValue, openChildReference, openFile, openRecentFile, openReference, tableClick } from "./behaviours"

export function tableListBoxItem(tableName:string):HTMLElement{
    const item: HTMLElement = document.createElement('div')
    item.classList.add('tableListBoxItem')
    item.id = tableName
    item.textContent = tableName

    item.addEventListener('click',tableClick)
    return item
}

export function welcomeScreen():HTMLElement{
    const screen: HTMLDivElement = document.createElement('div')
    screen.classList.add('welcomeScreen')

    const header: HTMLHeadingElement = document.createElement('h1')
    header.textContent = 'Welcome'

    const subheader: HTMLHeadingElement = document.createElement('h3')
    subheader.textContent = 'To get started, open a CLDF metadata file:'

    const openButton:HTMLButtonElement = document.createElement('button')
    openButton.textContent = 'Open File...'
    openButton.addEventListener('click',openFile)

    screen.append(header,subheader,openButton)
    return screen
}

export function contextMenu(e:Event):HTMLDivElement{
    let target = e.target as HTMLElement

    const contextMenu = document.createElement('div')
    contextMenu.classList.add('contextMenu')

    const menuHeader = document.createElement('h3')
    menuHeader.textContent = target.textContent
    contextMenu.appendChild(menuHeader)

    var location:string
    interface ContextMenuItem {
        text: string,
        does: Function,
        id?: string
    }
    var items:ContextMenuItem[] = []
    if (target.classList.contains('foreignKey')){
        location = 'fkcell'
        items = [
            {text: "Filter by value", does: filterByValue},
            {text: "Open parent reference", does: openReference}
        ] 
    } else if (target.classList.contains('tabulator-cell')){
        location = 'cell'
        items = [
            {text: "Filter by value", does: filterByValue}
        ] 
    } else {
        location = 'other'
            items = [
            {text: "Reload app",does:reload}
        ]
        function reload(){
            window.location.reload()
        }
        menuHeader.style.display = 'none'
    }

    if (document.getElementById("table")?.getAttribute('referencedfks') && location != 'other'){
        let references = document.getElementById("table")?.getAttribute('referencedFKs')?.split(',')
        if (references) for (let reference of references){
            if (reference != '') items.push({
                text: `See references in table: ${reference.split(':')[0]}`,
                does: openChildReference,
                id: reference
            })
        }
    }

    const menuList = document.createElement('ul')
    menuList.classList.add('menuList')

        


    for (let item of items){
        const listItem : HTMLElement & {coreTarget?: HTMLElement} = document.createElement('li') 
        listItem.textContent = item.text
        listItem.addEventListener('click', item.does as EventListenerOrEventListenerObject)
        listItem.coreTarget = target
        listItem.setAttribute('itemReference',item.id ?? '')
        menuList.appendChild(listItem)
    }
    contextMenu.appendChild(menuList)

    return contextMenu

}

export async function showRecentFiles(){
  let recentFiles = await getRecentFiles()
  recentFiles.reverse()

  const recentBox = document.createElement('div')
  recentBox.classList.add('recentBox')

  const recentList = document.createElement('ul')
  recentList.classList.add('recentList')

  for (let file of recentFiles){
    const item = document.createElement('li')
    let trimmedPath = ".../"+file.split("/").slice(-3).join("/")
    item.textContent = trimmedPath
    item.setAttribute('fullPath',file)
    item.addEventListener('click',openRecentFile)
    recentList.appendChild(item)
  }

  const recentListHeading = document.createElement('h3')
  recentListHeading.textContent = 'Recent files'

  recentBox.append(recentListHeading,recentList)
  document.querySelector('.welcomeScreen')?.appendChild(recentBox)

}
