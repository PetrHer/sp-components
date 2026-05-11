import {
    tokens,
    Toolbar,
    ToolbarButton,
    TabList,
    Tab,
} from '@fluentui/react-components';
import { ArrowLeftRegular, CheckmarkCircleRegular } from '@fluentui/react-icons';
import * as React from 'react';
import { useFormLayoutStyles } from './useFormLayoutStyles';
import { FormLayoutProps } from './formLayoutInterfaces';

export const FormLayout: React.FC<FormLayoutProps> = ({
    onBack,
    onSave,
    isSaveDisabled,
    approvalActionsNode,
    headerFormContent,
    tabs,
    activeTab,
    onTabSelect,
    footerContent,
    children,
    saveText = 'Uložit koncept',
    backText = 'Zpět na výpis'
}) => {
    const styles = useFormLayoutStyles();

    return (
        <div className={styles.shell}>
            <div className={styles.commandBar}>
                <Toolbar size="medium" style={{ padding: 0 }}>
                    <ToolbarButton icon={<ArrowLeftRegular />} onClick={onBack}>{backText}</ToolbarButton>
                    <div style={{ width: '1px', height: '20px', backgroundColor: tokens.colorNeutralStroke1, margin: '0 8px' }} />
                    <ToolbarButton
                        icon={<CheckmarkCircleRegular style={{ color: tokens.colorPaletteBlueForeground2 }} />}
                        onClick={onSave}
                        disabled={isSaveDisabled}
                    >
                        {saveText}
                    </ToolbarButton>
                    {approvalActionsNode}
                </Toolbar>
            </div>

            <main className={styles.pageContent}>
                <div className={styles.formHeaderBlock}>
                    <div className={styles.formAttributes}>
                        {headerFormContent}
                    </div>

                    <div>
                        <TabList selectedValue={activeTab} onTabSelect={onTabSelect}>
                            {tabs.map(tab => (
                                <Tab key={tab.value} value={tab.value} icon={tab.icon}>
                                    {tab.label}
                                </Tab>
                            ))}
                        </TabList>
                    </div>
                </div>

                <div className={styles.contentBlock}>
                    {children}
                </div>
            </main>

            {footerContent && (
                <footer className={styles.footer}>
                    {footerContent}
                </footer>
            )}
        </div>
    );
};
