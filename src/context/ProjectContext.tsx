import { createContext, useContext, useState, ReactNode } from 'react'

import { ProjectMetadata } from '../types/project'

interface IProjectContext {
    currentProject: ProjectMetadata | null
    setCurrentProject: (project: ProjectMetadata | null) => void
}
  
const projectContextDefaultState: IProjectContext = {
    currentProject: null,
    setCurrentProject: (_project: ProjectMetadata | null) => null,
  }
  
export const ProjectContext = createContext<IProjectContext>(projectContextDefaultState)
export const useProjectContext = (): IProjectContext => {
    return useContext(ProjectContext)
}

type Props = {
    children: ReactNode
}

const ProjectProvider = ({ children }: Props) => {
    const [currentProject, setCurrentProject] = useState<ProjectMetadata | null>(null)

    const value = {
        currentProject,
        setCurrentProject
    }

    return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}

export default ProjectProvider
