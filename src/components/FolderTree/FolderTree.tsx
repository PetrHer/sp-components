import { Tree, TreeItem, TreeItemLayout } from '@fluentui/react-components';
import { FolderRegular } from '@fluentui/react-icons';
import React from 'react'
import { Folder, FolderTreeProps } from './folderTreeInterfaces';
import { useFolderTreeStyles } from './useFolderTreeStyles';

const createTreeFolders = (allFolders: Folder[]): Folder[] => {
    const folderItems = allFolders.filter(f => f.ipcFolderType === "Složka");
    const childrenByDirRef = new Map<string, Folder[]>();

    folderItems.forEach(folder => {
        const dirRef = String(folder.fileDirRef || "");
        if (!childrenByDirRef.has(dirRef)) {
            childrenByDirRef.set(dirRef, []);
        }
        childrenByDirRef.get(dirRef)!.push(folder);
    });

    const parentRefs = new Set(
        folderItems.map(folder => String(folder.fileRef || ""))
    );

    const roots = folderItems.filter(folder => !parentRefs.has(String(folder.fileDirRef || "")));

    const buildTree = (folder: Folder, visited: Set<string>): Folder => {
        const folderId = String(folder.id ?? folder.fileRef ?? Math.random());
        if (visited.has(folderId)) {
            return { ...folder, folders: [] };
        }

        const nextVisited = new Set(visited);
        nextVisited.add(folderId);

        const currentRef = String(folder.fileRef || "");
        const children = (childrenByDirRef.get(currentRef) || [])
            .filter(child => String(child.id) !== String(folder.id))
            .map(child => buildTree(child, nextVisited));

        return {
            ...folder,
            folders: children
        };
    };

    return roots.map(root => buildTree(root, new Set<string>()));
}

const FolderTree: React.FC<FolderTreeProps> = (props: FolderTreeProps) => {
    const styles = useFolderTreeStyles()

    const { onSelectFolder, selectedFolder, allFolders } = props

    const treeFolders = React.useMemo(() => createTreeFolders(allFolders), [allFolders]);

    const [openTreeItems, setOpenTreeItems] = React.useState<Set<string>>(new Set(['root']));

    const getTreeItemValue = (folder: Folder): string => {
        return String(folder.id ?? folder.fileRef ?? folder.title);
    };

    const findPathToFolder = (nodes: Folder[], targetId: string, trail: string[] = []): string[] | null => {
        for (const node of nodes) {
            const value = getTreeItemValue(node);
            const nextTrail = [...trail, value];

            if (String(node.id) === targetId) {
                return nextTrail;
            }

            const childPath = findPathToFolder(Array.isArray(node.folders) ? node.folders : [], targetId, nextTrail);
            if (childPath) {
                return childPath;
            }
        }
        return null;
    };

    React.useEffect(() => {
        if (!selectedFolder) {
            setOpenTreeItems(new Set(['root']));
            return;
        }

        const selectedId = String(selectedFolder.id ?? '');
        const path = selectedId ? findPathToFolder(treeFolders, selectedId) : null;
        if (!path) {
            setOpenTreeItems(new Set(['root']));
            return;
        }
        setOpenTreeItems(new Set(['root', ...path]));
    }, [selectedFolder, treeFolders]);

    const renderTreeFolder = (folder: Folder): React.ReactNode => {
        const children = Array.isArray(folder.folders) ? folder.folders : [];
        const hasChildren = children.length > 0;
        const itemValue = getTreeItemValue(folder);

        return (
            <TreeItem
                key={itemValue}
                itemType={hasChildren ? 'branch' : 'leaf'}
                value={itemValue}
            >
                <TreeItemLayout
                    iconBefore={<FolderRegular className={styles.folderIcon} />}
                    className={selectedFolder?.id === folder.id ? styles.treeItemActive : undefined}
                    onClick={() => onSelectFolder(folder)}
                >
                    {folder.title}
                </TreeItemLayout>
                {hasChildren && (
                    <Tree>
                        {children.map((child) => renderTreeFolder(child))}
                    </Tree>
                )}
            </TreeItem>
        );
    };

    return (
        <Tree
            aria-label="Adresářová struktura"
            openItems={openTreeItems}
            onOpenChange={(_, data) => {
                const next = new Set(Array.from(data.openItems, item => String(item)));
                next.add('root');
                setOpenTreeItems(next);
            }}
        >
            <TreeItem itemType="branch" value="root">
                <TreeItemLayout
                    iconBefore={<FolderRegular className={styles.folderIcon} />}
                    className={!selectedFolder ? styles.treeItemActive : undefined}
                    onClick={() => onSelectFolder(null)}
                >
                    Kořenový adresář
                </TreeItemLayout>
                <Tree>
                    {treeFolders.map(folder => renderTreeFolder(folder))}
                </Tree>
            </TreeItem>
        </Tree>
    )
}

export default FolderTree