export type EntitiesData = {
    [id: number]: string
}

export type Component = {
    data: {
        entity_id: number
        component: {
            [field: string]: any
        }
    }[]
    types: {
        [field: string]: string
    }
}

export type ComponentsData = {
    [component: string]: Component
}

export type SystemsData = {
    [system: string]: any
} 

export type Resource = {
    data: {
        [field: string]: any
    }
    types: {
        [field: string]: string
    }
}

export type ResourcesData = {
    [resource: string]: Resource
}
