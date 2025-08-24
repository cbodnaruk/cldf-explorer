export interface CLDFMetadata {
    tables: Table[]
    "dc:conformsTo": string
    "@context": [string, Context]
    "dc:bibliographicCitation"?: string
    "dc:description"?: string
    "dc:identifier"?: string
    "dc:license"?: string
    "dc:source"?: string
    "dc:title": string
    "dcat:accessURL"?: string
    "prov:wasDerivedFrom"?: ProvWasDerivedFrom[]
    "prov:wasGeneratedBy"?: ProvWasGeneratedBy[]
    "rdf:ID"?: string
    "rdf:type"?: string
    "dc:isVersionOf"?:string
    aboutUrl?:any
    "dc:related"?: any
    "dc:format"?: string[]
    [key: string]: any
    dialect?: Dialect
}

export interface TablewData {
    metadata:Table
    data:Datum[]
    referencedFKs?: FKReference[]
    primaryKey:string
}

export interface Datum {
    [key: string]: any
}

export interface TableMap {
    [key: string]: TablewData
}



export interface Dialect {
  encoding?: string
  lineTerminators?: string[]
  quoteChar?: string
  doubleQuote?: boolean
  skipRows?: number
  commentPrefix?: string
  header?: boolean
  headerRowCount?: number
  delimiter?: string
  skipColumns?: number
  skipBlankRows?: boolean
  skipInitialSpace?: boolean
  trim?: boolean
}

export interface Context {
    "@language": string
}

export interface ProvWasDerivedFrom {
    "rdf:about": string
    "rdf:type": string
    "dc:created": string
    "dc:title": string
}

export interface ProvWasGeneratedBy {
    "rdf:about"?: string
    "rdf:type"?: string
    "dc:created"?: string
    "dc:title"?: string
    "dc:description"?: string
    "dc:relation"?: string
}

export interface Table {
    "dc:conformsTo"?: string
    "dc:extent": number
    tableSchema: TableSchema
    url: string
    "dc:description"?: string
    aboutUrl?: string
    dialect?: Dialect
}

export interface TableSchema {
    columns: Column[]
    foreignKeys?: ForeignKey[]
    primaryKey: string[]
}

export interface Column {
    datatype: any
    propertyUrl?: string
    required?: boolean
    name: string
    "dc:extent"?: string
    null?: string[]
    "dc:description"?: string
    aboutUrl?: string
    separator?: string
    valueUrl?: string
}

export interface ForeignKey {
    columnReference: string[]
    reference: Reference
}

export interface Reference {
    resource: string
    columnReference: string[]
}

export interface FKLookupList {
    [key: string]: FKReference[]
}

export interface FKReference {
    foreignKey: ForeignKey
    ownerName: string
}