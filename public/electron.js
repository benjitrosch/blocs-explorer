const {
    app,
    ipcMain,
    protocol,
    dialog,
    shell,
    BrowserWindow,
}               = require('electron')
const Store     = require('electron-store')
const path      = require('path')
const fs        = require('fs')
const os        = require('os')
const cp        = require("child_process")
const isDev     = require('electron-is-dev')
const uuid      = require('uuid')
const nodePlop  = require('node-plop')

// const server    = require('./server')

require('@electron/remote/main').initialize()

let window = null
let store  = null
let activeProcesses = []

const setup = () => {
    window = createNewWindow("", 960, 540, 640, 360)
    store = new Store()

    protocol.registerFileProtocol('file', (request, callback) => {
        const pathname = decodeURI(request.url.replace('file:///', ''))
        callback(pathname)
    })
}

const createNewWindow = (url, width, height, minWidth, minHeight) => {
    const newWindow = new BrowserWindow({
        width,
        height,
        minWidth,
        minHeight,
        titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: true,
            enableRemoteModule: true,
            nativeWindowOpen: true,
            webSecurity: false,
        }
    })

    if (os.platform() === "darwin") {
        newWindow.setWindowButtonVisibility(false)
    }

    newWindow.loadURL(
        isDev
        ? `http://localhost:3000#/${url}`
        : `file://${path.join(__dirname, url, '../build/index.html')}`
    )

    return newWindow
}

const isWindowAlive = (window) => !window.isDestroyed() && window.isFocusable()

/** TODO: add way to kill process from FE (by exposing `process.kill()`) */
const spawnProcess = async (command, args, pid = (pid) => console.log(pid), output = (stdout) => console.log(stdout), status = (status) => console.log(status)) => {
    const process = cp.exec(command, args, (e) => {
        if (e) console.error(e)
    })
    
    process.on('spawn', () => {
        activeProcesses.push(process)
        pid(process.pid)
    })
    process.stdout.on('data', (data) => {
        output(data.toString())
    })
    process.stderr.on('data', (data) => {
        output(data.toString())
    })
    process.on('close', (code) => {
        status(code)

        const processIndex = activeProcesses.findIndex((p) => p.pid === pid)
        activeProcesses.splice(processIndex, 1)

        return code !== 0 ? Promise.reject(`child process exited with code ${code}`) : Promise.resolve()
    })
}

const killProcess = (pid) => {
    const process = activeProcesses.find((p) => p.pid === pid)
    if (process) process.kill()
}

const installProject = async (path) => {    
    const cmd = `
        cd "${path}"
        make debug
    `
    
    const terminal = createNewWindow('terminal', 720, 480, 0, 0)
    await spawnProcess(cmd, { encoding: 'utf8', shell: true, stdio: 'inherit' }, (pid) => {
        if (isWindowAlive(terminal)) terminal.webContents.send("shell:created", pid)
    }, (stdout) => {
        if (isWindowAlive(terminal)) terminal.webContents.send("shell:stdout", stdout)
    }, (status) => {
        if (isWindowAlive(terminal)) terminal.webContents.send("shell:status", status)
    })
}

const toWin32Path = (path) => path.replace(/\//g, '\\')
const formatPath = (path) => os.platform() === 'win32' ? toWin32Path(path) : path

app.on('ready', setup)

app.on('window-all-closed', function () {
    app.quit()
})

ipcMain.on("path:open", async (_, data) => {
    const { path: p } = data

    try {
        await shell.showItemInFolder(formatPath(path).normalize(p))
    } catch (e) {
        console.error(e)
    }
})

ipcMain.on("path:get", () => {
    dialog
        .showOpenDialog({
            properties: ["openFile", "openDirectory"],
        })
        .then((result) => {
            if (result) BrowserWindow.getFocusedWindow().webContents.send("path:selected", result.filePaths)
        })
        .catch((e) => {
            console.error(e)
        })
})

ipcMain.on("file:open", async (_, data) => {
    const { path } = data

    try {
        await shell.openPath(formatPath(path))
    } catch (e) {
        console.error(e)
    }
})

ipcMain.on("file:get", (_, data) => {
    const { extensions } = data

    dialog
        .showOpenDialog({
            filters: [
                { name: "Blocs Projects", extensions },
            ],
            properties: ["openFile"]
        })
        .then((result) => {
            if (result) BrowserWindow.getFocusedWindow().webContents.send("file:selected", result.filePaths)
        })
        .catch((e) => {
            console.error(e)
        })
})

ipcMain.on("file:new", async (_, data) => {
    const { path, file } = data

    try {
        await fs.writeFileSync(formatPath(path), file)
    } catch (e) {
        console.error(e)
    }
})

ipcMain.on("file:copy", async (_, data) => {
    const { source, target } = data

    try {
        await fs.copyFileSync(formatPath(source), formatPath(target))
    } catch (e) {
        console.error(e)
    }
})

ipcMain.on("window:external", async (_, data) => {
    const { url } = data

    try {
        await shell.openExternal(url)
    } catch (e) {
        console.error(e)
    }
})

ipcMain.on("window:open", (_, data) => {
    const { width, height, url } = data
    createNewWindow(url, width, height, 320, 320)
})

ipcMain.on("window:close", () => {
    BrowserWindow.getFocusedWindow().close()
})

ipcMain.on("project:new", async (_, data) => {
    const { name, location, width, height, framerate, world, imgui, tracy } = data
    const formattedPath = formatPath(`${location}/${name}`)

    try {
        await fs.mkdirSync(formatPath(`${location}/${name}`),        { recursive: true })
        await fs.mkdirSync(formatPath(`${location}/${name}/src`),    { recursive: true })
        await fs.mkdirSync(formatPath(`${location}/${name}/assets`), { recursive: true })
        await fs.mkdirSync(formatPath(`${location}/${name}/assets/sprites`), { recursive: true })
        await fs.mkdirSync(formatPath(`${location}/${name}/assets/shaders`), { recursive: true })
        await fs.mkdirSync(formatPath(`${location}/${name}/assets/fonts`),   { recursive: true })

        const plop  = await nodePlop(path.join(__dirname, '../internal/plopfile.js'))
        const build = plop.getGenerator('build')
        await build.runActions({
            location: formattedPath,
            name,
            width,
            height,
            framerate,
            world,
            imgui,
            tracy
        })

        const project = {
            id: uuid.v4(),
            name,
            path: formattedPath,
            updatedAt: new Date().toString(),
            createdAt: new Date().toString()
        }
        const data = JSON.stringify(project, null, 4)
        await fs.writeFileSync(`${location}/${name}/project.bcs`, data)

        const projects = store.get("projects")
        if (projects) {
            const newProjects = [project, ...projects]
            store.set("projects", newProjects)

            window.webContents.send("data:found", { key: "projects", value: newProjects })
        }

        await installProject(formattedPath)
    } catch (e) {
        try {
            await shell.trashItem(formattedPath)
        } catch (e) {
            console.error(e)
        }
        console.error(e)
    }
})

ipcMain.on("project:delete", async (_, data) => {
    const { id, path } = data

    try {
        await shell.trashItem(formatPath(path))

        const projects = store.get("projects")
        if (projects) {
            const index = projects.findIndex((p) => p.id === id)
            const newProjects = [...projects]
            newProjects.splice(index, 1)
            store.set("projects", newProjects)
            
            window.webContents.send("data:found", { key: "projects", value: newProjects })
        }
    } catch (e) {
        console.error(e)
    }
})

/** FIXME: */
ipcMain.on("project:validate", async (_, data) => {
    return

    const { projects } = data
    const projectExists = async (path, id) => {
        const exists = await fs.existsSync(path)
        return exists ? null : id
    }

    const promises = []

    for (let i = 0; i < projects.length; i++) {
        promises.push(projectExists(projects[i].path, projects[i].id))
    }

    const newProjects = [...projects]
    const toRemove = (await Promise.all(promises)).filter((p) => p)
    toRemove.forEach((id) => {
        const index = newProjects.findIndex((p) => p.id === id)
        newProjects.splice(index, 1)
    })

    // store.set("projects", newProjects)
})

ipcMain.on("project:add", async (_, data) => {
    const { path } = data
    try {
        const stream = await fs.readFileSync(formatPath(path), 'utf-8')
        const project = JSON.parse(stream.toString())
        const projects = store.get("projects")

        if (!projects.some((p) => p.id === project.id)) {
            store.set("projects", [project, ...projects])
        }
    } catch (e) {
        console.error(e)
    }
})

ipcMain.on("project:update", async (_, data) => {
    const { project } = data

    try {
        const stream = await fs.readFileSync(formatPath(`${project.path}/project.bcs`), 'utf-8')
        const data = JSON.parse(stream)

        const newProject = { ...data, ...project }
        await fs.writeFileSync(formatPath(`${project.path}/project.bcs`), JSON.stringify(newProject, null, 4))
    } catch (e) {
        console.error(e)
    }
})

ipcMain.on("project:install", (_, data) => {
    const { path } = data
    installProject(formatPath(path))
})

ipcMain.on('data:set', (_, data) => {
    const { key, value } = data
    store.set(key, value)
})

ipcMain.on('data:get', (_, data) => {
    const { key } = data
    const value = store.get(key)
    BrowserWindow.getFocusedWindow()?.webContents.send("data:found", { key, value })
})

ipcMain.on("shell:kill", (_, data) => {
    const { pid } = data
    killProcess(pid)
})
