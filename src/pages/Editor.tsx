import { useState } from 'react'
import MonacoEditor from "@monaco-editor/react"
import {
    ArrowsExpandIcon,
    ChevronLeftIcon,
    FolderOpenIcon,
    SaveAsIcon,
    SaveIcon
} from '@heroicons/react/solid'
import clsx from 'clsx'

import Graph from '../components/editor/Graph'
import GraphProvider from '../context/GraphContext'

const Editor = () => {
    const [code,         setCode]         = useState<string>('')
    const [codeExpanded, setCodeExpanded] = useState<boolean>(true)

    return (
        <GraphProvider data={[]} groupData={[]}>
            <section className='w-full h-full flex'>
                <Graph className='flex-1' />
                <div
                    className={clsx('relative h-full border-l-2 border-base-100 z-20', {
                        "w-1/3": codeExpanded,
                    })}
                >
                    <button
                        className='absolute -left-4 md:-left-6 top-1/2 h-16 z-50 bg-base-300 hover:bg-base-100 rounded-tl-lg rounded-bl-lg'
                        onClick={() => setCodeExpanded((e) => !e)}
                    >
                        <ChevronLeftIcon className={clsx('w-4 md:w-6', { 'rotate-180': codeExpanded })} />
                    </button>
                    {codeExpanded && (
                        <>
                            <div className='flex items-center justify-between min-h-[5%] px-2 bg-base-300 border-b-2 border-base-100'>
                                <span className='select-none'>editor</span>
                                <span className='flex gap-x-2'>
                                    <button>
                                        <ArrowsExpandIcon className='w-4' />
                                    </button>
                                </span>
                            </div>
                            <div className='flex items-center justify-between min-h-[5%] px-2 bg-base-300 border-b-2 border-base-100'>
                                <span className='select-none'>file.h</span>
                                <span className='flex gap-x-2'>
                                    <button><FolderOpenIcon className='w-4' /></button>
                                    <button><SaveAsIcon className='w-4' /></button>
                                    <button><SaveIcon className='w-4' /></button>
                                </span>
                            </div>
                            <MonacoEditor
                                className="h-[90%] text-left"
                                language="cpp"
                                theme="vs-dark"
                                options={{
                                    selectOnLineNumbers: true,
                                    minimap: { enabled: false },
                                    lineDecorationsWidth: 0,
                                    lineNumbersMinChars: 2,
                                    automaticLayout: true,
                                }}
                                value={code}
                                onChange={(v) => v && setCode(v)}
                            />
                        </>
                    )}
                </div>
            </section>
        </GraphProvider>
    )
}

export default Editor
