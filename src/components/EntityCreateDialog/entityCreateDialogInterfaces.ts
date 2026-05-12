import { Folder } from "../FolderTree";

export interface EntityCreateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: { name: string, basedOnId?: string }) => void;
    allFolders: Folder[];
    currentFolder: Folder | null;
    rootFolderUrl: string;
    title: string;
    showBasePicker?: boolean;
}