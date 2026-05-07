export interface UniversalGridColumn<T> {
    key: string;
    header: string;
    hidden?: boolean;
    defaultWidth?: number;
    minWidth?: number;
    isEditable?: boolean;
    getValue: (item: T) => string | number | null | undefined;
    getSortValue?: (item: T) => string | number | null | undefined;
    formatValue?: (value: any) => string;
    isModified?: (item: T) => boolean;
    getStrikethroughValue?: (item: T) => string | number | null | undefined;
    renderCell?: (item: T, displayValue: string, isEditing: boolean) => React.ReactNode;
    align?: 'left' | 'right' | 'center';
    disableFilter?: boolean;
    disableSort?: boolean;
    cellClassName?: (item: T) => string | undefined;
    cellStyle?: (item: T) => React.CSSProperties | undefined;
    tooltipContent?: (item: T, displayValue: string) => React.ReactNode;
}

export interface UniversalGridProps<T> {
    items: T[];
    columns: UniversalGridColumn<T>[];
    getItemId: (item: T) => string;
    gridId: string;

    selectedIds?: Set<string>;
    onSelectionChange?: (ids: Set<string>) => void;

    onRowSave?: (item: T, columnKey: string, newValue: string) => Promise<void>;

    onRowClick?: (item: T) => void;

    groupBy?: {
        primary: { key: string; label?: (val: string) => string };
        secondary?: { key: string; label?: (val: string) => string };
    };

    onFiltersChange?: (hasActive: boolean) => void;

    getRowClassName?: (item: T, isSelected: boolean) => string | undefined;

    emptyMessageSubtext?: string;
    emptyMessageTitle?: string;
}

export interface UniversalGridHandle {
    expandAllGroups: () => void;
    collapseAllGroups: () => void;
    clearAllFilters: () => void;
    hasActiveFilters: () => boolean;
}

export interface ColumnFilterState {
    [columnKey: string]: Set<string>;
}

export interface SortState {
    columnKey: string;
    direction: 'asc' | 'desc';
}

export interface EditingState {
    itemId: string;
    columnKey: string;
}