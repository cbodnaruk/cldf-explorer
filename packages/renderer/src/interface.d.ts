export interface IElectronAPI {
  onDatasetLoad: (value: any) => Promise<void>,
  onFileClose: (value: any) => Promise<void>
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}