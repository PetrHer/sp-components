import { makeStyles, tokens } from "@fluentui/react-components";

export const useHierarchyPickerStyles = makeStyles({
    pickerContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        width: '100%',
        height: '100%',
    },
    selectedTagsArea: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        minHeight: '32px',
        padding: '4px',
        border: `1px solid ${tokens.colorNeutralStroke1}`,
        borderRadius: tokens.borderRadiusMedium,
        alignItems: 'center',
        backgroundColor: tokens.colorNeutralBackground1,
        boxSizing: 'border-box',
        height: '100%',
    },
    surface: {
        width: '950px',
        maxWidth: '95vw'
    },
    selectorContainer: {
        border: `1px solid ${tokens.colorNeutralStroke1}`,
        borderRadius: tokens.borderRadiusMedium,
        marginTop: '8px',
        height: '500px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
    },
    searchWrapper: {
        padding: '8px',
        borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
        backgroundColor: tokens.colorNeutralBackground2,
        display: 'flex',
        justifyContent: 'flex-end'
    },
    mainLayout: {
        display: 'flex',
        flex: 1,
        minHeight: 0
    },
    sideTree: {
        width: '250px',
        borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
        backgroundColor: tokens.colorNeutralBackground1,
        overflowY: 'auto',
        padding: '8px'
    },
    treeItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '6px 8px',
        cursor: 'pointer',
        borderRadius: tokens.borderRadiusSmall,
        gap: '8px',
        fontSize: '13px',
        '&:hover': {
            backgroundColor: tokens.colorNeutralBackground1Hover
        }
    },
    treeItemActive: {
        backgroundColor: `#f3f2f1`,
        color: `#242424`,
        fontWeight: tokens.fontWeightSemibold
    },
    browserArea: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0
    },
    browserHeader: {
        padding: '8px 12px',
        borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: tokens.colorNeutralBackground1
    },
    tableWrapper: {
        flex: 1,
        overflowY: 'auto'
    },
    row: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: tokens.colorNeutralBackground1Hover
        }
    },
    selectedRow: {
        backgroundColor: `#f3f2f1 !important`,
        color: `#242424 !important`,
        '&:hover': {
            backgroundColor: `#edebe9 !important`
        }
    },
    folderIcon: {
        color: "#FFD700"
    },
    pricelistIcon: {
        color: tokens.colorPaletteBlueBorderActive
    }
});