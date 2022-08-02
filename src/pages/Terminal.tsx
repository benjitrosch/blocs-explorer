import { useCallback, useEffect, useState, useRef } from "react"
import { PauseIcon, PlayIcon, StopIcon } from "@heroicons/react/solid"
import clsx from "clsx"

const getStatusMessage = (status: number | undefined) => {
    switch (status) {
        case 0:
            return 'done'

        case 1:
            return 'error'

        default:
        case undefined:
            return 'running'
    }
}

const formatTimer = (time: number) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, "0")
    const seconds = (time % 60).toString().padStart(2, "0")
    return minutes + ':' + seconds
}

const Terminal = () => {
    const startTime    = useRef<number>(performance.now())
    const codeBlockRef = useRef<HTMLUListElement>(null)

    const [pid,    setPid]    = useState<number | undefined>()
    const [output, setOutput] = useState<string[]>([])
    const [status, setStatus] = useState<number | undefined>()
    const [paused, setPaused] = useState<boolean>(false)

    const appendLine = useCallback((stdout: string) => {
        const line = stdout.replace(/\.*?m/g, "")
        setOutput([...output, line])
    }, [output, setOutput])

    useEffect(() => {
        window.electronAPI.addProcessListener(setPid)
        return () => window.electronAPI.removeProcessListener(setPid)
    }, [])

    useEffect(() => {
        window.electronAPI.addStatusListener(setStatus)
        return () => window.electronAPI.removeStatusListener(setStatus)
    }, [])

    useEffect(() => {
        window.electronAPI.addStdoutListener(appendLine)
        return () => window.electronAPI.removeStdoutListener(appendLine)
    }, [appendLine])

    useEffect(() => {
        if (codeBlockRef.current) {
            if (Math.abs(codeBlockRef.current.scrollTop - codeBlockRef.current.scrollHeight)
                <= codeBlockRef.current.clientHeight * 1.25) {
                codeBlockRef.current.scrollTop = codeBlockRef.current.scrollHeight
            }
        }
    }, [output, codeBlockRef.current])

    return (
        <div className="w-full h-full">
            <ul
                ref={codeBlockRef}
                className="w-full h-[90%] overflow-x-hidden overflow-y-scroll bg-black text-white text-2xs"
            >
                <pre>
                    {output.map((line, i) => (
                        <code key={i} className="block">
                            {line}
                        </code>
                    ))}
                </pre>
            </ul>
            <div className="w-full h-[10%] px-4 flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <button onClick={() => setPaused(!paused)}>
                        {!paused ? (
                            <PlayIcon className="h-8 text-success" />
                        ) : (
                            <PauseIcon className="h-8 text-warning animate-pulse" />
                        )}
                    </button>
                    <button onClick={() => pid && window.electronAPI.killProcess(pid)} disabled={!pid}>
                        <StopIcon className={clsx("h-8 text-error", { "text-neutral cursor-not-allowed": !pid })} />
                    </button>

                    <span className="opacity-40">
                        {formatTimer(
                            Math.round((performance.now() - startTime.current) / 1000)
                        )}
                    </span>
                </div>
                <div className="flex items-center justify-center gap-x-2">
                    <span>{getStatusMessage(status)}</span>
                    <div aria-label="status" className={clsx("p-2 rounded-full bg-warning", {
                        'bg-success': status === 0,
                        'bg-error':   status === 1
                    })} />
                </div>
            </div>
        </div>
    )
}

export default Terminal
