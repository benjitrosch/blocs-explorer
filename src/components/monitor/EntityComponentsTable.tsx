import { useMemo } from "react"

import { ComponentsData, EntitiesData } from "../../types/ecs"
import { primitiveToBlocsType } from "../../utils/ecs"

type Props = {
    entities: EntitiesData
    components: ComponentsData
}

const EntityComponentsTable = ({
    entities,
    components
}: Props) => {
    const componentTypes = useMemo(() => Object.keys(components), [components])
    const componentFields = useMemo(() => {
        const fields: { [component: string]: { [field: string]: string } } = {}
        componentTypes.forEach((component) => {
            fields[component] = components[component].types
        })
        return fields
    }, [components, componentTypes])
    const componentColors = useMemo(() => {
        const colors: { [component: string]: { border: string, bg: string  } } = {}
        componentTypes.forEach((component) => {
            const color = `rgba(${[1,2,3].map((x) => Math.floor(Math.random()*256|0))},0000.5)`
            colors[component] = { border: color, bg: color.replace(new RegExp('0000.5'), '0.05') }
        })
        return colors
    }, [componentTypes])

    console.log(componentFields)

    return (
        <table className="text-center table-fixed">
            <colgroup span={2} />
            {componentTypes.map((component, i) => (<colgroup span={Object.keys(componentFields[component]).length} key={i} />))}
            <thead className="sticky top-0 h-full bg-base-200">
                <tr>
                    <th colSpan={1} scope="colgroup" className="pl-2 pr-8 bg-base-200 font-normal text-left">ENTITY</th>
                    {componentTypes.map((component) => (
                        <th
                            key={component}
                            colSpan={Object.keys(componentFields[component]).length}
                            scope="colgroup"
                            className="pl-2 pr-8 font-normal text-left uppercase"
                            style={{
                                background: componentColors[component].bg,
                            }}
                        >
                            {component}
                        </th>
                    ))}
                </tr>
                <tr>
                    <th scope="col" className="pl-2 pr-8 bg-base-200 font-normal text-left">name</th>
                    {componentTypes.map((component) => (
                        Object.keys(componentFields[component]).map((field) => (
                            <th
                                key={field}
                                scope="col"
                                className="pl-2 pr-4 font-normal text-xs text-left"
                                style={{
                                    background: componentColors[component].bg,
                                }}
                            >
                                {field}
                                <span className="ml-1 text-base-content/50">
                                    ({primitiveToBlocsType(componentFields[component][field])})
                                </span>
                            </th>
                        ))
                    ))}
                </tr>
            </thead>
            <tbody>
                {Object.entries(entities).map(([id, name], i) => (
                    <tr key={`${name}_${id}_${i}`} className="bg-base-100 border-b border-base-300 text-base-content">
                        <th scope="row" className="pl-2 pr-8 bg-base-100 font-normal text-left">{name}</th>
                        {componentTypes.map((component) => {
                            const entityData = components[component].data.find((c) => c.entity_id === Number(id))
                            if (!entityData) {
                                return Object.keys(componentFields[component]).map((field, i) => (
                                    <td
                                    className="p-8"
                                        key={`${name}_${id}_${field}_blank_${i}`}
                                        style={{
                                            background: componentColors[component].bg,
                                        }}
                                    />
                                ))
                            }
                            return Object.entries(entityData?.component).map(([field, value]) => (
                                <td
                                    key={`${name}_${id}_${field}_value_${i}`}
                                    style={{
                                        background: componentColors[component].bg,
                                    }}
                                >
                                    {JSON.stringify(value)}
                                </td>
                            ))
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default EntityComponentsTable
