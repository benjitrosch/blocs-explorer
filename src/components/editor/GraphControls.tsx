import { HTMLAttributes } from "react"
import clsx from "clsx"

type Props = HTMLAttributes<HTMLDivElement> & {
    locked: boolean
    zoomIn: () => void
    zoomOut: () => void
    toggleLocked: () => void
    toggleFullscreen: () => void
}

const GraphControls = ({
    locked,
    zoomIn,
    zoomOut,
    toggleLocked,
    toggleFullscreen,
    className,
    ...props
}: Props) => {
    const buttonclasses = clsx(
        "w-8 h-8 bg-base-200 hover:bg-base-100 text-base-content"
    )

    return (
        <div
            className={clsx(
                "flex flex-col items-center justify-between gap-0.5 bg-base-100 border border-base-100 font-bold text-xl select-none",
                className,
            )}
            {...props}
        >
            <button
                className={buttonclasses}
                onClick={zoomIn}
            >
                +
            </button>

            <button
                className={buttonclasses}
                onClick={zoomOut}
            >
                -
            </button>

            <button
                className={buttonclasses}
                onClick={toggleLocked}
            >
                {locked ? '🔒' : '🔓'}
            </button>

            <button
                className={buttonclasses}
                onClick={toggleFullscreen}
            >
                🖥️
            </button>
        </div>
    )
}

export default GraphControls
