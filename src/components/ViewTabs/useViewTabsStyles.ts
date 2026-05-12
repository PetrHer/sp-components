import { makeStyles, tokens } from "@fluentui/react-components";

export const useViewTabsStyles = makeStyles({
    titleBandRight: {
        display: 'flex',
        alignItems: 'flex-end',
    },
    tabListWrapper: {
        display: 'flex',
    },
    viewSelectorTabActive: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 24px',
        backgroundColor: tokens.colorNeutralBackground1,
        border: 'none',
        marginBottom: '-1px',
        borderTopLeftRadius: tokens.borderRadiusMedium,
        borderTopRightRadius: tokens.borderRadiusMedium,
        color: tokens.colorNeutralForeground1,
        cursor: 'pointer',
        position: 'relative',
        zIndex: 2,
        outline: 'none',
        boxShadow: '0 -2px 6px rgba(0,0,0,0.04)',
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '0',
            left: '12px',
            right: '12px',
            height: '3px',
            backgroundColor: tokens.colorCompoundBrandBackground,
            borderRadius: '2px',
        }
    },
    viewSelectorTabInactive: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 24px',
        backgroundColor: 'transparent',
        border: 'none',
        color: tokens.colorNeutralForeground2,
        cursor: 'pointer',
        '&:hover': {
            color: tokens.colorNeutralForeground1,
        }
    },
})