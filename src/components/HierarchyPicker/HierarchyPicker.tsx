import {
    Badge,
    Breadcrumb,
    BreadcrumbButton,
    BreadcrumbDivider,
    BreadcrumbItem,
    Button,
    SearchBox,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow,
    Text
} from '@fluentui/react-components';
import { ArrowLeftRegular, BookRegular, CheckmarkCircleRegular, FolderRegular, HomeRegular } from '@fluentui/react-icons';
import React from 'react'
import { Folder, FolderTree } from '../FolderTree';
import { useHierarchyPickerStyles } from './useHierarchyPickerStyles';
import { HierarchyPickerProps } from './hierarchyPickerInterfaces';

const HierarchyPicker: React.FC<HierarchyPickerProps> = (props: HierarchyPickerProps) => {
    const styles = useHierarchyPickerStyles()
    const { allFolders, rootFolderUrl, isLoadingData, onSelectBase, selectedBase } = props

    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedFolder, setSelectedFolder] = React.useState<Folder | null>(null);

    const filteredItems = React.useMemo(() => {
        if (searchQuery) {
            return allFolders.filter(item =>
                item.ipcFolderType === "Sazebník" &&
                item.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        const parentPath = selectedFolder ? selectedFolder.fileRef : rootFolderUrl;

        if (!parentPath) return [];

        return allFolders.filter(item => {
            const itemPath = item.fileRef || "";
            // Direct children only
            const isChild = itemPath.startsWith(parentPath) && itemPath !== parentPath;
            if (!isChild) return false;

            const relativePath = itemPath.substring(parentPath.length).replace(/^\//, "");
            const isDirectChild = !relativePath.includes("/");

            return isDirectChild && (item.ipcFolderType === "Složka" || item.ipcFolderType === "Sazebník");
        });
    }, [allFolders, selectedFolder, searchQuery, rootFolderUrl]);

    const folderPath = React.useMemo<Folder[]>(() => {
        if (!selectedFolder) return [];
        const path: Folder[] = [];
        let node: Folder | undefined = selectedFolder;
        while (node !== undefined) {
            path.unshift(node);
            const ref: string = node.fileDirRef || '';
            if (!ref || ref === rootFolderUrl) break;
            node = allFolders.find(f => f.fileRef === ref);
        }
        return path;
    }, [selectedFolder, allFolders, rootFolderUrl]);

    const handleBack = () => {
        if (!selectedFolder) return;
        const parentRef = selectedFolder.fileDirRef;
        if (!parentRef || parentRef === rootFolderUrl) {
            setSelectedFolder(null);
        } else {
            const parent = allFolders.find(f => f.fileRef === parentRef);
            setSelectedFolder(parent || null);
        }
    };

    return (
        <div className={styles.selectorContainer}>
            <div className={styles.searchWrapper}>
                <SearchBox
                    placeholder="Hledat sazebník globálně..."
                    value={searchQuery}
                    onChange={(_e, data) => setSearchQuery(data.value)}
                    style={{ width: '300px' }}
                />
            </div>

            <div className={styles.mainLayout}>
                {/* Tree Side Panel */}
                <div className={styles.sideTree}>
                    <FolderTree
                        onSelectFolder={setSelectedFolder}
                        selectedFolder={selectedFolder}
                        allFolders={allFolders}
                    />
                </div>

                {/* Browser Area */}
                <div className={styles.browserArea}>
                    {!searchQuery && (
                        <div className={styles.browserHeader}>
                            <Button
                                size="small"
                                icon={<ArrowLeftRegular />}
                                disabled={!selectedFolder}
                                onClick={handleBack}
                                appearance="subtle"
                            />
                            <Breadcrumb size="small">
                                <BreadcrumbItem>
                                    <BreadcrumbButton
                                        icon={<HomeRegular />}
                                        onClick={() => setSelectedFolder(null)}
                                    >
                                        Kořen
                                    </BreadcrumbButton>
                                </BreadcrumbItem>
                                {folderPath.map((f, i) => (
                                    <React.Fragment key={f.id}>
                                        <BreadcrumbDivider />
                                        <BreadcrumbItem>
                                            <BreadcrumbButton
                                                current={i === folderPath.length - 1}
                                                onClick={() => setSelectedFolder(f)}
                                            >
                                                {f.title}
                                            </BreadcrumbButton>
                                        </BreadcrumbItem>
                                    </React.Fragment>
                                ))}
                            </Breadcrumb>
                        </div>
                    )}

                    <div className={styles.tableWrapper}>
                        <Table size="extra-small">
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderCell>Název</TableHeaderCell>
                                    <TableHeaderCell style={{ width: '120px' }}>Typ</TableHeaderCell>
                                    <TableHeaderCell style={{ width: '80px' }} />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoadingData && filteredItems.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3}>
                                            <div style={{ padding: '60px', textAlign: 'center' }}>
                                                <Text size={200} italic color="neutralForeground4">Načítám data...</Text>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredItems.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3}>
                                            <div style={{ padding: '60px', textAlign: 'center' }}>
                                                <Text size={200} italic color="neutralForeground4">V tomto umístění nejsou žádné složky ani sazebníky.</Text>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredItems.map(item => (
                                        <TableRow
                                            key={item.id}
                                            className={selectedBase?.id === item.id ? styles.selectedRow : styles.row}
                                            onClick={() => {
                                                if (item.ipcFolderType === "Složka") {
                                                    setSelectedFolder(item);
                                                } else {
                                                    onSelectBase(item);
                                                }
                                            }}
                                        >
                                            <TableCell>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {item.ipcFolderType === "Složka" ? (
                                                        <FolderRegular className={styles.folderIcon} />
                                                    ) : (
                                                        <BookRegular className={styles.pricelistIcon} />
                                                    )}
                                                    <Text weight={item.ipcFolderType === "Složka" ? "semibold" : "regular"}>
                                                        {item.title}
                                                    </Text>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge appearance="ghost" color={item.ipcFolderType === "Složka" ? "brand" : "important"}>
                                                    {item.ipcFolderType}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                    {selectedBase?.id === item.id && (
                                                        <Badge appearance="tint" color="success" icon={<CheckmarkCircleRegular />}>Vybráno</Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HierarchyPicker