import * as React from 'react';
import {
    Dialog,
    DialogSurface,
    DialogTitle,
    DialogBody,
    DialogActions,
    DialogContent,
    Button
} from '@fluentui/react-components';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    content: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    content,
    onConfirm,
    onCancel,
    confirmText = 'Potvrdit',
    cancelText = 'Zrušit',
    isDestructive = true
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={(_, data) => { if (!data.open) onCancel(); }}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent>
                        {content}
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="secondary" onClick={onCancel}>{cancelText}</Button>
                        <Button
                            appearance={isDestructive ? "primary" : "primary"}
                            style={isDestructive ? { backgroundColor: '#d13438', color: 'white' } : undefined}
                            onClick={onConfirm}
                        >
                            {confirmText}
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};
