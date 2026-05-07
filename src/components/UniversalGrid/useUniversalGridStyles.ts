import {
    makeStyles,
    tokens,
} from '@fluentui/react-components';

export const useUniversalGridStyles = makeStyles({
    container: {
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    table: {
        width: '100%',
        tableLayout: 'fixed',
        borderCollapse: 'separate',
        borderSpacing: 0,
        paddingRight: '6px'
    },
    tableWrapper: {
        flex: 1,
        overflow: 'auto',
        position: 'relative'
    },
    stickyHeaderCell: {
        position: 'sticky',
        top: 0,
        zIndex: 2,
        backgroundColor: tokens.colorNeutralBackground1,
        fontWeight: tokens.fontWeightBold,
        boxShadow: `0 1px 0 ${tokens.colorNeutralStroke2}`,
        padding: 0,
        height: '32px',
        overflow: 'visible',
    },
    stickyHeaderCellActive: {
        borderBottom: `2px solid ${tokens.colorBrandBackground}`,
        color: tokens.colorBrandForeground1,
    },
    headerCellContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 'calc(100% - 4px)',
        gap: tokens.spacingHorizontalS,
        padding: `0 ${tokens.spacingHorizontalS}`,
        margin: '2px',
        height: '28px',
        borderRadius: tokens.borderRadiusMedium,
        boxSizing: 'border-box',
        ':hover': {
            backgroundColor: tokens.colorNeutralBackground2Hover,
        },
    },
    headerText: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        flex: '1 1 auto',
        minWidth: 0,
    },
    resizer: {
        position: 'absolute',
        top: 0,
        right: '-6px',
        bottom: 0,
        width: '12px',
        cursor: 'col-resize',
        zIndex: 10,
        backgroundColor: 'transparent',
        '::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '50%',
            width: '3px',
            transform: 'translateX(-50%)',
        },
        ':hover::after': {
            backgroundColor: tokens.colorBrandBackground,
        },
    },
    resizerActive: {
        '::after': {
            backgroundColor: tokens.colorBrandBackground,
        },
    },
    filterTriggerWrapper: {
        flex: '0 0 auto',
        display: 'flex',
        alignItems: 'center',
    },
    popoverSurface: {
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacingVerticalS,
        padding: tokens.spacingHorizontalM,
        minWidth: '200px',
        maxWidth: '300px',
    },
    popoverActions: {
        display: 'flex',
        flexDirection: 'column',
    },
    actionButton: {
        justifyContent: 'flex-start',
        fontWeight: tokens.fontWeightRegular,
    },
    filterListContainer: {
        maxHeight: '200px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
    },
    searchFilterInput: {
        width: '100%',
        marginBottom: tokens.spacingVerticalS,
    },
    bodyCell: {
        borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
        padding: `0 ${tokens.spacingHorizontalM}`,
        height: '40px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
        ':hover': {
            backgroundColor: tokens.colorNeutralBackground3Hover,
            cursor: 'default',
        },
    },
    cellLayout: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalS,
        overflow: 'hidden'
    },
    textContainer: {
        flex: '1 1 auto',
        minWidth: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        maskImage: 'linear-gradient(to right, black calc(100% - 24px), transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, black calc(100% - 24px), transparent 100%)',
    },
    textContainerRight: {
        maskImage: 'linear-gradient(to left, black calc(100% - 12px), transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to left, black calc(100% - 12px), transparent 100%)',
    },
    pencilButton: {
        flex: '0 0 auto',
        minWidth: '24px',
        width: '24px',
        height: '24px',
        padding: 0,
        color: 'inherit',
    },
    editInput: {
        width: '100%',
        minWidth: '60px',
    },
    groupHeaderRow: {
        backgroundColor: tokens.colorNeutralBackground2,
    },
    groupHeaderCell: {
        borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
        padding: `0 ${tokens.spacingHorizontalM}`,
        height: '32px',
        boxSizing: 'border-box',
    },
    groupHeaderSecondary: {},
    groupHeaderCellInner: {
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    },
    groupHeaderCellInnerSecondary: {
        paddingLeft: `calc(${tokens.spacingHorizontalL} + ${tokens.spacingHorizontalS})`,
    },
    rowDefault: {
        color: tokens.colorNeutralForeground3,
        backgroundColor: tokens.colorNeutralBackground1,
        ':hover': {
            backgroundColor: tokens.colorNeutralBackground1Hover,
        },
    },
    rowSelected: {
        backgroundColor: `#f3f2f1 !important`,
        color: `#242424 !important`,
        ':hover': {
            backgroundColor: `#edebe9 !important`,
        }
    },
    cellTextModified: {
        fontWeight: tokens.fontWeightBold,
        color: tokens.colorNeutralForeground1,
    },
    checkboxCell: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    roundedCheckbox: {
        '& .fui-Checkbox__indicator': {
            borderRadius: '50% !important',
        }
    }
});