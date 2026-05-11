import {
    makeStyles,
    tokens,
} from '@fluentui/react-components';

export const useImportMapperStyles = makeStyles({
    mappingRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: `1px solid ${tokens.colorNeutralStroke2}`
    },
    mappingLabel: {
        fontWeight: tokens.fontWeightSemibold
    }
});