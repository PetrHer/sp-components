import React from 'react';
import { useExplorerLayoutStyles } from './useExplorerLayoutStyles';
import { ExplorerLayoutProps } from './explorerLayoutInterfaces';

// ----- slot marker types -----

type SlotType = 'toolbar' | 'sidebar' | 'header' | 'content';

function createSlot(slot: SlotType): React.FC<{ children: React.ReactNode }> & { _slot: SlotType } {
    const Slot: React.FC<{ children: React.ReactNode }> & { _slot: SlotType } =
        ({ children }) => <>{children}</>;
    Slot._slot = slot;
    Slot.displayName = `ExplorerLayout.${slot.charAt(0).toUpperCase() + slot.slice(1)}`;
    return Slot;
}

// ----- sub-components -----

const Toolbar = createSlot('toolbar');
const Sidebar = createSlot('sidebar');
const Header = createSlot('header');
const Content = createSlot('content');

// ----- root component -----

const ExplorerLayoutRoot: React.FC<ExplorerLayoutProps> = ({ children, isSidebarOpen = true }) => {
    const styles = useExplorerLayoutStyles();

    const slots: Partial<Record<SlotType, React.ReactNode>> = {};

    React.Children.forEach(children, child => {
        if (!React.isValidElement(child)) return;
        const slot = (child.type as unknown as { _slot?: SlotType })._slot;
        if (slot) slots[slot] = (child as React.ReactElement<{ children: React.ReactNode }>).props.children;
    });

    return (
        <div className={styles.shell}>
            {slots.toolbar && (
                <div className={styles.topToolbar}>{slots.toolbar}</div>
            )}
            <div className={styles.mainContent}>
                {slots.sidebar && (
                    <div className={`${styles.sidePanel} ${!isSidebarOpen ? styles.sidePanelCollapsed : ''}`}>
                        {slots.sidebar}
                    </div>
                )}
                <div className={styles.contentArea}>
                    {slots.header && (
                        <div className={styles.titleBand}>{slots.header}</div>
                    )}
                    <div className={styles.whiteContainer}>
                        {slots.content}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ----- export -----

export const ExplorerLayout = Object.assign(ExplorerLayoutRoot, {
    Toolbar,
    Sidebar,
    Header,
    Content,
});
