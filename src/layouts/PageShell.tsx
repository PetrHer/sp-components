import * as React from "react";
import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export interface PageShellProps {
    header?: React.ReactNode;
    sidebar?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

const useStyles = makeStyles({
    root: {
        minHeight: "100vh",
        display: "grid",
        gridTemplateRows: "auto 1fr auto"
    },
    body: {
        display: "grid",
        gridTemplateColumns: "280px 1fr",
        gap: tokens.spacingHorizontalL,
        ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalL)
    },
    content: {
        minWidth: 0
    },
    sidebar: {
        minWidth: 0
    },
    header: {
        ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalL),
        borderBottom: `1px solid ${tokens.colorNeutralStroke2}`
    },
    footer: {
        ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalL),
        borderTop: `1px solid ${tokens.colorNeutralStroke2}`
    }
});

export const PageShell: React.FC<PageShellProps> = ({ header, sidebar, children, footer }) => {
    const styles = useStyles();

    return (
        <div className={styles.root}>
            {header ? <header className={styles.header}>{header}</header> : null}
            <div className={styles.body}>
                {sidebar ? <aside className={styles.sidebar}>{sidebar}</aside> : null}
                <main className={styles.content}>{children}</main>
            </div>
            {footer ? <footer className={styles.footer}>{footer}</footer> : null}
        </div>
    );
};
