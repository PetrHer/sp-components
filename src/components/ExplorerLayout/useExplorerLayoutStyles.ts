import { makeStyles, tokens } from "@fluentui/react-components";

export const useExplorerLayoutStyles = makeStyles({
    shell: {
        height: '100%',
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: tokens.colorNeutralBackground3,
    },
    topToolbar: {
        backgroundColor: tokens.colorNeutralBackground1,
        padding: `8px ${tokens.spacingHorizontalL}`,
        borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    mainContent: {
        display: 'flex',
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
    },
    sidePanel: {
        width: '280px',
        backgroundColor: tokens.colorNeutralBackground1,
        borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        overflow: 'hidden',
    },
    sidePanelCollapsed: {
        width: '0px',
        borderRight: 'none',
    },
    contentArea: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
    },
    titleBand: {
        padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalL} 0 ${tokens.spacingHorizontalL}`,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 0,
    },
    whiteContainer: {
        backgroundColor: tokens.colorNeutralBackground1,
        borderRadius: tokens.borderRadiusMedium,
        margin: `0 ${tokens.spacingHorizontalL} ${tokens.spacingVerticalL} ${tokens.spacingHorizontalL}`,
        flex: 1,
        minHeight: 0,
        overflow: 'auto',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
    },
});