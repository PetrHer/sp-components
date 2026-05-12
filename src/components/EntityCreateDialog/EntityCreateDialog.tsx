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
    Input,
    Field,
} from '@fluentui/react-components';
import { Folder } from '../FolderTree';
import { HierarchyPicker } from '../HierarchyPicker';
import { useEntityCreateDialogStyles } from './useEntityCreateDialogStyles';
import { EntityCreateDialogProps } from './entityCreateDialogInterfaces';


export const EntityCreateDialog: React.FC<EntityCreateDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    allFolders = [],
    rootFolderUrl,
    title,
    showBasePicker
}) => {
    const styles = useEntityCreateDialogStyles();
    const [name, setName] = useState('');
    const [selectedBase, setSelectedBase] = useState<Folder | null>(null);

    useEffect(() => {
        if (isOpen) {
            setName('');
            setSelectedBase(null);
        }
    }, [isOpen]);


    const handleConfirm = () => {
        if (!name.trim()) return;
        onConfirm({
            name,
            basedOnId: selectedBase?.id?.toString()
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(_, data) => !data.open && onClose()}>
            <DialogSurface className={styles.surface}>
                <DialogBody>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent>
                        <Field label="Název" required className={styles.field}>
                            <Input
                                value={name}
                                onChange={(_, data) => setName(data.value)}
                                placeholder="Zadejte název..."
                                autoComplete="off"
                            />
                        </Field>

                        {showBasePicker && (
                            <Field label="Vychází ze sazebníku (povinné)" required>
                                <HierarchyPicker
                                    allFolders={allFolders}
                                    rootFolderUrl={rootFolderUrl}
                                    onSelectBase={setSelectedBase}
                                    selectedBase={selectedBase}
                                />
                            </Field>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="secondary" onClick={onClose}>Zrušit</Button>
                        <Button
                            appearance="primary"
                            disabled={!name.trim() || (showBasePicker && !selectedBase)}
                            onClick={handleConfirm}
                        >
                            Vytvořit
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};
