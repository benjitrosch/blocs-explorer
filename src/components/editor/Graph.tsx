import {
    createRef,
    HTMLAttributes,
    RefObject,
    useCallback,
    useEffect,
    useRef,
    useState, 
    WheelEvent
} from "react"
import clsx from 'clsx'

import { drawBezierPath, drawSteppedPath } from "../../utils/paths"
import { NodeDataConnection, NodeDataConnectionTypes, NodeDataConnectorType, NodeGroupData, NodeMeta } from "../../types/nodes"
import { Position } from "../../types/bounds"

import useContextMenu from "../../hooks/useContextMenu"
import useDrag from "../../hooks/useDrag"
import { useGraphContext } from "../../context/GraphContext"

import Background from "./Background"
import Connector, { ConnectorRef } from "./Connector"
import DataRow from "./DataRow"
import GraphContextMenu from "./GraphContextMenu"
import GraphControls from "./GraphControls"
import Node from './Node'

type Props = HTMLAttributes<HTMLDivElement> & {
    width?: number
    height?: number
}

const Graph = ({
    width,
    height,
    className,
    style,
    ...props
}: Props) => {
    const graphRef = useRef<HTMLDivElement>(null)
    const connectorRefs = useRef<{
        type: NodeDataConnectorType,
        nodeId: number,
        dataId: number,
        ref: RefObject<ConnectorRef>
    }[]>([])

    const {
        nodes,
        groups,
        zoom,
        offset,
        setNodes,
        setZoom,
        setOffset
    } = useGraphContext()

    const [activeNode, setActiveNode] = useState<number>(-1)
    
    const [connectorPoints, setConnectorPoints] = useState<[Position, Position] | null>(null)

    const [locked, toggleLocked] = useState<boolean>(false)
    const [fullscreen, toggleFullscreen] = useState<boolean>(false)

    const { ref, state, position } = useDrag(0, 0, offset.x, offset.y)
    const { anchorPoint, showMenu: showGraphMenu } = useContextMenu(ref)

    const svgSizeProps = {
        width: width ?? '100%',
        height: height ?? '100%',
    }

    const buttonSize = 8 * zoom

    const classes = clsx(
        `${fullscreen ? 'absolute' : 'relative'} z-0 overflow-hidden`,
        className
    )

    useEffect(() => { 
        deselectNode()
        
        if (!locked) {
            setOffset(position) 
        }
    }, [locked, position, setOffset, state])

    useEffect(() => {
        const graph = graphRef.current

        if (graph != null && document != null) {
            const openFullscreen = () => {
                if (graph.requestFullscreen) {
                    graph.requestFullscreen()
                }
            }
            
            const closeFullscreen = () => {
                if (document.fullscreenElement && document.exitFullscreen) {
                    document.exitFullscreen()
                }
            }

            fullscreen ? openFullscreen() : closeFullscreen()
        }
    }, [fullscreen])

    const selectNode = (id: number) => {
        const index = nodes.findIndex((node) => node.id === id)
        const node = nodes[index]

        const newNodes = [...nodes]

        newNodes.splice(index, 1)
        newNodes.push(node)

        setNodes(newNodes)
        setActiveNode(id)
    }

    const deselectNode = () => {
        setActiveNode(-1)
    }

    const updateNodeMeta = useCallback((id: number, data: NodeMeta) => {
        const index = nodes.findIndex((node) => node.id === id)
        
        const newNodes = [...nodes]
        newNodes.splice(index, 1, data)

        setNodes(newNodes)
    }, [nodes, setNodes])

    const getNodeById = (id: number): NodeMeta => {
        const index = nodes.findIndex((node) => node.id === id)
        return nodes[index]
    }  

    const addNode = (type: NodeDataConnectionTypes, x: number, y: number) => {
        // FIXME: this will become very slow at not very large numbers of nodes
        // maybe switch from numeric id's to a unique hash? uuid?
        let freeId = 0
        while (nodes.some((n) => n.id === freeId)) {
            freeId++;
        }

        setNodes(nodes.concat({
            id: freeId,
            title: `test_node_0${freeId}`,
            position: { x: x - (graphRef.current?.offsetLeft ?? 0) - offset.x, y: y - (graphRef.current?.offsetTop ?? 0) - offset.y },
            type,
            group: groups.length > 0 ? 0 : undefined,
            connections: [],
            data: []
          }
        ))
    }

    const cloneNode = (node: NodeMeta) => {
        setNodes(nodes.concat({
            id: nodes.length,
            title: `test_node_0${nodes.length}`,
            position: { x: node.position.x + 100 , y: node.position.y + 100 },
            type: node.type,
            group: node.group,
            connections: [],
            data: node.data
          }
        ))
    }

    const removeNode = (id: number) => {
        const index = nodes.findIndex((node) => node.id === id)
        const newNodes = [...nodes]

        newNodes.forEach((node) => {
            node.connections = node.connections.filter((c) => c.to.nodeId !== id)
        })
        newNodes.splice(index, 1)

        setNodes(newNodes)
    }

    const drawConnectorToMousePath = () => {
        if (connectorPoints) {
            const [p0, p1] = connectorPoints
            return drawBezierPath(p0, p1)
        }
        
        return ''
    }

    const connectNodeDataRows = (n0: number, d0: number, n1: number, d1: number) => {
        if (n0 === n1) {
            return
        }

        const index = nodes.findIndex((node) => node.id === n0)
        const node = nodes[index]

        const isConnected = node.connections.find((c) =>
            c.dataId === d0 && c.to.nodeId === n1 && c.to.dataId === 1) != null

        if (isConnected) {
            return
        }

        const connection: NodeDataConnection = {
            dataId: d0,
            to: {
                nodeId: n1,
                dataId: d1,
            }
        }

        node.connections.push(connection)
        updateNodeMeta(n0, node)
    }

    const disconnectNodeDataRows = (n0: number, d0: number, n1: number, d1: number) => {
        const index = nodes.findIndex((node) => node.id === n0)
        const node = nodes[index]

        const connectionIndex = node.connections.findIndex((connection) =>
            connection.dataId === d0 && connection.to.nodeId === n1 && connection.to.dataId === d1)

        node.connections.splice(connectionIndex, 1)
        updateNodeMeta(n0, node)
    }

    const checkDataSources = (id: number, data: number) => {
        const sources = nodes.reduce((values, node) => {
            const connections = node.connections.filter((c) => c.to.nodeId === id && c.to.dataId === data)
            connections.forEach((connection) => {
                if (connection != null) {
                    const dataId = connection.dataId
                    const nodeData = node.data?.find((d) => d.id === dataId)
    
                    if (nodeData != null) {
                        const mod = checkDataSources(node.id, dataId)
                        const value = mod ? { ...nodeData, value: nodeData.value + mod } : nodeData
                        
                        values.push(value)
                    }
                }
            })

            return values
        }, [] as any[])

        if (!sources.length) {
            return null
        }

        return sources.reduce((acc, data, i) => {
            if (i === 0) return acc
            return acc + data.value
        }, sources[0].value)
    }

    const onScroll = (e: WheelEvent<HTMLDivElement>) => {
        if (locked) {
            return
        }

        const delta = Math.min(1, Math.max(-1, e.deltaY)) * 0.03
        const newZoom = Math.min(2, Math.max(0.5, zoom + delta))

        setZoom(newZoom)

        const ratio = 1 - newZoom / zoom
        const newTranslation = {
            x: offset.x + (e.clientX - offset.x) * ratio,
            y: offset.y + (e.clientY - offset.y) * ratio
        }

        setOffset(newTranslation)
    }

    return (
        <div
            ref={graphRef}
            className={classes}
            style={{
                ...style,
                width: width ?? '100%',
                height: height ?? '100%',
            }}
            onWheelCapture={(e) => onScroll(e)}
            onDragOver={(e) => {
                e.stopPropagation()
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move'
            }}
            onDrop={(e) => {
                const type = e.dataTransfer.getData('nodeConnectionType')
                addNode(Number(type), e.clientX, e.clientY)
            }}
            {...props}
        >
            <ul className="absolute z-50 left-0 top-0 m-4 text-xs text-left text-base-content select-none">
                <li>({offset.x.toFixed(0)}, {offset.y.toFixed(0)})</li>
                <li>x {zoom.toFixed(2)}</li>
            </ul>

            {showGraphMenu && (
                <GraphContextMenu
                    position={anchorPoint}
                    addNode={(type: NodeDataConnectionTypes) => addNode(type, anchorPoint.x, anchorPoint.y)}
                    setZoom={(zoom: number) => setZoom(zoom)}
                    toggleFullscreen={() => toggleFullscreen(!fullscreen)}
                    toggleLocked={() => toggleLocked(!locked)}
                />
            )}

            <Background
                ref={ref}
                offset={offset}
                zoom={zoom}
                className={`w-full h-full absolute z-10 cursor-move`}
            />

            <GraphControls
                className="absolute z-50 bottom-0 left-0 m-4"
                locked={locked}
                zoomIn={() => !locked && setZoom(zoom + 0.1)}
                zoomOut={() => !locked && setZoom(zoom - 0.1)}
                toggleLocked={() => toggleLocked(!locked)}
                toggleFullscreen={() => toggleFullscreen(!fullscreen)}
            />

            {nodes.map((node, i) => {
                return (
                    <div key={node.id}>
                        <Node
                            data={node}
                            offset={offset}
                            zoom={zoom}
                            color={groups.find((group) => group.id === node.group)?.color ?? '#47a5d3'}
                            isActive={node.id === activeNode}
                            groups={groups}
                            selectNode={() => selectNode(node.id)}
                            deselectNode={deselectNode}
                            updateNodeMeta={(data: NodeMeta) => updateNodeMeta(node.id, data)}
                            cloneNode={() => cloneNode(node)}
                            removeNode={() => removeNode(node.id)}
                            style={{
                                zIndex: 20 + i,
                                transform: `scale(${zoom})`
                            }}
                        >
                            {node.content}
                            {node.data?.map((data, i) => {
                                const mod = checkDataSources(node.id, data.id)
                                const value = mod ? data.value + mod : data.value

                                const n0 = getNodeById(node.id)                        
                                const p0 = { x: n0.position.x, y: n0.position.y }  
                                const x0 = p0.x
                                const y0 = p0.y //+ (n0.size.height * 0.5) + data.id * 24 // TODO: get ref of datarow to find pos    
                                
                                let receiverRef = connectorRefs.current.find((c) => c.type === 'in' && c.nodeId === node.id && c.dataId === data.id)
                                if (!receiverRef) {
                                    receiverRef = {
                                        type: 'in',
                                        nodeId: node.id,
                                        dataId: data.id,
                                        ref: createRef<ConnectorRef>()
                                    }
                                    connectorRefs.current.push(receiverRef)
                                }

                                let senderRef = connectorRefs.current.find((c) => c.type === 'out' && c.nodeId === node.id && c.dataId === data.id)
                                if (!senderRef) {
                                    senderRef = {
                                        type: 'out',
                                        nodeId: node.id,
                                        dataId: data.id,
                                        ref: createRef<ConnectorRef>()
                                    }
                                    connectorRefs.current.push(senderRef)
                                }

                                const receiver = (<Connector
                                                    ref={receiverRef.ref}
                                                    type="in"
                                                    nodeId={node.id}
                                                    dataId={data.id}
                                                    graphRef={graphRef}
                                                    zoom={zoom}
                                                    hasConnection={nodes.find((n) => n.connections.find((c) => c.to.nodeId === node.id && c.to.dataId === data.id)) != null}
                                                    setConnectorPoints={(position: Position, mouse: Position) => setConnectorPoints([{ x: zoom * (x0 + position.x + 8) + offset.x, y: zoom * (y0 + position.y + 22) + offset.y }, mouse])}
                                                    deselectConnector={() => setConnectorPoints(null)}
                                                    connectNodeDataRows={(n0: number, d0: number) => connectNodeDataRows(n0, d0, node.id, data.id)}
                                                    style={{
                                                        zIndex: 20 + i
                                                    }}
                                                />)

                                const sender = (<Connector
                                                    ref={senderRef.ref}
                                                    type="out"
                                                    nodeId={node.id}
                                                    dataId={data.id}
                                                    graphRef={graphRef}
                                                    zoom={zoom}
                                                    hasConnection={n0.connections.find((c) => c.dataId === data.id) != null}
                                                    setConnectorPoints={(position: Position, mouse: Position) => setConnectorPoints([{ x: zoom * (x0 + position.x + 8) + offset.x, y: zoom * (y0 + position.y + 22) + offset.y }, mouse])}
                                                    deselectConnector={() => setConnectorPoints(null)}
                                                    connectNodeDataRows={(n1: number, d1: number) => connectNodeDataRows(node.id, data.id, n1, d1)}
                                                    style={{
                                                        zIndex: 20 + i
                                                    }}
                                                />)

                                return (
                                    <DataRow
                                        key={`node_${node.id}_data_${data.id}_#${i}`}
                                        id={data.id}
                                        title={data.title}
                                        value={value}
                                        node={node}
                                        receiver={node.type == (node.type | NodeDataConnectionTypes.RECEIVER) && receiver}
                                        sender={node.type == (node.type | NodeDataConnectionTypes.SENDER) && sender}
                                        editable={node.type === NodeDataConnectionTypes.SENDER}
                                        updateNodeMeta={(data: NodeMeta) => updateNodeMeta(node.id, data)}
                                    />
                                )
                            })}
                        </Node>

                        {node.connections.map((connection, i) => {
                            const sender = connectorRefs.current.find((c) => c.type === 'out' && c.nodeId === node.id && c.dataId === connection.dataId)
                            const receiver = connectorRefs.current.find((c) => c.type === 'in' && c.nodeId === connection.to.nodeId && c.dataId === connection.to.dataId)

                            const senderPosition = sender?.ref.current?.getPosition() ?? { x: 0, y: 0 } 
                            const receiverPosition = receiver?.ref.current?.getPosition() ?? { x: 0, y: 0 } 

                            const n0 = getNodeById(node.id)
                            const n1 = getNodeById(connection.to.nodeId)
                    
                            const p0 = { x: zoom * (n0.position.x + senderPosition.x + 8) + offset.x, y: zoom * (n0.position.y + senderPosition.y + 22) + offset.y }
                            const p1 = { x: zoom * (n1.position.x + receiverPosition.x + 8) + offset.x, y: zoom * (n1.position.y + receiverPosition.y + 22) + offset.y }                    
                            
                            const path = drawSteppedPath(p0, p1)

                            return (
                                <div
                                    key={`node_${node.id}_connection_${i}_${i}`}
                                >
                                    <svg
                                        className='absolute pointer-events-none'
                                        style={{
                                            zIndex: 20 + i,
                                        }}
                                        {...svgSizeProps}
                                    >
                                        <g>
                                            <path
                                                d={path}
                                                fill="none"
                                                className={clsx("stroke-accent stroke-1", {
                                                    "!stroke-primary": node.id === activeNode,
                                                    "!stroke-secondary": connection.to.nodeId === activeNode,
                                                    "!stroke-2": node.id === activeNode || connection.to.nodeId === activeNode
                                                })}
                                            />
                                            <path
                                                className="pointer-events-auto stroke-transparent hover:stroke-error/20"
                                                d={path}
                                                fill="none"
                                                onClick={() => disconnectNodeDataRows(node.id, connection.dataId, connection.to.nodeId, connection.to.dataId)}
                                                strokeWidth={16}
                                            />
                                        </g>
                                    </svg>
                                </div>
                            )
                        })}
                    </div>
                )
            })}

            <svg
                className='absolute z-50 pointer-events-none'
                {...svgSizeProps}
            >
                <path
                    className='path stroke-accent stroke-1'
                    d={drawConnectorToMousePath()}
                    fill="none"
                />
            </svg>
        </div>
    )
}

export default Graph