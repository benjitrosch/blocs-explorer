import clsx from "clsx"
import { forwardRef, HTMLAttributes } from "react"

import { Position } from "../../types/bounds"

type Props = HTMLAttributes<HTMLDivElement> & {
    size?: number
    offset: Position,
    zoom: number,
}

const Background = forwardRef<HTMLDivElement, Props>(({
    size = 32,
    offset,
    zoom,
    className,
    ...props
}, ref) => (
        <div
            ref={ref}
            className={clsx("cursor-move", className)}
            {...props}
        >
            <svg className="w-full h-full">
                <defs>
                    <pattern
                        id="grid"
                        x={offset.x}
                        y={offset.y}
                        width={size * zoom}
                        height={size * zoom}
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            className="stroke-base-content/20"
                            d={`M ${size * zoom} 0 L 0 0 0 ${size * zoom}`}
                            fill="none"
                            strokeWidth="0.5"/>
                    </pattern>
                </defs>

                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="url(#grid)"
                />
            </svg>
        </div>
    )
)

Background.displayName = "Background"

export default Background
