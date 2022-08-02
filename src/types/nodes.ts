import { ReactNode, RefObject } from "react"

import { Position } from "./bounds"

export type NodeMeta = {
    id: number
    title: string
    content?: ReactNode
    position: Position
    type: NodeDataConnectionTypes
    connections: NodeDataConnection[]
    data?: NodeData<NodeDataTypes>[]
    group?: number
}

export type NodeData<T> = {
    id: number
    title: string
    value: T
}

export type NodeDataTypes = string | number

export enum NodeDataConnectionTypes {
    SENDER      = 1 << 0,
    RECEIVER    = 1 << 1,
    CHANNEL     = ~(~0 << 2)
}

export type NodeDataConnectorType = 'in' | 'out'

export type NodeDataConnection = {
    dataId: number,
    to: {
        nodeId: number,
        dataId: number
    }
}

export type NodeDataRowRef = {
    nodeId: number,
    dataId: number,
    ref: RefObject<HTMLDivElement>
}

export type NodeGroupData = {
    id: number
    title: string
    color: string
}
