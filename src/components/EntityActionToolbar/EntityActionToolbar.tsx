import { Button, tokens, Toolbar, ToolbarButton } from '@fluentui/react-components'
import { AddRegular, ArrowDownloadRegular, DeleteRegular, FolderAddRegular, GridRegular, PanelLeftRegular } from '@fluentui/react-icons'
import React from 'react'
import { EntityActionToolbarProps } from './entityActionToolbarInterfaces'

const EntityActionToolbar: React.FC<EntityActionToolbarProps> = (props: EntityActionToolbarProps) => {
    const { onCreatePrimary, toggleSidebar, primaryLabel, onCreateFolder, canDelete, onDelete } = props
    return (
        <>
            <Button
                icon={<PanelLeftRegular />}
                appearance="subtle"
                onClick={toggleSidebar}
                title="Zavřít/Otevřít postranní panel"
            />
            <Button
                appearance="primary"
                icon={<AddRegular />}
                onClick={onCreatePrimary}
                style={{ marginRight: '8px' }}
            >
                {primaryLabel}
            </Button>
            <Button
                icon={<FolderAddRegular />}
                onClick={onCreateFolder}
            >
                Nová složka
            </Button>

            <Toolbar size="small" style={{ marginLeft: '12px' }}>
                <ToolbarButton
                    icon={<DeleteRegular />}
                    disabled={!canDelete}
                    onClick={onDelete}
                    style={{ color: canDelete ? tokens.colorPaletteRedForeground1 : undefined }}
                >
                    Smazat
                </ToolbarButton>
                <ToolbarButton icon={<GridRegular />}>Upravit</ToolbarButton>
                <ToolbarButton icon={<ArrowDownloadRegular />}>Export</ToolbarButton>
            </Toolbar>
        </>
    )
}

export default EntityActionToolbar