import { useCallback, useEffect, useState } from "react"
import { Route, Routes } from "react-router-dom"

import { ProjectMetadata } from "./types/project"

import Layout from "./Layout"
import NavigationLayout from "./NavigationLayout"
import StandaloneLayout from "./StandaloneLayout"

import Home from "./pages/Home"
import New from "./pages/New"
import Terminal from "./pages/Terminal"
import Monitor from "./pages/Monitor"
import Editor from "./pages/Editor"

const App = () => {
    const [projects, setProjects] = useState<ProjectMetadata[] | null>([])

    const getProjectsData = useCallback((data: { key: string, value: any }) => {
        if (data.key === "projects") setProjects(data.value)
    }, [setProjects])

    useEffect(() => {
        window.electronAPI.addDataListener(getProjectsData)
        window.electronAPI.retrieveData("projects")

        return () => {
            window.electronAPI.removeDataListener(getProjectsData)
        }
    }, [getProjectsData])

    useEffect(() => {
        if (!projects) window.electronAPI.storeData("projects", [])
        else window.electronAPI.validateProjects(projects)
    }, [projects])

    return (
        <Routes>
            <Route element={<Layout />}>
                <Route element={<NavigationLayout />}>
                    <Route path="/"         element={<Home projects={projects} />} />
                    <Route path="/monitor"  element={<Monitor />} />
                    <Route path="/editor"   element={<Editor />} />
                </Route>
                <Route element={<StandaloneLayout />}>
                    <Route path="/new" element={<New />} />
                    <Route path="/terminal" element={<Terminal />} />
                </Route>
            </Route>
        </Routes>
    )
}

export default App
