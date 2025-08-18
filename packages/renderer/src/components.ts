import { tableClick } from "./behaviours"

export function tableListBoxItem(tableName:string):HTMLElement{
    const item: HTMLElement = document.createElement('div')
    item.classList.add('tableListBoxItem')
    item.id = tableName
    item.textContent = tableName

    item.addEventListener('click',tableClick)
    return item
}


