import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow,
    Input,
    Button,
    Popover,
    PopoverSurface,
    PopoverTrigger,
    Checkbox,
    Divider,
    tokens,
    Text,
    Tooltip,
    mergeClasses
} from '@fluentui/react-components';
import {
    EditRegular,
    FilterRegular,
    FilterFilled,
    TextSortAscendingRegular,
    TextSortDescendingRegular,
    FilterDismissRegular,
    ChevronDownRegular,
    ChevronRightRegular,
    CheckmarkRegular
} from '@fluentui/react-icons';
import * as React from 'react';
import { useMemo, useState, useRef, useEffect, useImperativeHandle } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { useUniversalGridStyles } from './useUniversalGridStyles';
import { UniversalGridProps, UniversalGridHandle, EditingState, ColumnFilterState, SortState } from './universalGridInterfaces';

const CellSpinner: React.FC = () => (
    <>
        <style>{`@keyframes ipc-cell-spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid #e0e0e0',
            borderTopColor: '#00322e',
            borderRadius: '50%',
            animation: 'ipc-cell-spin 0.8s linear infinite',
            flexShrink: 0,
            marginLeft: '4px',
        }} />
    </>
);

function toStr(val: any): string {
    return val === null ? '' : String(val);
}

const UniversalGridInner = <T,>(props: UniversalGridProps<T>, ref: React.ForwardedRef<UniversalGridHandle>) => {
    const {
        items,
        columns,
        getItemId,
        gridId,
        selectedIds,
        onSelectionChange,
        onRowSave,
        onRowClick,
        groupBy,
        onFiltersChange,
        getRowClassName,
        emptyMessageTitle = "Žádná data k zobrazení",
        emptyMessageSubtext = "Importujte data nebo počkejte na načtení."
    } = props;

    const visibleColumns = useMemo(() => columns.filter(c => !c.hidden), [columns]);

    const styles = useUniversalGridStyles();
    const hasSelection = Boolean(selectedIds && onSelectionChange);

    const STORAGE_KEY = `universal-grid-colwidths:${gridId}`;
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored) as Record<string, number>;
                const merged: Record<string, number> = {};
                columns.forEach(col => {
                    merged[col.key] = parsed[col.key] ?? col.defaultWidth ?? 160;
                });
                return merged;
            }
        } catch { /* ignore */ }

        const initialMap: Record<string, number> = {};
        columns.forEach(col => {
            initialMap[col.key] = col.defaultWidth ?? 160;
        });
        return initialMap;
    });

    const isResizingRef = useRef<{ key: string; startX: number; startW: number } | null>(null);
    const [resizingKey, setResizingKey] = useState<string | null>(null);

    useEffect(() => {
        setColumnWidths(prev => {
            const next = { ...prev };
            let changed = false;
            columns.forEach(col => {
                if (next[col.key] == null) {
                    next[col.key] = col.defaultWidth ?? 160;
                    changed = true;
                }
            });
            return changed ? next : prev;
        });
    }, [columns]);

    useEffect(() => {
        const onMouseMove = (e: globalThis.MouseEvent) => {
            if (!isResizingRef.current) return;
            const { key, startX, startW } = isResizingRef.current;
            const col = columns.find(c => c.key === key);
            const delta = e.clientX - startX;
            const minW = col?.minWidth ?? 60;
            const newWidth = Math.max(minW, startW + delta);
            setColumnWidths(prev => ({ ...prev, [key]: newWidth }));
        };

        const onMouseUp = () => {
            if (isResizingRef.current) {
                isResizingRef.current = null;
                setResizingKey(null);
                document.body.style.cursor = 'default';
                setColumnWidths(prev => {
                    try {
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(prev));
                    } catch { /* ignore */ }
                    return prev;
                });
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [STORAGE_KEY, columns]);

    const startResizing = (e: MouseEvent, key: string) => {
        e.preventDefault();
        isResizingRef.current = {
            key,
            startX: e.clientX,
            startW: columnWidths[key] || 160,
        };
        setResizingKey(key);
        document.body.style.cursor = 'col-resize';
    };

    // Editing State
    const [editingCell, setEditingCell] = useState<EditingState | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const [savingCells, setSavingCells] = useState<Set<string>>(() => new Set());
    const isCancellingRef = useRef(false);
    const editingStartTimeRef = useRef(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const startEditing = (itemId: string, columnKey: string, currentValue: string) => {

        editingStartTimeRef.current = Date.now();
        setEditingCell({ itemId, columnKey });
        setEditValue(currentValue);
    };

    useEffect(() => {
        if (editingCell) {
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [editingCell]);

    const commitEditing = () => {

        if (!editingCell || !onRowSave) return;
        const { itemId, columnKey } = editingCell;

        const originalItem = items.find(item => getItemId(item) === itemId);
        if (!originalItem) {
            setEditingCell(null);
            return;
        }

        const colDef = columns.find(c => c.key === columnKey);
        if (!colDef) return;

        const currentVal = colDef ? toStr(colDef.getValue(originalItem)) : '';
        if (currentVal === editValue) {
            setEditingCell(null);
            return;
        }

        const cellKey = `${itemId}:${columnKey}`;
        setSavingCells(prev => { const next = new Set(prev); next.add(cellKey); return next; });

        onRowSave(originalItem, columnKey, editValue)
            .then(() => {
                setSavingCells(prev => { const next = new Set(prev); next.delete(cellKey); return next; });
            })
            .catch(() => {
                setSavingCells(prev => { const next = new Set(prev); next.delete(cellKey); return next; });
            });

        setEditingCell(null);
    };

    const handleBlur = () => {

        if (Date.now() - editingStartTimeRef.current < 200) {
            return;
        }

        requestAnimationFrame(() => {
            if (isCancellingRef.current) {
                isCancellingRef.current = false;
                return;
            }
            commitEditing();
        });
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            commitEditing();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            isCancellingRef.current = true;
            setEditingCell(null);
        }
    };

    // Filtering & Sorting State
    const STORAGE_KEY_FILTERS = `universal-grid-filters:${gridId}`;
    const STORAGE_KEY_SORT = `universal-grid-sort:${gridId}`;

    const [filters, setFilters] = useState<ColumnFilterState>(() => {
        try {
            const saved = sessionStorage.getItem(STORAGE_KEY_FILTERS);
            if (saved) {
                const parsed = JSON.parse(saved);
                const result: ColumnFilterState = {};
                for (const k of Object.keys(parsed)) {
                    result[k] = new Set(parsed[k]);
                }
                return result;
            }
        } catch (e) {
            console.error("Failed to parse filters from sessionStorage", e);
        }
        return {};
    });

    const [sort, setSort] = useState<SortState | null>(() => {
        try {
            const saved = sessionStorage.getItem(STORAGE_KEY_SORT);
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse sorting from sessionStorage", e);
        }
        return null;
    });

    useEffect(() => {
        try {
            const toSave: Record<string, string[]> = {};
            for (const k of Object.keys(filters)) {
                toSave[k] = Array.from(filters[k] ?? []);
            }
            sessionStorage.setItem(STORAGE_KEY_FILTERS, JSON.stringify(toSave));
        } catch {
            // ignore
        }
    }, [filters, STORAGE_KEY_FILTERS]);

    useEffect(() => {
        try {
            if (sort) {
                sessionStorage.setItem(STORAGE_KEY_SORT, JSON.stringify(sort));
            } else {
                sessionStorage.removeItem(STORAGE_KEY_SORT);
            }
        } catch {
            // ignore
        }
    }, [sort, STORAGE_KEY_SORT]);
    const [filterSearchTerm, setFilterSearchTerm] = useState<Record<string, string>>({});

    useEffect(() => {
        const hasActive = Object.keys(filters).length > 0 || sort !== null;
        onFiltersChange?.(hasActive);
    }, [filters, sort, onFiltersChange]);

    const distinctValuesMap = useMemo(() => {
        const map: Record<string, string[]> = {};
        for (const col of columns) {
            if (col.disableFilter) continue;
            const vals = new Set<string>();
            for (const item of items) {
                vals.add(toStr(col.getValue(item)));
            }
            map[col.key] = Array.from(vals).sort((a, b) => a.localeCompare(b));
        }
        return map;
    }, [columns, items]);

    const processedRows = useMemo(() => {
        let result = [...items];

        const activeFilterCols = Object.keys(filters).filter(k => filters[k] && filters[k].size > 0);
        if (activeFilterCols.length > 0) {
            result = result.filter(item => {
                return activeFilterCols.every(colKey => {
                    const col = columns.find(c => c.key === colKey);
                    if (!col) return true;
                    return filters[colKey]!.has(toStr(col.getValue(item)));
                });
            });
        }

        const compareText = (a: string, b: string): number => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

        const compareSortValues = (valA: string, valB: string): number => {
            const numA = Number(valA.replace(/\s/g, '').replace(',', '.'));
            const numB = Number(valB.replace(/\s/g, '').replace(',', '.'));
            if (!isNaN(numA) && !isNaN(numB) && valA !== '' && valB !== '') {
                return numA - numB;
            }
            return compareText(valA, valB);
        };

        const indexed = result.map((r, idx) => ({ r, idx }));
        indexed.sort((a, b) => {
            if (groupBy?.primary) {
                const pk = groupBy.primary.key;
                const pCol = columns.find(c => c.key === pk);
                const a1 = pCol ? toStr(pCol.getValue(a.r)) : '';
                const b1 = pCol ? toStr(pCol.getValue(b.r)) : '';
                const c1 = compareText(a1, b1);
                if (c1 !== 0) return c1;

                if (groupBy.secondary) {
                    const sk = groupBy.secondary.key;
                    const sCol = columns.find(c => c.key === sk);
                    const a2 = sCol ? toStr(sCol.getValue(a.r)) : '';
                    const b2 = sCol ? toStr(sCol.getValue(b.r)) : '';
                    const c2 = compareText(a2, b2);
                    if (c2 !== 0) return c2;
                }
            }

            if (sort) {
                const sCol = columns.find(c => c.key === sort.columnKey);
                if (sCol) {
                    const valA = toStr(sCol.getSortValue ? sCol.getSortValue(a.r) : sCol.getValue(a.r));
                    const valB = toStr(sCol.getSortValue ? sCol.getSortValue(b.r) : sCol.getValue(b.r));
                    const cmp = compareSortValues(valA, valB);
                    if (cmp !== 0) return sort.direction === 'asc' ? cmp : -cmp;
                }
            }

            return a.idx - b.idx;
        });

        return indexed.map(x => x.r);
    }, [items, filters, sort, groupBy, columns]);

    const [collapsedPrimary, setCollapsedPrimary] = useState<Set<string>>(() => new Set());
    const [collapsedSecondary, setCollapsedSecondary] = useState<Set<string>>(() => new Set());

    const allGroupKeys = useMemo(() => {
        const primary = new Set<string>();
        const secondary = new Set<string>();
        if (!groupBy?.primary) return { primary: [], secondary: [] };

        const pCol = columns.find(c => c.key === groupBy.primary.key);
        const sCol = groupBy.secondary ? columns.find(c => c.key === groupBy.secondary!.key) : undefined;

        for (const r of processedRows) {
            const p = pCol ? toStr(pCol.getValue(r)) : '';
            primary.add(`gp:${p}`);
            if (sCol) {
                const s = toStr(sCol.getValue(r));
                secondary.add(`gs:${p}:${s}`);
            }
        }
        return { primary: Array.from(primary), secondary: Array.from(secondary) };
    }, [processedRows, groupBy, columns]);

    useImperativeHandle(ref, () => ({
        expandAllGroups: () => {
            setCollapsedPrimary(new Set());
            setCollapsedSecondary(new Set());
        },
        collapseAllGroups: () => {
            setCollapsedPrimary(new Set(allGroupKeys.primary));
            setCollapsedSecondary(new Set(allGroupKeys.secondary));
        },
        clearAllFilters: () => {
            setFilters({});
            setSort(null);
        },
        hasActiveFilters: () => Object.keys(filters).length > 0 || sort !== null,
    }), [allGroupKeys, filters, sort]);

    type RenderItem =
        | { kind: 'group-primary'; key: string; label: string; isCollapsed: boolean }
        | { kind: 'group-secondary'; key: string; label: string; isCollapsed: boolean }
        | { kind: 'row'; item: T };

    const renderItems = useMemo<RenderItem[]>(() => {
        if (!groupBy?.primary) {
            return processedRows.map(r => ({ kind: 'row', item: r }));
        }

        const res: RenderItem[] = [];
        let currentPrimary = '';
        let currentPrimaryKey = '';
        let currentSecondary = '';
        let currentSecondaryKey = '';

        const pCol = columns.find(c => c.key === groupBy.primary.key);
        const sCol = groupBy.secondary ? columns.find(c => c.key === groupBy.secondary!.key) : undefined;

        for (const r of processedRows) {
            const primaryRaw = pCol ? toStr(pCol.getValue(r)) : '';
            const primary = primaryRaw === '' ? '(Nezařazeno)' : primaryRaw;
            const primaryKey = `gp:${primary}`;

            const secondaryRaw = sCol ? toStr(sCol.getValue(r)) : '';
            const secondary = secondaryRaw === '' ? '(Nezařazeno)' : secondaryRaw;
            const secondaryKey = sCol ? `gs:${primary}:${secondary}` : '';

            if (primary !== currentPrimary) {
                currentPrimary = primary;
                currentPrimaryKey = primaryKey;
                currentSecondary = '';
                currentSecondaryKey = '';

                const label = groupBy.primary.label ? groupBy.primary.label(primary) : primary;
                res.push({ kind: 'group-primary', key: primaryKey, label, isCollapsed: collapsedPrimary.has(primaryKey) });
            }

            if (collapsedPrimary.has(currentPrimaryKey)) {
                continue;
            }

            if (sCol && secondary !== currentSecondary) {
                currentSecondary = secondary;
                currentSecondaryKey = secondaryKey;
                const label = groupBy.secondary!.label ? groupBy.secondary!.label(secondary) : secondary;
                res.push({ kind: 'group-secondary', key: secondaryKey, label, isCollapsed: collapsedSecondary.has(secondaryKey) });
            }

            if (sCol && collapsedSecondary.has(currentSecondaryKey)) {
                continue;
            }

            res.push({ kind: 'row', item: r });
        }

        return res;
    }, [processedRows, groupBy, collapsedPrimary, collapsedSecondary, columns]);

    const togglePrimaryGroup = (groupKey: string) => {
        setCollapsedPrimary(prev => {
            const next = new Set(prev);
            if (next.has(groupKey)) next.delete(groupKey);
            else next.add(groupKey);
            return next;
        });
        if (!collapsedPrimary.has(groupKey)) {
            const prefix = groupKey.replace('gp:', 'gs:') + ':';
            setCollapsedSecondary(prev => {
                const next = new Set(prev);
                Array.from(next).forEach(k => {
                    if (k.startsWith(prefix)) next.delete(k);
                });
                return next;
            });
        }
    };

    const toggleSecondaryGroup = (groupKey: string) => {
        setCollapsedSecondary(prev => {
            const next = new Set(prev);
            if (next.has(groupKey)) next.delete(groupKey);
            else next.add(groupKey);
            return next;
        });
    };

    const toggleFilter = (columnKey: string, value: string) => {
        setFilters(prev => {
            const next = { ...prev };
            if (!next[columnKey]) next[columnKey] = new Set();
            const newSet = new Set(next[columnKey]);
            if (newSet.has(value)) newSet.delete(value);
            else newSet.add(value);
            if (newSet.size === 0) delete next[columnKey];
            else next[columnKey] = newSet;
            return next;
        });
    };

    const clearFilter = (columnKey: string) => {
        setFilters(prev => {
            const next = { ...prev };
            delete next[columnKey];
            return next;
        });
    };

    const toggleSelection = (id: string) => {
        if (!onSelectionChange || !selectedIds) return;
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        onSelectionChange(next);
    };

    const toggleAll = () => {
        if (!onSelectionChange || !selectedIds) return;
        if (selectedIds.size === processedRows.length && processedRows.length > 0) {
            onSelectionChange(new Set());
        } else {
            onSelectionChange(new Set(processedRows.map(r => getItemId(r))));
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.tableWrapper}>
                <Table className={styles.table}>
                    <colgroup>
                        {hasSelection && <col style={{ width: '40px' }} />}
                        {visibleColumns.map(col => (
                            <col key={col.key} style={{ width: `${columnWidths[col.key] || 160}px` }} />
                        ))}
                    </colgroup>
                    <TableHeader>
                        <TableRow>
                            {hasSelection && (
                                <TableHeaderCell className={styles.stickyHeaderCell} style={{ width: '40px', padding: 0 }}>
                                    <div className={styles.checkboxCell}>
                                        <Checkbox
                                            className={styles.roundedCheckbox}
                                            checked={processedRows.length > 0 && selectedIds!.size === processedRows.length}
                                            onChange={toggleAll}
                                        />
                                    </div>
                                </TableHeaderCell>
                            )}
                            {visibleColumns.map(col => {
                                const distinctValues = distinctValuesMap[col.key] || [];
                                const activeColFilters = filters[col.key] || new Set();
                                const isFiltered = activeColFilters.size > 0;
                                const isSortedAsc = sort?.columnKey === col.key && sort.direction === 'asc';
                                const isSortedDesc = sort?.columnKey === col.key && sort.direction === 'desc';

                                return (
                                    <TableHeaderCell
                                        key={col.key}
                                        className={`${styles.stickyHeaderCell} ${(isFiltered || isSortedAsc || isSortedDesc) ? styles.stickyHeaderCellActive : ''}`}
                                    >
                                        <Popover withArrow positioning="below-start">
                                            <PopoverTrigger disableButtonEnhancement>
                                                <Tooltip content={col.header} relationship="label" hideDelay={0} showDelay={0}>
                                                    <div className={styles.headerCellContent} style={{ cursor: 'pointer', flexDirection: col.align === 'right' ? 'row-reverse' : undefined }}>
                                                        <div className={styles.headerText}>
                                                            {col.header}
                                                        </div>
                                                        {(!col.disableFilter || !col.disableSort) && (
                                                            <span className={styles.filterTriggerWrapper}>
                                                                {isFiltered
                                                                    ? <FilterFilled style={{ color: tokens.colorBrandForeground1, fontSize: '14px' }} />
                                                                    : isSortedAsc || isSortedDesc
                                                                        ? <FilterRegular style={{ color: tokens.colorBrandForeground1, fontSize: '14px' }} />
                                                                        : <FilterRegular style={{ color: '#ADADAD', fontSize: '14px' }} />
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </Tooltip>
                                            </PopoverTrigger>
                                            <PopoverSurface className={styles.popoverSurface}>
                                                <div className={styles.popoverActions}>
                                                    {!col.disableSort && (
                                                        <>
                                                            <Button appearance="transparent" icon={<TextSortAscendingRegular />} className={styles.actionButton} onClick={() => setSort({ columnKey: col.key, direction: 'asc' })}>
                                                                Seřadit A-Z
                                                            </Button>
                                                            <Button appearance="transparent" icon={<TextSortDescendingRegular />} className={styles.actionButton} onClick={() => setSort({ columnKey: col.key, direction: 'desc' })}>
                                                                Seřadit Z-A
                                                            </Button>
                                                        </>
                                                    )}
                                                    {!col.disableFilter && (
                                                        <Button appearance="transparent" disabled={!isFiltered} icon={<FilterDismissRegular />} className={styles.actionButton} onClick={() => clearFilter(col.key)}>
                                                            Vymazat filtr
                                                        </Button>
                                                    )}
                                                </div>

                                                {!col.disableFilter && distinctValues.length > 0 && (
                                                    <>
                                                        <Divider />
                                                        {distinctValues.length > 5 && (
                                                            <Input
                                                                className={styles.searchFilterInput}
                                                                placeholder="Hledat..."
                                                                value={filterSearchTerm[col.key] || ''}
                                                                onChange={(_, data) => setFilterSearchTerm(prev => ({ ...prev, [col.key]: data.value }))}
                                                            />
                                                        )}
                                                        <div className={styles.filterListContainer}>
                                                            {distinctValues
                                                                .filter(val => {
                                                                    const term = filterSearchTerm[col.key]?.toLowerCase();
                                                                    if (!term) return true;
                                                                    return (val === '' ? '(Prázdné)' : val).toLowerCase().includes(term);
                                                                })
                                                                .map(val => (
                                                                    <Checkbox
                                                                        key={val}
                                                                        label={val === '' ? '(Prázdné)' : val}
                                                                        checked={activeColFilters.has(val)}
                                                                        onChange={() => toggleFilter(col.key, val)}
                                                                    />
                                                                ))}
                                                        </div>
                                                    </>
                                                )}
                                            </PopoverSurface>
                                        </Popover>
                                        <div
                                            className={`${styles.resizer} ${resizingKey === col.key ? styles.resizerActive : ''}`}
                                            onMouseDown={(e) => { e.stopPropagation(); startResizing(e, col.key); }}
                                        />
                                    </TableHeaderCell>
                                );
                            })}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {processedRows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={visibleColumns.length + (hasSelection ? 1 : 0)}>
                                    <div style={{
                                        padding: '80px',
                                        textAlign: 'center',
                                        color: tokens.colorNeutralForeground4,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '12px'
                                    }}>
                                        <Text size={500} weight="semibold">{emptyMessageTitle}</Text>
                                        <Text size={200}>{emptyMessageSubtext}</Text>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : renderItems.map((rItem) => {
                            if (rItem.kind === 'group-primary' || rItem.kind === 'group-secondary') {
                                const isSecondary = rItem.kind === 'group-secondary';
                                return (
                                    <TableRow
                                        key={rItem.key}
                                        className={styles.groupHeaderRow}
                                        onClick={() => (isSecondary ? toggleSecondaryGroup(rItem.key) : togglePrimaryGroup(rItem.key))}
                                    >
                                        <TableCell
                                            colSpan={visibleColumns.length + (hasSelection ? 1 : 0)}
                                            className={`${styles.groupHeaderCell} ${isSecondary ? styles.groupHeaderSecondary : ''}`}
                                        >
                                            <div className={`${styles.groupHeaderCellInner} ${isSecondary ? styles.groupHeaderCellInnerSecondary : ''}`}>
                                                <Button
                                                    appearance="transparent"
                                                    icon={rItem.isCollapsed ? <ChevronRightRegular /> : <ChevronDownRegular />}
                                                    aria-label={rItem.isCollapsed ? 'Rozbalit skupinu' : 'Sbalit skupinu'}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (isSecondary) toggleSecondaryGroup(rItem.key);
                                                        else togglePrimaryGroup(rItem.key);
                                                    }}
                                                />
                                                <Text weight={isSecondary ? 'semibold' : 'bold'}>{rItem.label}</Text>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            }

                            const item = rItem.item;
                            const id = getItemId(item);
                            const isSelected = hasSelection && selectedIds!.has(id);

                            let rowClassName = styles.rowDefault;
                            if (isSelected) {
                                rowClassName = styles.rowSelected;
                            } else if (getRowClassName) {
                                rowClassName = getRowClassName(item, isSelected) || rowClassName;
                            }

                            return (
                                <TableRow
                                    key={id}
                                    className={rowClassName}
                                    onClick={() => {
                                        if (onRowClick) onRowClick(item);
                                        else toggleSelection(id);
                                    }}
                                >
                                    {hasSelection && (
                                        <TableCell className={styles.bodyCell} style={{ padding: 0 }}>
                                            <div className={styles.checkboxCell}>
                                                <Checkbox
                                                    className={styles.roundedCheckbox}
                                                    checked={isSelected}
                                                    onChange={(e) => { e.stopPropagation(); toggleSelection(id); }}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                        </TableCell>
                                    )}
                                    {visibleColumns.map(col => {
                                        const rawVal = col.getValue(item);
                                        const displayValue = col.formatValue ? col.formatValue(rawVal) : toStr(rawVal);

                                        const isEditing = editingCell?.itemId === id && editingCell?.columnKey === col.key;
                                        const editable = col.isEditable;
                                        const isModified = col.isModified?.(item);

                                        const strikeVal = col.getStrikethroughValue ? col.getStrikethroughValue(item) : undefined;
                                        const strikeDisplay = strikeVal !== undefined ? (col.formatValue ? col.formatValue(strikeVal) : toStr(strikeVal)) : undefined;

                                        let cellClass = styles.bodyCell;
                                        if (col.cellClassName) {
                                            const c = col.cellClassName(item);
                                            if (c) cellClass = mergeClasses(cellClass, c);
                                        }

                                        const cellStyle = col.cellStyle ? col.cellStyle(item) : {};

                                        let tooltipContent: React.ReactNode = "";
                                        if (col.tooltipContent) {
                                            tooltipContent = col.tooltipContent(item, displayValue);
                                        } else if (strikeDisplay !== undefined) {
                                            tooltipContent = (
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ textDecoration: 'line-through', color: tokens.colorNeutralForeground3 }}>
                                                        {strikeDisplay || '(Prázdné)'}
                                                    </span>
                                                    <span style={{ fontWeight: tokens.fontWeightBold }}>
                                                        {displayValue || '(Prázdné)'}
                                                    </span>
                                                </div>
                                            );
                                        } else {
                                            tooltipContent = displayValue;
                                        }

                                        return (
                                            <TableCell
                                                key={col.key}
                                                className={cellClass}
                                                style={cellStyle}
                                                onClick={editable ? (e) => {
                                                    e.stopPropagation();
                                                    if (!isEditing) startEditing(id, col.key, toStr(rawVal));
                                                } : undefined}
                                            >
                                                {isEditing ? (
                                                    <div className={styles.cellLayout}>
                                                        <Input
                                                            ref={inputRef}
                                                            className={styles.editInput}
                                                            value={editValue}
                                                            onChange={(_, data) => setEditValue(data.value)}
                                                            onBlur={handleBlur}
                                                            onKeyDown={handleKeyDown}
                                                            style={{ textAlign: col.align || 'left' }}
                                                        />
                                                        <Button
                                                            appearance="subtle"
                                                            icon={<CheckmarkRegular />}
                                                            className={styles.pencilButton}
                                                            onMouseDown={(e) => { e.preventDefault(); commitEditing(); }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className={styles.cellLayout} style={{ justifyContent: col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start' }}>
                                                        {col.renderCell ? col.renderCell(item, displayValue, isEditing) : (
                                                            <Tooltip content={tooltipContent as any} relationship="label" hideDelay={0} showDelay={0}>
                                                                <div
                                                                    className={`${styles.textContainer} ${col.align === 'right' ? styles.textContainerRight : ''} ${isModified ? styles.cellTextModified : ''}`}
                                                                    style={{ display: 'flex', flexDirection: 'column', textAlign: col.align }}
                                                                >
                                                                    {strikeDisplay !== undefined && (
                                                                        <span style={{ textDecoration: 'line-through', color: tokens.colorNeutralForeground3, fontSize: '10px', lineHeight: '1' }}>
                                                                            {strikeDisplay || '(Prázdné)'}
                                                                        </span>
                                                                    )}
                                                                    <span style={{ lineHeight: strikeDisplay !== undefined ? '1.2' : 'normal' }}>
                                                                        {displayValue || ''}
                                                                    </span>
                                                                </div>
                                                            </Tooltip>
                                                        )}
                                                        {editable && (
                                                            savingCells.has(`${id}:${col.key}`) ? (
                                                                <CellSpinner />
                                                            ) : (
                                                                <Button
                                                                    appearance="subtle"
                                                                    icon={<EditRegular />}
                                                                    className={styles.pencilButton}
                                                                    onClick={(e) => { e.stopPropagation(); startEditing(id, col.key, toStr(rawVal)); }}
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export const UniversalGrid = React.forwardRef(UniversalGridInner) as <T>(
    props: UniversalGridProps<T> & { ref?: React.ForwardedRef<UniversalGridHandle> }
) => ReturnType<typeof UniversalGridInner>;
