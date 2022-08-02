import SidebarButton from "./SidebarButton"
import SidebarSection from "./SidebarSection"

type Props = {
    entities: string[]
    components: string[]
    systems: string[]
    resources: string[]
}

const Sidebar = ({
    entities,
    components,
    systems,
    resources,
}: Props) => (
    <ul>
        <SidebarSection
            title="entities"
        >
            {entities.map((entity) => (
                <li key={entity}>
                    <SidebarButton
                        title={entity.toString()}
                    >
                        <div className="w-8 border-t-2 border-base-100" />
                    </SidebarButton>
                </li>
            ))}
        </SidebarSection>
        <SidebarSection
            title="components"
        >
            {components.map((component) => (
                <li key={component}>
                    <SidebarButton
                        title={component}
                    >
                        <div className="w-8 border-t-2 border-base-100" />
                    </SidebarButton>
                </li>
            ))}
        </SidebarSection>
        <SidebarSection
            title="systems"
        >
            {systems.map((system) => (
                <li key={system}>
                    <SidebarButton
                        title={system}
                    >
                        <div className="w-8 border-t-2 border-base-100" />
                    </SidebarButton>
                </li>
            ))}
        </SidebarSection>
        <SidebarSection
            title="resources"
        >
            {resources.map((resource) => (
                <li key={resource}>
                    <SidebarButton
                        title={resource}
                    >
                        <div className="w-8 border-t-2 border-base-100" />
                    </SidebarButton>
                </li>
            ))}
        </SidebarSection>
    </ul>
)

export default Sidebar
