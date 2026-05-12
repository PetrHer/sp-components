import React from 'react'
import {
    Text,
} from '@fluentui/react-components';
import { useViewTabsStyles } from './useViewTabsStyles';
import { ViewTabsProps } from './viewTabsInterfaces';

const ViewTabs: React.FC<ViewTabsProps> = (props: ViewTabsProps) => {
    const styles = useViewTabsStyles()
    const { tabs, setActiveTab, activeTab } = props

    return (
        <div className={styles.titleBandRight}>
            <div className={styles.tabListWrapper}>
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        className={activeTab === tab.key ? styles.viewSelectorTabActive : styles.viewSelectorTabInactive}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.icon}
                        <Text style={{ marginLeft: '8px' }}>{tab.label}</Text>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default ViewTabs