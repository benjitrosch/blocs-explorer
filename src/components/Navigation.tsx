import { useCallback } from "react"
import { Button } from "react-daisyui"
import { ChevronRightIcon } from "@heroicons/react/solid"
import clsx from "clsx"

import { useProjectContext } from "../context/ProjectContext"

type Props = {
    path: string
    navigate: (path: string) => void
}

const Navigation = ({ path, navigate }: Props) => {
    const { currentProject } = useProjectContext()
    const hasCurrentProject = !!currentProject

    const buttonClassNames = useCallback((str: string) => clsx("bg-transparent hover:bg-transparent text-2xl font-semibold transition-all normal-case", {
        "text-secondary": str === path
    }), [path])

    return (
        <nav className="flex items-center justify-center gap-x-4">
            <Button
                onClick={() => navigate("/")}
                aria-label="Go to project selection menu"
                size="sm"
                color="ghost"
                className={buttonClassNames("/")}
            >
                <span className="select-none">projects</span>
            </Button>
            <span className="opacity-40 select-none"><ChevronRightIcon className="w-8 -mb-1"/></span>
            <Button
                onClick={() => navigate("/monitor")}
                size="sm"
                color="ghost"
                className={buttonClassNames("/monitor")}
            >
                <span className="select-none">monitor</span>
            </Button>
            <span className="opacity-40 select-none"><ChevronRightIcon className="w-8 -mb-1"/></span>
            <Button
                onClick={() => navigate("/editor")}
                size="sm"
                color="ghost"
                // disabled={!hasCurrentProject}
                className={buttonClassNames("/editor")}
            >
                <span className="select-none">editor</span>
            </Button>
        </nav>
    )
}

export default Navigation
