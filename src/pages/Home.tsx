import { createRef, RefObject, useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Input, Modal } from 'react-daisyui'
import { PlusIcon, FolderOpenIcon, SearchIcon, XIcon, ArrowDownIcon } from '@heroicons/react/solid'

import { ProjectMetadata } from '../types/project'
import { useProjectContext } from '../context/ProjectContext'

import ProjectsList from '../components/projectlist/ProjectsList'

type Props = {
    projects: ProjectMetadata[] | null
}

const Home = ({ projects }: Props) => {
    const { currentProject, setCurrentProject } = useProjectContext()
    
    const [projectToDelete, setProjectToDelete] = useState<ProjectMetadata | null>(null)
    const [projectRefs, setProjectRefs] = useState<RefObject<HTMLDivElement>[]>([])
    const [search, setSearch] = useState("")

    const filteredProjects = useMemo(() => projects?.filter((p) => p.name.includes(search.trim().replace(/[^\w]/g, ''))) ?? [], [projects, search])

    const parseProjectFile = useCallback((filepath: string) => {
        window.electronAPI.parseProjectFile(filepath)
    }, [])

    const uploadImageFile = useCallback((filepath: string) => {
        if (filepath.length && currentProject) {
            window.electronAPI.copyFile(filepath, `${currentProject.path}/thumbnail.png`)
        }
    }, [currentProject])

    const getFileExtension = useCallback((filepath: string) => {
        const extension = filepath.split('.').at(-1)
        switch (extension) {
            case 'bcs':
                parseProjectFile(filepath)
                break

            case 'png':
            case 'jpg':
            case 'jpeg':
                uploadImageFile(filepath)
                break
        }
    }, [parseProjectFile, uploadImageFile])

    const deselectCurrentProject = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') setCurrentProject(null)
    }, [setCurrentProject])

    useEffect(() => {
        window.addEventListener('keydown', deselectCurrentProject)

        return () => {
            window.removeEventListener('keydown', deselectCurrentProject)
        }
    }, [deselectCurrentProject])

    useEffect(() => {
        window.electronAPI.addFileListener(getFileExtension)

        return () => {
            window.electronAPI.removeFileListener(getFileExtension)
        }
    }, [deselectCurrentProject, getFileExtension])

    useEffect(() => {
        const newRefs: RefObject<HTMLDivElement>[] = []
        filteredProjects.forEach((_) => {
          newRefs.push(createRef<HTMLDivElement>())
        })
        setProjectRefs(newRefs)
    }, [filteredProjects])

    const scrollToIndex = (index: number) => {
        projectRefs[index].current?.scrollIntoView({
            behavior: 'smooth',
            block: "center",
            inline: "start",
        })
    }

    return (
        <>
            <section className="h-full">
                <div className='w-10/12 h-full mx-auto'>
                    <div className="h-1/12 flex items-center justify-between py-4">
                        <div className='flex items-center gap-x-2'>
                            <Button
                                className='flex items-center gap-x-2'
                                size="sm"
                                color="primary"
                                onClick={() => window.electronAPI.openNewWindow("new", 512, 512)}
                            >
                                <PlusIcon className='h-4' />
                                <span className='hidden md:inline'>new</span>
                            </Button>
                            <Button
                                className='flex items-center gap-x-2'
                                size="sm"
                                onClick={() => window.electronAPI.openFileDialog(['bcs'])}
                            >
                                <FolderOpenIcon className='h-6' />
                                <span className='hidden md:inline'>open</span>
                            </Button>
                        </div>
                        <div className='flex items-center'>
                            <Input
                                className="-mr-6 pr-6"
                                size="sm"
                                placeholder="search..."
                                value={search}
                                onChange={(e) => setSearch(e.currentTarget.value)}
                            />
                            {search.length ? (
                                <button aria-label='Clear search' onClick={() => setSearch('')}>
                                    <XIcon className='h-4 mr-2' />
                                </button>
                            ) : (
                                <SearchIcon className='h-4 mr-2' />
                            )}
                        </div>
                    </div>
                    {filteredProjects.length ? (
                        <ProjectsList
                            className='h-[92%]'
                            projects={filteredProjects}
                            currentProject={currentProject}
                            refs={projectRefs}
                            scrollToIndex={scrollToIndex}
                            setCurrentProject={setCurrentProject}
                            setProjectToDelete={setProjectToDelete}
                        />
                    ) : (
                        <div className="flex flex-col w-full h-3/4 items-center justify-center">
                            <h2 className="text-2xl">no projects :(</h2>
                            {projects?.length ? (
                                <>
                                    <h3>no matches found for search</h3>
                                </>
                            ) : (
                                <>
                                    <h3>create a new project to get started</h3>
                                    <br />
                                    <ArrowDownIcon className="h-8 animate-bounce hidden md:block" />
                                    <Button
                                        className='z-20 flex items-center gap-x-2 text-lg'
                                        color="primary"
                                        onClick={() => window.electronAPI.openNewWindow("new", 420, 320)}
                                    >
                                        <PlusIcon className='h-6' />
                                        new 
                                    </Button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </section>
            <Modal open={!!projectToDelete}>
                <Modal.Header className="font-bold text-left">warning!</Modal.Header>
                <Modal.Body className='text-left'>
                    are you sure you want to delete <strong>"{projectToDelete?.name}"</strong>?
                </Modal.Body>
                <Modal.Actions>
                    <Button
                        size="sm"
                        onClick={() => setProjectToDelete(null)}
                    >
                        No
                    </Button>
                    <Button
                        size="sm"
                        color="error"
                        onClick={() => {
                            if (projectToDelete) {
                                window.electronAPI.deleteProject(projectToDelete.id, projectToDelete.path)
                                setProjectToDelete(null)
                            }
                        }}
                    >
                        Delete
                    </Button>
                </Modal.Actions>
            </Modal>
        </>
    )
}

export default Home