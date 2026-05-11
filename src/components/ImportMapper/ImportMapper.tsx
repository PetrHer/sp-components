import * as React from 'react';
import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogSurface,
    DialogTitle,
    DialogBody,
    DialogActions,
    DialogContent,
    Button,
    Label,
    Select
} from '@fluentui/react-components';
import { useImportMapperStyles } from './useImportMapperStyles';
import { ImportMapperProps } from './importMapperInterfaces';

function normalize(str: string): string {
    if (!str) return "";
    return str
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");
}

export const ImportMapper: React.FC<ImportMapperProps> = ({
    isOpen,
    onClose,
    excelColumns,
    targetColumns,
    onConfirm,
    columnTranslations = {}
}) => {
    const styles = useImportMapperStyles();
    const [mapping, setMapping] = useState<Record<string, string>>({});

    useEffect(() => {
        const initialMapping: Record<string, string> = {};
        const usedExcelCols = new Set<string>();

        targetColumns.forEach(target => {
            const translatedTarget = columnTranslations[target] || target;
            const aliases = [translatedTarget];

            // Add some common aliases for specific generic fields
            if (target === "IpcId") aliases.push("ID");

            const normTarget = normalize(target.replace(/^Ipc/, ''));

            // Priority 1: Exact alias match or exact internal name match
            let found = excelColumns.find(excel =>
                !usedExcelCols.has(excel) && (
                    excel.toLowerCase().trim() === target.toLowerCase().trim() ||
                    aliases.some(alias => excel.toLowerCase().trim() === alias.toLowerCase().trim())
                )
            );

            // Priority 2: Normalized alias match
            if (!found) {
                found = excelColumns.find(excel =>
                    !usedExcelCols.has(excel) && aliases.some(alias => normalize(excel) === normalize(alias))
                );
            }

            // Priority 3: Normalized target name match
            if (!found) {
                found = excelColumns.find(excel =>
                    !usedExcelCols.has(excel) && (normalize(excel) === normTarget)
                );
            }

            // Priority 4: Fuzzy normalized match against aliases
            if (!found) {
                found = excelColumns.find(excel =>
                    !usedExcelCols.has(excel) && aliases.some(alias =>
                        normalize(excel).includes(normalize(alias)) ||
                        normalize(alias).includes(normalize(excel))
                    )
                );
            }

            if (found) {
                initialMapping[target] = found;
                usedExcelCols.add(found);
            } else {
                initialMapping[target] = '';
            }
        });

        setMapping(initialMapping);
    }, [excelColumns, targetColumns]);

    const handleSelectChange = (target: string, value: string) => {
        setMapping(prev => ({ ...prev, [target]: value }));
    };

    return (
        <Dialog open={isOpen}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Mapování sloupců z Excelu</DialogTitle>
                    <DialogContent>
                        <div style={{ marginBottom: '20px' }}>
                            Přiřaďte sloupce z vašeho Excelu k datům v aplikaci. Pokud nebyl sloupec rozpoznán automaticky, vyberte jej prosím ze seznamu.
                        </div>
                        {targetColumns.map(target => (
                            <div key={target} className={styles.mappingRow}>
                                <Label className={styles.mappingLabel}>{columnTranslations[target] || target}</Label>
                                <Select
                                    value={mapping[target] || ''}
                                    onChange={(_, data) => handleSelectChange(target, data.value)}
                                >
                                    <option value="">-- Ignorovat --</option>
                                    {excelColumns.map(col => (
                                        <option key={col} value={col}>{col}</option>
                                    ))}
                                </Select>
                            </div>
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="secondary" onClick={onClose}>Zrušit</Button>
                        <Button appearance="primary" onClick={() => onConfirm(mapping)}>Potvrdit import</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};
