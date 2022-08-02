/* eslint-disable react-hooks/exhaustive-deps */
import {
    CSSProperties,
    FC,
    ReactNode,
    useCallback,
    useEffect,
    useState,
} from "react"
import { ChevronRightIcon } from "@heroicons/react/solid"
import clsx from 'clsx'

import { NodeDataConnectionTypes, NodeGroupData, NodeMeta } from "../../types/nodes"
import { Position } from "../../types/bounds"

// import useContextMenu from "../../hooks/useContextMenu"
import useDrag, { DragState } from "../../hooks/useDrag"

// import NodeContextMenu from "./NodeContextMenu"

type Props = {
    data: NodeMeta
    offset: Position
    zoom: number,
    color: string,
    isActive: boolean
    groups: NodeGroupData[]
    children: ReactNode
    className?: string,
    style?: CSSProperties
    selectNode: () => void
    deselectNode: () => void
    updateNodeMeta: (data: NodeMeta) => void
    cloneNode: () => void
    removeNode: () => void
}

const Node = ({
    data,
    offset,
    zoom,
    color,
    isActive,
    groups,
    children,
    className,
    style,
    selectNode,
    deselectNode,
    updateNodeMeta,
    cloneNode,
    removeNode,
}: Props) => {
    const { position } = data
    const { state, position: elementPosition, ref } = useDrag(position.x, position.y, -offset.x, -offset.y, zoom)
    // const { anchorPoint: nodeAnchorPoint, showMenu: showNodeMenu } = useContextMenu(ref)

    const [expanded, toggleExpanded] = useState<boolean>(true)

    const classes = clsx(
        `absolute w-fit h-fit bg-base-100 border-l-4 rounded select-none`,
        state === DragState.MOVE || state === DragState.ACTIVE ? 'cursor-grabbing' : 'cursor-grab',
        className,
    )

    useEffect(() => {
        if (state === DragState.ACTIVE) {
            selectNode()
        }
    }, [state])

    useEffect(() => {
        updateNodeMeta({
            ...data,
            position: {
                x: elementPosition.x,
                y: elementPosition.y,
            }
        })    
    }, [elementPosition, ref.current])

    const addDataRow = useCallback(() => {
        const node = {...data}
        const dataRows = [...(node.data ?? [])]
        
        dataRows.push({
            id: dataRows.length,
            title: `data_#${dataRows.length}`,
            value: 0,
        })
        node.data = dataRows
        updateNodeMeta(node)
    }, [data, updateNodeMeta])

    const nodeTypeToString = (type: NodeDataConnectionTypes) => {
        switch (type) {
            case NodeDataConnectionTypes.RECEIVER:
                return 'RECEIVER'

            case NodeDataConnectionTypes.CHANNEL:
                return 'CHANNEL'

            case NodeDataConnectionTypes.SENDER:
                return 'SENDER'
        }
    }

    return (
        <div
            ref={ref}
            className={classes}
            style={{
                ...style,
                borderLeftColor: color,
                marginLeft: zoom * position.x + offset.x,
                marginTop: zoom * position.y + offset.y,
                transformOrigin: '0 0',
                ...(isActive && { boxShadow: `0 0 0 1px ${color}` + ((state === DragState.MOVE || state === DragState.ACTIVE) ? ", 0 0 0 0.1px rgba(0, 0, 0), 0 4px 24px -2px rgba(0, 0, 0, 0.5)" : "") }),
            }}
        >
            <span className="absolute top-[-18px] right-0 text-base-content/40 text-xs">
                ({position.x.toFixed(0)}, {position.y.toFixed(0)})
            </span>

            <div className="flex items-center justify-between gap-8 p-2">
                <div className="flex flex-col text-left text-base-content">
                    <small>{nodeTypeToString(data.type)}</small>
                    <strong>{data.title}</strong>
                </div>
                
                <ChevronRightIcon
                    className={clsx("w-6", { "rotate-90": expanded })}
                    onClick={() => toggleExpanded(!expanded)}
                />
            </div>

            {expanded && children}

            {expanded && (
                <button
                    className="w-full hover:text-white"
                    onClick={addDataRow}
                >
                    +
                </button>
            )}
        </div>
    )
}

export default Node
