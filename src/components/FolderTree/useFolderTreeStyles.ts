import { makeStyles, tokens } from '@fluentui/react-components';

export const useFolderTreeStyles = makeStyles({
    treeItemActive: {
        backgroundColor: `#f3f2f1`,
        color: `#242424`,
        fontWeight: tokens.fontWeightSemibold
    },
    folderIcon: {
        color: "#FFD700", // Yellow icon as requested
        fontSize: '20px'
    }
});