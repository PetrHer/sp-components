import {
    makeStyles,
    tokens,
} from '@fluentui/react-components';

export const useFormLayoutStyles = makeStyles({
    shell: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: tokens.colorNeutralBackground3,
    },
    commandBar: {
        padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
        backgroundColor: tokens.colorNeutralBackground1,
        borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
        flexShrink: 0,
    },
    pageContent: {
        flex: 1,
        padding: tokens.spacingHorizontalL,
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacingVerticalL,
        minHeight: 0,
    },
    formHeaderBlock: {
        backgroundColor: tokens.colorNeutralBackground1,
        borderRadius: tokens.borderRadiusMedium,
        boxShadow: tokens.shadow2,
        padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalL}`,
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacingVerticalL,
        flexShrink: 0,
    },
    formAttributes: {
        display: 'flex',
        gap: tokens.spacingHorizontalXL,
        alignItems: 'flex-start',
    },
    contentBlock: {
        flex: 1,
        minHeight: 0,
        backgroundColor: tokens.colorNeutralBackground1,
        borderRadius: tokens.borderRadiusMedium,
        boxShadow: tokens.shadow2,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        padding: tokens.spacingHorizontalL,
    },
    footer: {
        padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
        borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
        backgroundColor: tokens.colorNeutralBackground1,
        flexShrink: 0,
    }
});
