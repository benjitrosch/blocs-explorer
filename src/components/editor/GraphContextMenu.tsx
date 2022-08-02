import { ReactNode } from "react"
import {
    PlusCircleIcon,
    ZoomInIcon,
    ArrowsExpandIcon,
    LockClosedIcon,
    ChevronRightIcon,
} from '@heroicons/react/outline'

import { Position } from "../../types/bounds"
import { NodeDataConnectionTypes } from "../../types/nodes"

type Props = {
    position: Position
    addNode: (type: NodeDataConnectionTypes) => void
    setZoom: (zoom: number) => void
    toggleFullscreen: () => void
    toggleLocked: () => void
}

const GraphContextMenu = ({
    position,
    addNode,
    setZoom,
    toggleFullscreen,
    toggleLocked,
}: Props) => (
    <ul
        className="absolute z-50 w-36 top-0 left-0 bg-base-200 rounded"
        style={{
            marginTop: position.y,
            marginLeft: position.x,
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
        }}
    >
        <GraphContextMenuItem
            icon={<PlusCircleIcon />}
            submenu={[
                <GraphContextMenuItem
                    key='graph_contextmenu_addnode_sender'
                    onClick={() => addNode(NodeDataConnectionTypes.SENDER)}
                >
                        Sender
                </GraphContextMenuItem>,
                <GraphContextMenuItem
                    key='graph_contextmenu_addnode_channel'
                    onClick={() => addNode(NodeDataConnectionTypes.CHANNEL)}
                >
                        Channel
                    </GraphContextMenuItem>,
                <GraphContextMenuItem
                    key='graph_contextmenu_addnode_receiver'
                    onClick={() => addNode(NodeDataConnectionTypes.RECEIVER)}
                >
                    Receiver
                </GraphContextMenuItem>,
            ]}
        >
            Add Node
        </GraphContextMenuItem>

        <hr className="border-base-100" />

        <GraphContextMenuItem
            icon={<ZoomInIcon />}
            submenu={[
                <GraphContextMenuItem
                    key='graph_contextmenu_zoom_50%'
                    onClick={() => setZoom(0.5)}
                >
                    50%
                </GraphContextMenuItem>,
                <GraphContextMenuItem
                    key='graph_contextmenu_zoom_100%'
                    onClick={() => setZoom(1.0)}
                >
                    100%
                </GraphContextMenuItem>,
                <GraphContextMenuItem
                    key='graph_contextmenu_zoom_150%'
                    onClick={() => setZoom(1.5)}
                >
                    150%
                </GraphContextMenuItem>,
                <GraphContextMenuItem 
                    key='graph_contextmenu_zoom_200%'
                    onClick={() => setZoom(2.0)}
                >
                    200%
                </GraphContextMenuItem>,
            ]}
        >
            Zoom
        </GraphContextMenuItem>
        
        <GraphContextMenuItem
            icon={<ArrowsExpandIcon />}
            onClick={toggleFullscreen}
        >
            Fullscreen
        </GraphContextMenuItem>

        <GraphContextMenuItem
            icon={<LockClosedIcon />}
            onClick={toggleLocked}
        >
            Lock Screen
        </GraphContextMenuItem>
    </ul>
)

type ItemProps = {
    children: ReactNode
    icon?: ReactNode
    submenu?: ReactNode[]
    onClick?: () => void
}

const GraphContextMenuItem = ({ children, icon, submenu, onClick }: ItemProps) => (
    <li
        className="context-menu relative w-full"
    >
        <button
            className="w-full flex items-center justify-between p-1 pl-4 text-left hover:bg-base-100 hover:border-l-4 border-base-content rounded"
            onClick={() => onClick && onClick()}
        >
            <div className="flex items-center gap-2">
                {icon && <div className="w-4 h-4 m-0 p-0">{icon}</div>}
                {children}
            </div>
            
            {submenu && submenu.length && <ChevronRightIcon className="w-4" />}
        </button>

        <ul
            className="hidden absolute z-50 w-36 ml-36 top-0 bg-base-200 rounded"
        >
            {submenu}
        </ul>
    </li>
)

export default GraphContextMenu
