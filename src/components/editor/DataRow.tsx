import {
    CSSProperties,
    ReactNode,
    useEffect,
    useState
} from "react"
import clsx from "clsx"

import { NodeDataTypes, NodeMeta } from "../../types/nodes"

type Props<T> = {
    id: number
    title: string
    value: T
    node: NodeMeta
    receiver?: ReactNode
    sender?: ReactNode
    editable?: boolean
    style?: CSSProperties
    className?: string
    valueClassName?: string
    updateNodeMeta: (data: NodeMeta) => void
}

const DataRow = <T extends NodeDataTypes>({
    id,
    title,
    value,
    node,
    receiver,
    sender,
    editable,
    style,
    className,
    valueClassName,
    updateNodeMeta,
}: Props<T>): JSX.Element => {
    const [newValue, setNewValue] = useState<T>(value)

    const containerClasses = clsx(
        "relative w-full h-fit flex items-center justify-between gap-8 p-1 bg-base-200 text-base-content text-xs",
        className,
    )

    const valueClasses = clsx(
        "px-1 text-white bg-base-300 rounded",
        editable && "hover:border-white",
        valueClassName,
    )

    useEffect(() => {
        if (node.data != null) {
            const newDataSet = [...node.data]

            const index = newDataSet.findIndex((data) => data.id === id)
            const oldData = newDataSet[index]
            
            if (oldData != null) {
                let newData = newValue
                if (typeof value === 'number') {
                    newData = Number(newData) as T
                }

                oldData.value = newData
                newDataSet.splice(index, 1, oldData)

                updateNodeMeta({...node, data: newDataSet})
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newValue])

    const updateDataRowTitle = (value: string) => {
        const newNode = {...node}
        const index = newNode.data?.findIndex((d) => d.id === id) ?? -1

        if (newNode.data && index >= 0) {
            newNode.data[index].title = value
            updateNodeMeta(newNode)
        }
    }

    let type = 'text'
    if (typeof value === 'number') {
        type = 'number'
    }

    return (
        <div
            className={containerClasses}
            style={style}
        >
            <div className="flex items-center gap-2">
                {receiver}

                <span
                    onBlur={(e) => updateDataRowTitle(e.currentTarget.innerText)}
                    onKeyPress={(e) => {
                    if (e.code === 'Enter') {
                        e.currentTarget.blur()
                        updateDataRowTitle(e.currentTarget.innerText)
                    }
                    }}
                    contentEditable
                    suppressContentEditableWarning
                    spellCheck={false}
                >
                    {title}
                </span>
            </div>

            <div className="flex items-center gap-2">
                {editable ? 
                (
                    <input
                        className={valueClasses}
                        type={type}
                        value={newValue}
                        onChange={(e) => setNewValue(e.currentTarget.value as T)}
                    />
                ) :
                (
                    <span className={valueClasses}>
                        {value}
                    </span>
                )}

                {sender}
            </div>
        </div>
    )
}

export default DataRow
