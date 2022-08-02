export interface IElectronAPI {
    openExternalWindow:     (url: string) => void
    openNewWindow:          (url: string, width: number, height: number) => void
    closeWindow:            () => void
    openDirectory:          (path: string) => void
    openFile:               (path: string) => void
    openFileDialog:         (extensions: string[]) => void
    uploadFile:             (path: string, file: any) => void
    copyFile:               (source: string, target: string) => void
    openPathDialog:         () => void
    addFileListener:        (f: (s: string) => void) => void
    addPathListener:        (f: (s: string) => void) => void
    removeFileListener:     (f: (s: string) => void) => void
    removePathListener:     (f: (s: string) => void) => void
    storeData:              (key: string, value: any) => void
    retrieveData:           (key: string) => any
    addDataListener:        (f: (data: { key: string, value: any }) => void) => void
    removeDataListener:     (f: (data: { key: string, value: any }) => void) => void
    createProjectFiles:     (name: string, location: string, width: number, height: number, framerate: number, world: string, imgui: boolean, tracy: boolean) => void
    deleteProject:          (id: string, path: string) => void
    validateProjects:       (projects: any) => void
    parseProjectFile:       (path: string) => void
    updateProjectFile:      (project: any) => void
    installProject:         (path: string) => void
    addStdoutListener:      (f: (s: string) => void) => void
    addStatusListener:      (f: (s: number) => void) => void
    addProcessListener:     (f: (s: number) => void) => void
    removeStdoutListener:   (f: (s: string) => void) => void
    removeStatusListener:   (f: (s: number) => void) => void
    removeProcessListener:  (f: (s: number) => void) => void
    killProcess:            (pid: number) => void
}
  
declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}
