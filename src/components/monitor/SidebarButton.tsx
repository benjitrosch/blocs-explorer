import { ButtonHTMLAttributes } from "react"
import clsx from "clsx"

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    title: string
}

const SidebarButton = ({
    title,
    children,
    className,
    ...props
}: Props) => (
    <button
        className={clsx(
            "w-full flex items-center gap-x-2 border-b-2 border-base-100 hover:bg-base-200 hover:text-white transition-all",
            className
        )}
        {...props}
    >
        <div className="shrink-0">{children}</div>
        <div className="hidden md:inline w-2 h-2 shrink-0" style={{ background: `rgb(${[1,2,3].map(x=>Math.random()*256|0)})` }} />
        <span className="truncate text-sm md:text-base mr-2">{title}</span>
    </button>
)

export default SidebarButton
