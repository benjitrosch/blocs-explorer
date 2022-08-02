const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    openExternalWindow: (url) => {
        ipcRenderer.send('window:external', { url })
    },

    openNewWindow: (url, width, height) => {
        ipcRenderer.send('window:open', { url, width, height })
    },

    closeWindow: () => {
        ipcRenderer.send('window:close')
    },

    openDirectory: (path) => {
        ipcRenderer.send("path:open", { path })
    },

    openPathDialog: () => {
        ipcRenderer.send("path:get")
    },

    openFile: (path) => {
        ipcRenderer.send("file:open", { path })
    },

    openFileDialog: (extensions) => {
        ipcRenderer.send("file:get", { extensions })
    },

    uploadFile: (path, file) => {
        ipcRenderer.send("file:new", { path, file })
    },

    copyFile: (source, target) => {
        ipcRenderer.send("file:copy", { source, target })
    },

    addFileListener: (f) => {
        ipcRenderer.on("file:selected", (_, path) => {
            if (path && path.length) {
                f(path[0])
            } else {
                f("")
            }
        })
    },
    
    removeFileListener: (f) => {
        ipcRenderer.off("file:selected", (_, path) => {
            f(path[0])
        })  
    },

    addPathListener: (f) => {
        ipcRenderer.on("path:selected", (_, path) => {
            if (path && path.length) {
                f(path[0])
            } else {
                f("")
            }
        })
    },
    
    removePathListener: (f) => {
        ipcRenderer.off("path:selected", (_, path) => {
            f(path[0])
        })  
    },

    storeData: (key, value) => {
        ipcRenderer.send("data:set", { key, value })
    },

    retrieveData: (key) => {
        ipcRenderer.send("data:get", { key })
    },

    addDataListener: (f) => {
        ipcRenderer.on('data:found', (_, data) => {
            f(data)
        })
    },

    removeDataListener: (f) => {
        ipcRenderer.off('data:found', (_, data) => {
            f(data)
        })
    },

    createProjectFiles: (name, location, width, height, framerate, world, imgui, tracy) => {
        ipcRenderer.send("project:new", { name, location, width, height, framerate, world, imgui, tracy })
    },

    deleteProject: (id, path) => {
        ipcRenderer.send("project:delete", { id, path })
    },

    validateProjects: (projects) => {
        ipcRenderer.send("project:validate", { projects })
    },

    parseProjectFile: (path) => {
        ipcRenderer.send("project:add", { path })
    },

    updateProjectFile: (project) => {
        ipcRenderer.send("project:update", { project })
    },

    installProject: (path) => {
        ipcRenderer.send("project:install", { path })
    },

    addStdoutListener: (f) => {
        ipcRenderer.on('shell:stdout', (_, data) => {
            f(data)
        })
    },

    removeStdoutListener: (f) => {
        ipcRenderer.off('shell:stdout', (_, data) => {
            f(data)
        })
    },

    addStatusListener: (f) => {
        ipcRenderer.on('shell:status', (_, data) => {
            f(data)
        })
    },

    removeStatusListener: (f) => {
        ipcRenderer.off('shell:status', (_, data) => {
            f(data)
        })
    },

    addProcessListener: (f) => {
        ipcRenderer.on('shell:created', (_, data) => {
            console.log(data)
            f(data)
        })
    },

    removeProcessListener: (f) => {
        ipcRenderer.off('shell:created', (_, data) => {
            f(data)
        })
    },

    killProcess: (pid) => {
        ipcRenderer.send("shell:kill", { pid })
    },
})
