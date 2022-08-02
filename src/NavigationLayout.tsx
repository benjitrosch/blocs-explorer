import { Outlet, useLocation, useNavigate } from "react-router-dom"

import ProjectProvider from "./context/ProjectContext"
import Navigation from "./components/Navigation"

const NavigationLayout = () => {
    const location = useLocation()
    const navigate = useNavigate()

    return (
        <ProjectProvider>
            <div className="flex-1 w-full h-[0] text-center bg-gradient-to-bl from-neutral via-base-300 to-base-300">
                <Outlet />
            </div>
            <div className="z-20 py-6 bg-gradient-to-bl from-base-300 via-base-300 to-base-100">
                <Navigation
                    path={location.pathname}
                    navigate={(p) => navigate(p)}
                />
            </div>
        </ProjectProvider>
    )
}

export default NavigationLayout
