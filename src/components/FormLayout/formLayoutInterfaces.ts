import {
    SelectTabEvent,
    SelectTabData,
} from '@fluentui/react-components';

interface TabItem {
    value: string;
    icon?: React.ReactElement;
    label: string;
}

export interface FormLayoutProps {
    onBack: () => void;
    onSave: () => void;
    isSaveDisabled?: boolean;
    approvalActionsNode?: React.ReactNode;
    headerFormContent: React.ReactNode;
    tabs: TabItem[];
    activeTab: string;
    onTabSelect: (event: SelectTabEvent, data: SelectTabData) => void;
    footerContent?: React.ReactNode;
    children: React.ReactNode;
    saveText?: string;
    backText?: string;
}