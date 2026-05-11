export interface ImportMapperProps {
    isOpen: boolean;
    onClose: () => void;
    excelColumns: string[];
    targetColumns: string[];
    onConfirm: (mapping: Record<string, string>) => void;
    columnTranslations?: Record<string, string>;
}