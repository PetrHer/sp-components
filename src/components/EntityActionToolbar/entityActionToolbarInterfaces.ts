export interface EntityActionToolbarProps {
    onCreatePrimary: () => void,
    primaryLabel: string,
    onCreateFolder: () => void,
    canDelete: boolean,
    onDelete: () => void,
    toggleSidebar: () => void
}