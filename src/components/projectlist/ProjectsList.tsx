import { HTMLAttributes, RefObject } from "react"
import clsx from "clsx"

import { ProjectMetadata } from "../../types/project"

import ProjectItem from "./ProjectItem"

type Props = HTMLAttributes<HTMLUListElement> & {
    projects: ProjectMetadata[]
    currentProject: ProjectMetadata | null
    refs: RefObject<HTMLDivElement>[]
    scrollToIndex: (index: number) => void
    setCurrentProject: (project: ProjectMetadata) => void
    setProjectToDelete: (project: ProjectMetadata) => void
}

const ProjectsList = ({
    projects,
    currentProject,
    refs,
    scrollToIndex,
    setCurrentProject,
    setProjectToDelete,
    className,
    ...props
}: Props) => (
    <ul aria-label="Projects" className={clsx("overflow-y-scroll", className)} {...props}>
        {projects.map((p, i) => 
            <ProjectItem
                key={`${p.name}_${p.createdAt}_${p.id}`}
                project={p}
                isCurrentProject={p.id === currentProject?.id}
                scrollRef={refs[i]}
                scrollToIndex={() => scrollToIndex(i)}
                setCurrentProject={() => setCurrentProject(p)}
                setProjectToDelete={() => setProjectToDelete(p)}
            />
        )}
    </ul>
)

export default ProjectsList
