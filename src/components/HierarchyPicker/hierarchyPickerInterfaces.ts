import { Folder } from "../FolderTree";

export interface HierarchyPickerProps {
    allFolders: Folder[];
    rootFolderUrl: string;
    selectedBase: Folder | null;
    onSelectBase: (base: Folder | null) => void;
    isLoadingData?: boolean;
}