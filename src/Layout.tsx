import { Outlet } from "react-router-dom"
import { Button } from "react-daisyui"
import { XIcon } from "@heroicons/react/solid"

const Layout = () => (
    <main className='h-screen flex flex-col justify-between bg-base-300 text-base-content border-2 border-base-100'>
        <div aria-label="Title bar" className="titlebar flex items-center justify-between px-4 py-2 bg-base-200 border-b-2 border-base-100 z-50">
            <img className="h-4" src="/assets/blocs_text.svg" alt="blocs logo" />
            <Button
                aria-label="Close window"
                size="xs"
                className="titlebar-button -mr-2 hover:bg-error hover:text-white cursor-pointer"
                onClick={window.electronAPI.closeWindow}
            >
                <XIcon className="w-4" />
            </Button>
        </div>
        <Outlet />
    </main>
)

export default Layout
