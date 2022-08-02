import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react"
import { Button, Input } from "react-daisyui"
import clsx from "clsx"

import {
    ComponentsData,
    EntitiesData,
    ResourcesData,
    SystemsData
} from "../types/ecs"

import Sidebar from "../components/monitor/Sidebar"
import EntityComponentsTable from "../components/monitor/EntityComponentsTable"
import ResourcesList from "../components/monitor/ResourcesList"

type MonitorResults = {
    project: {
        title: string
        fps: number
    }
    ecs: {
        entities: EntitiesData
        components: ComponentsData
        systems: SystemsData
        resources: ResourcesData
    }
}

const Monitor = () => {
    const [port,         setPort]         = useState<number>(4001)
    const [pollInterval, setPollInterval] = useState<number>(3)
    const [refreshing,   setRefreshing]   = useState<boolean>(false)
    const [data,         setData]         = useState<MonitorResults | null>(null)

    const entities   = useMemo(() => data?.ecs.entities    ?? {}, [data])
    const components = useMemo(() => data?.ecs.components  ?? {}, [data])
    const systems    = useMemo(() => data?.ecs.systems     ?? {}, [data])
    const resources  = useMemo(() => data?.ecs.resources   ?? {}, [data])

    const refreshMonitorData = useCallback(async () => {
        setRefreshing(true)
        try {
            const res = await fetch(`http://localhost:${port}/`)
            const data = await res.json()

            if (res.ok) setData(data)
            else Promise.reject(data)
        } catch (e) {
            console.error(e)
            // setData(null)
        } finally {
            setRefreshing(false)
        }
    }, [port])
    
    useEffect(() => {
        refreshMonitorData()
    }, [refreshMonitorData])

    useEffect(() => {
        const interval = setInterval(refreshMonitorData, pollInterval * 1000)
        return () => clearInterval(interval)
    }, [pollInterval, port, refreshMonitorData])

    return (
        <section className="w-full h-full">       
            <div className="w-full h-[6%] flex gap-x-2 items-center justify-between px-4 bg-base-300 border-b-2 border-base-100">
                <span className="flex items-center gap-x-2">
                    <span>port:</span>
                    <Input
                        className="w-12 text-center"
                        type="number"
                        size="xs"
                        placeholder="search..."
                        value={port}
                        onChange={(e) => setPort(Number(e.currentTarget.value.slice(0, 4)))}
                    />
                    <span>poll interval (sec):</span>
                    <Input
                        className="w-8 text-center"
                        type="number"
                        size="xs"
                        placeholder="search..."
                        value={pollInterval}
                        onChange={(e) => setPollInterval(Number(e.currentTarget.value.slice(0, 2)))}
                    />
                    <Button
                        size="xs"
                        color="warning"
                        onClick={refreshMonitorData}
                        loading={refreshing}
                        disabled={refreshing}
                    >
                        refresh
                    </Button>
                    {refreshing && (
                        <span className="opacity-40">refreshing...</span>
                    )}
                </span>
                <span className="flex items-center gap-x-2">
                    <span>{data ? "connected" : "disconnected"} </span>
                    <div aria-label="status" className={clsx("p-2 rounded-full bg-warning", {
                        'bg-success': data,
                        'bg-error':  !data
                    })} />
                </span>
            </div>
            <div className="w-full h-[94%] bg-black grid grid-cols-6">
                {!data ? (
                    <div className="flex flex-col w-full h-full items-center justify-center col-span-6">
                        <h2 className="text-2xl">no project connected :(</h2>
                        <h3>GET json data from port {port}</h3>
                        <br />
                    </div>
                ) : (
                    <>
                        <div className="h-full bg-base-300 overflow-y-auto">
                            <Sidebar
                                entities={[...Object.values(entities)].sort()}
                                components={[...Object.keys(components)].sort()}
                                systems={[...Object.keys(systems)].sort()}
                                resources={[...Object.keys(resources)].sort()}
                            />
                        </div>
                        <div className="h-full col-span-5 overflow-y-auto">
                            <EntityComponentsTable entities={entities} components={components} />
                            {/* <ResourcesList resources={resources} /> */}
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}

export default Monitor