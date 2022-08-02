import { useEffect, useState } from 'react'
import { Button, Checkbox, Form, Input, Radio } from 'react-daisyui'

enum WorldType
{
    NONE    = 'none',
    ECS     = 'ecs',
    CLASSIC = 'classic',
}

const New = () => {
    const [name,      setName]      = useState<string>('')
    const [location,  setLocation]  = useState<string>('')
    const [width,     setWidth]     = useState<number>(640)
    const [height,    setHeight]    = useState<number>(480)
    const [framerate, setFramerate] = useState<number>(60)
    const [world,     setWorld]     = useState<WorldType>(WorldType.NONE)
    const [imgui,     setImgui]     = useState<boolean>(true)
    const [tracy,     setTracy]     = useState<boolean>(false)

    useEffect(() => {
        window.electronAPI.addPathListener(setLocation)
        return () => window.electronAPI.removePathListener(setLocation)
    }, [])

    return (
        <section>
            <Form>
                <div className='h-full p-4 flex flex-col gap-y-4'>
                    <fieldset className='flex flex-col gap-2 p-4 bg-base-100 rounded-box'>
                        <div className='flex items-center justify-between gap-x-2'>
                            <label htmlFor='name'>name</label>
                            <Input
                                className='flex-1 max-w-[256px]'
                                color={name.length < 3 ? "ghost" : "success"}
                                id="name"
                                size="sm"
                                placeholder='new project...'
                                maxLength={32}
                                value={name}
                                onChange={(e) => setName(e.target.value.replace(/[^\w\s]/gi, ''))}
                            />
                        </div>

                        <div className='flex items-center justify-between gap-x-2'>
                            <label htmlFor='location'>location</label>
                            <Input
                                className='flex-1 max-w-[256px] cursor-pointer'
                                color={location.length ? "success" : "ghost"}
                                id="location"
                                value={location}
                                placeholder="location..."
                                size="sm"
                                onClick={window.electronAPI.openPathDialog}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") window.electronAPI.openPathDialog()
                                }}
                                readOnly
                            />
                        </div>
                    </fieldset>

                    <fieldset className='flex flex-col gap-2 p-4 bg-base-100 rounded-box'>
                        <div className='flex items-center justify-between gap-x-2'>
                            <label htmlFor='width'>width</label>
                            <Input
                                className='flex-1 max-w-[256px]'
                                id="width"
                                type="number"
                                value={width}
                                onChange={(e) => setWidth(
                                    Math.max(1, Number(e.currentTarget.value))
                                )}
                                size="sm"
                            />
                        </div>

                        <div className='flex items-center justify-between gap-x-2'>
                            <label htmlFor='height'>height</label>
                            <Input
                                type="number"
                                className='flex-1 max-w-[256px]'
                                id="height"
                                value={height}
                                onChange={(e) => setHeight(
                                    Math.max(1, Number(e.currentTarget.value))
                                )}
                                size="sm"
                            />  
                        </div>

                        <div className='flex items-center justify-between gap-x-2'>
                            <label htmlFor='framerate'>framerate</label>
                            <Input
                                className='flex-1 max-w-[256px]'
                                id="framerate"
                                type="number"
                                value={framerate}
                                onChange={(e) => setFramerate(
                                    Math.max(1, Math.min(144, Number(e.currentTarget.value)))
                                )}
                                max={144}
                                min={12}
                                size="sm"
                            />
                        </div>

                        <div className='flex items-center justify-between gap-x-2'>
                            <label>world</label>

                            <div className='flex items-center justify-between w-full max-w-[256px] gap-x-2'>
                                <label htmlFor='none'>none</label>
                                <Radio
                                    id="none"
                                    name="world"
                                    value={WorldType.NONE}
                                    checked={world === WorldType.NONE}
                                    onChange={(e) => setWorld(e.currentTarget.value as WorldType)}
                                />
                                
                                <label htmlFor='ecs'>ecs</label>
                                <Radio
                                    id="ecs"
                                    name="world"
                                    color="primary"
                                    value={WorldType.ECS}
                                    checked={world === WorldType.ECS}
                                    onChange={(e) => setWorld(e.currentTarget.value as WorldType)}
                                />

                                <label htmlFor='classic'>classic</label>
                                <Radio
                                    id="classic"
                                    name="world"
                                    color="primary"
                                    value={WorldType.CLASSIC}
                                    checked={world === WorldType.CLASSIC}
                                    onChange={(e) => setWorld(e.currentTarget.value as WorldType)}
                                />
                            </div>
                        </div>
                    </fieldset>

                    <fieldset className='flex flex-col gap-2 p-4 bg-base-100 rounded-box'>
                        <div className='flex items-cetner justify-between gap-x-2'>
                            <label htmlFor='imgui'>dear imgui</label>
                            <Checkbox
                                id="imgui"
                                color="primary"
                                checked={imgui}
                                onChange={(e) => setImgui(e.currentTarget.checked)}
                            />
                        </div>

                        <div className='flex items-cetner justify-between gap-x-2'>
                            <label htmlFor='tracy'>tracy profiler</label>
                            <Checkbox
                                id="tracy"
                                color="primary"
                                checked={tracy}
                                onChange={(e) => setTracy(e.currentTarget.checked)}
                            />
                        </div>
                    </fieldset>
                </div>

                <div className='fixed bottom-0 w-full flex items-center justify-end gap-x-2 px-4 py-2 bg-base-300'>
                    <Button
                        type="reset"
                        size="sm"
                        color="error"
                        onClick={window.electronAPI.closeWindow}
                    >
                        cancel
                    </Button>

                    <Button
                        onClick={() => {
                            window.electronAPI.createProjectFiles(name.trim(), location, width, height, framerate, world, imgui, tracy)
                            window.electronAPI.closeWindow()
                        }}
                        type="submit"
                        size="sm"
                        color="primary"
                        disabled={!location.length || name.length < 3}
                    >
                        new project
                    </Button>
                </div>
            </Form>

        </section>
    )
}

export default New