import {
    CSSProperties,
    forwardRef,
    RefObject,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef
} from "react"
import clsx from 'clsx'

import { NodeDataConnectorType } from "../../types/nodes"
import { Position } from "../../types/bounds"

import useDrag, { DragState } from "../../hooks/useDrag"

export type ConnectorRef = {
    type: NodeDataConnectorType
    nodeId: number
    dataId: number
    getPosition: () => Position
}

type Props = {
    type: NodeDataConnectorType
    nodeId: number
    dataId: number
    graphRef: RefObject<HTMLDivElement>
    zoom: number
    hasConnection: boolean
    className?: string,
    style?: CSSProperties
    setConnectorPoints: (position: Position, mouse: Position) => void
    deselectConnector: () => void
    connectNodeDataRows: (nodeId: number, dataId: number) => void
}

const Connector = forwardRef<ConnectorRef, Props>(({
    type,
    nodeId,
    dataId,
    graphRef,
    zoom,
    hasConnection,
    className,
    style,
    setConnectorPoints,
    deselectConnector,
    connectNodeDataRows,
}, ref) => {
    const { elementBelow, state, mouse, ref: dragRef } = useDrag(0, 0, 0, 0, zoom, graphRef.current)
    const prevState = useRef<DragState>(DragState.IDLE)

    const classes = clsx(
        `w-2 h-2 rounded-full border border-[#f7d964] cursor-crosshair`,
        className,
    )

    const getPosition = useCallback(() => {
        const element = dragRef.current
        const parent = dragRef.current?.offsetParent as HTMLElement

        if (element != null && parent != null) {
            return {
                x: parent.offsetLeft + element.offsetLeft,
                y: parent.offsetTop - element.offsetTop,
            }
        } else {
            return { x: 0, y: 0 }
        }
    }, [dragRef])

    useImperativeHandle(ref, (): ConnectorRef => ({
        type,
        nodeId: nodeId,
        dataId: dataId,
        getPosition,
    }), [dataId, getPosition, nodeId, type])

    useEffect(() => {
        if (state === DragState.MOVE) {
            setConnectorPoints(getPosition(), mouse)
        }

        if (state === DragState.IDLE) {
            deselectConnector()

            if (elementBelow != null && prevState.current === DragState.MOVE) { 
                const [nodeId, dataId] = parseConnectorId(elementBelow)
                connectNodeDataRows(nodeId, dataId)
            }
        }

        prevState.current = state
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state, mouse, elementBelow])

    const parseConnectorId = (id: string): [number, number] => {
        // TODO: I do not enjoy the idea of parsing a string w a temp naming convention that I don't want to be tied down to
        const nodeId = Number(id.split('_')[2])
        const dataId = Number(id.split('_')[4])

        return [nodeId, dataId]
    }

    return (
        <div
            id={`connector_node_${nodeId}_data_${dataId}`}
            ref={dragRef}
            className={classes}
            style={{
                ...style,
                backgroundColor: hasConnection ? '#c9bb82' : '#38362f',
            }}
        />
    )
})

Connector.displayName = 'Connector'

export default Connector
