import * as React from "react";
import { Card, CardHeader, Text, makeStyles, shorthands, tokens } from "@fluentui/react-components";

export interface CardSectionProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

const useStyles = makeStyles({
    card: {
        ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
        rowGap: tokens.spacingVerticalS
    }
});

export const CardSection: React.FC<CardSectionProps> = ({ title, subtitle, children }) => {
    const styles = useStyles();

    return (
        <Card className={styles.card}>
            <CardHeader
                header={<Text weight="semibold">{title}</Text>}
                description={subtitle ? <Text size={200}>{subtitle}</Text> : undefined}
            />
            {children}
        </Card>
    );
};
