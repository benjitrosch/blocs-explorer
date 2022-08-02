import { HTMLAttributes, LiHTMLAttributes } from "react"
import clsx from "clsx"

import { Resource, ResourcesData } from "../../types/ecs"
import { primitiveToBlocsType } from "../../utils/ecs"

type Props = HTMLAttributes<HTMLUListElement> & {
    resources: ResourcesData
}

type ItemProps = Omit<LiHTMLAttributes<HTMLLIElement>, 'resource'> & {
    name: string
    resource: Resource
}

const ResourcesList = ({ resources, className, ...props }: Props) => (
    <ul
        className={clsx("", className)}
        {...props}
    >
        {Object.keys(resources).map((resource, i) => (
            <ResourceListItem
                key={i}
                name={resource}
                resource={resources[resource]}
            />
        ))}
    </ul>
)

const ResourceListItem = ({
    name,
    resource,
    className,
    ...props 
}: ItemProps) => (
    <li
        className={clsx(
            'p-4 w-full bg-base-100 border-b-2 border-base-300 last:border-b-0 text-left',
            className
        )}
        {...props}
    >
        <h1 className="block text-xl">{name}</h1>
        <ul className="block">
            {Object.keys(resource.data).map((v, i) => (
                <li key={i} className="flex justify-between">
                    <span>
                        {v}
                        <span className="ml-1 text-base-content/50">
                            ({primitiveToBlocsType(resource.types[v])})
                        </span>
                    </span>
                    <span className="text-success">
                        {typeof resource.data[v] === 'object' ?
                            JSON.stringify(resource.data[v], null, 4) :
                            String(resource.data[v])
                        }
                    </span>
                </li>
            ))}
        </ul>
    </li>
)

export default ResourcesList
