import { LiHTMLAttributes, useState } from "react"
import { ChevronRightIcon } from "@heroicons/react/solid"
import clsx from "clsx"

import SidebarButton from "./SidebarButton"

type Props = LiHTMLAttributes<HTMLLIElement> & {
    title: string
}

const SidebarSection = ({
    title,
    children,
    ...props
}: Props) => {
    const [expanded, toggleExpanded] = useState<boolean>(false)

    return (
        <li {...props}>
            <SidebarButton
                title={title}
                onClick={() => toggleExpanded(!expanded)}
            >
                <ChevronRightIcon
                    className={clsx("h-4",
                        {
                            'rotate-90': expanded,
                        }
                    )}
                />
            </SidebarButton>
            <ul>{expanded && children}</ul>
        </li>
    )
}

export default SidebarSection
