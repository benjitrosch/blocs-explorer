import {
    RefObject,
    useCallback,
    useEffect,
    useState
} from "react"

import { Position } from "../types/bounds"

const useContextMenu = (ref: RefObject<HTMLElement>) => {
    const [anchorPoint, setAnchorPoint] = useState<Position>({ x: 0, y: 0 })
    const [showMenu,    toggleShowMenu] = useState<boolean>(false)

    const onContextMenu = useCallback((e: MouseEvent) => {
        e.preventDefault()

        const element = ref.current
        const parentElement = ref.current?.offsetParent as HTMLElement
        if (element && parentElement) {
            setAnchorPoint({
                x: e.pageX - parentElement.offsetLeft,
                y: e.pageY - parentElement.offsetTop
            })
        }

        toggleShowMenu(true)
    }, [toggleShowMenu, setAnchorPoint])

    const onClick = useCallback(() => {
        if (showMenu) toggleShowMenu(false)
    }, [showMenu])

    useEffect(() => {
        if (ref != null) {
            const element = ref.current

            if (element != null) {
                element.addEventListener('contextmenu', onContextMenu)
                // element.addEventListener('mouseout', onClick)
                document.addEventListener('click', onClick)

                return () => {
                    element.removeEventListener('contextmenu', onContextMenu)
                    // element.removeEventListener('mouseout', onClick)
                    document.removeEventListener('click', onClick)
                }
            }
        }
    }, [onClick, onContextMenu, ref])

    return {
        anchorPoint,
        showMenu,
    }
}

export default useContextMenu
