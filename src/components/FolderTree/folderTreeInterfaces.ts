export interface Folder {
    id: number | string;
    title: string;
    fileRef: string;
    fileDirRef: string;
    fileLeafRef: string;
    ipcFolderType: string;
    folders?: Folder[];
};

export interface FolderTreeProps {
    allFolders: Folder[];
    selectedFolder: Folder | null;
    onSelectFolder: (folder: Folder | null) => void;
}
