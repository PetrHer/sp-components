
export interface ViewTabsProps {
    tabs: {
        key: string,
        label: string,
        icon?: React.ReactNode,
    }[],
    setActiveTab: (tab: string) => void,
    activeTab: string
}
