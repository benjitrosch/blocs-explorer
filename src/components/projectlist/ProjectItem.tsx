import { RefObject } from "react"
import { Button } from "react-daisyui"
import clsx from "clsx"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import {
    FolderIcon,
    TrashIcon,
    UploadIcon
} from "@heroicons/react/solid"

import { ProjectMetadata } from "../../types/project"

dayjs.extend(relativeTime)

type Props = {
    project: ProjectMetadata
    isCurrentProject: boolean
    scrollRef: RefObject<HTMLDivElement>
    scrollToIndex: () => void
    setCurrentProject: () => void
    setProjectToDelete: () => void
}

const ProjectItem = ({
    project,
    isCurrentProject,
    scrollRef,
    scrollToIndex,
    setCurrentProject,
    setProjectToDelete,
}: Props) => (
    <li aria-label={project.name}>
        <div
            tabIndex={0}
            ref={scrollRef}
            className={clsx(
                "w-full h-24 mb-4 flex justify-between border border-base-content opacity-40 hover:opacity-60 focus:opacity-80 transition-all select-none",
                {
                    "!opacity-100": isCurrentProject
                }
            )}
            onClick={() => {
                scrollToIndex()
                setCurrentProject()
            }}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    scrollToIndex()
                    setCurrentProject()
                }
            }}
        >
            <div aria-label="Thumbnail" className="relative w-32 h-full flex items-center justify-center bg-neutral overflow-hidden">
                {isCurrentProject && (
                    <>
                        <label htmlFor={`thumbnail_${project.id}`} className="z-10 absolute w-full h-full">
                            <i className="w-full h-full flex items-center justify-center hover:bg-black/30 text-transparent hover:text-white transition-all">
                                <UploadIcon className="h-12" />
                            </i>
                        </label>
                        <input
                            id={`thumbnail_${project.id}`}
                            aria-label="Thumbnail upload"
                            type="button"
                            onClick={() => window.electronAPI.openFileDialog(['png'])}
                        />
                    </>
                )}
                <img
                    className='min-w-full min-h-full shrink-0' 
                    src={`file://${project.path}/thumbnail.png`}
                    onError={(e) => {
                        if (e.currentTarget.src !== "/assets/blocs_logo.svg") {
                            e.currentTarget.src = "/assets/blocs_logo.svg"
                        }
                    }}
                    alt="project thumbnail"
                />
            </div> 
            <div className="h-full flex-1 flex items-center justify-between px-4">
                <div className="flex flex-col items-start">
                    <h2     aria-label="Project name" className="truncate text-lg md:text-2xl">{project.name}</h2>
                    <small  aria-label="File path" className="hidden md:block opacity-60">{project.path}</small>
                    <small  aria-label="Last updated at"><span className="hidden md:inline">Last edited</span> {dayjs(project.updatedAt).fromNow()}</small>
                </div>
                <div className='flex items-center gap-x-2'>
                    <Button
                        aria-label="Open project"
                        className="bg-transparent hover:bg-transparent px-0"
                        size="sm"
                        color="ghost"
                        disabled={!isCurrentProject}
                        onClick={() => window.electronAPI.openDirectory(project.path)}
                    >
                        <FolderIcon className='h-6 md:h-8 hover:text-info transition-all' />
                    </Button>
                    <Button
                        aria-label="Delete project"
                        className="bg-transparent hover:bg-transparent px-0"
                        size="sm"
                        color="ghost"
                        disabled={!isCurrentProject}
                        onClick={setProjectToDelete}
                    >
                        <TrashIcon className="h-6 md:h-8 hover:text-error transition-all" />
                    </Button>
                </div>
            </div>
        </div>
    </li>
)

export default ProjectItem
