import { Outlet } from "react-router-dom"

const StandaloneLayout = () => (
    <div className="flex-1 w-full h-[0]">
        <Outlet />
    </div>
)

export default StandaloneLayout