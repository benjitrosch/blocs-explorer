import {
    createContext,
    useContext,
    useState,
} from 'react'

import { NodeGroupData, NodeMeta } from '../types/nodes'
import { Position } from '../types/bounds'

interface IGraphContext {
    nodes: NodeMeta[]
    groups: NodeGroupData[]
    zoom: number
    offset: Position
    setNodes:  (nodes: NodeMeta[]) => void
    setGroups: (groups: NodeGroupData[]) => void
    setZoom:   (zoom: number) => void
    setOffset: (offset: Position) => void
}
  
const graphContextDefaultState: IGraphContext = {
    nodes: [],
    groups: [],
    zoom: 1,
    offset: { x: 0, y: 0 },
    setNodes:  (_: NodeMeta[]) => null,
    setGroups: (_: NodeGroupData[]) => null,
    setZoom:   (_: number) => null,
    setOffset: (_: Position) => null,
}

export const GraphContext = createContext<IGraphContext>(graphContextDefaultState)
export const useGraphContext = (): IGraphContext => {
    return useContext(GraphContext)
}

type Props = {
    data: NodeMeta[]
    groupData: NodeGroupData[]
    children: React.ReactNode
}

const GraphProvider = ({
    data,
    groupData,
    children
}: Props) => {
    const [nodes,  setNodes]  = useState<NodeMeta[]>(data)
    const [groups, setGroups] = useState<NodeGroupData[]>(groupData)

    const [zoom,   setZoom]   = useState<number>(graphContextDefaultState.zoom)
    const [offset, setOffset] = useState<Position>(graphContextDefaultState.offset)

    const value = {
        nodes,
        groups,
        zoom,
        offset,
        setNodes,
        setGroups,
        setZoom,
        setOffset,
    }

    return <GraphContext.Provider value={value}>{children}</GraphContext.Provider>
}

export default GraphProvider
