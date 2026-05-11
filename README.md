# @petrher/sp-components

Reusable custom components and layout primitives built on top of `@fluentui/react-components`. Designed for SPFx (React 17).

## Install

Add an `.npmrc` in your project so npm resolves the package from GitHub Packages:

```ini
@petrher:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_PAT
```

Then install:

```bash
npm install @petrher/sp-components
```

Peer dependencies required in host app:
- `react ^17.0.2`
- `react-dom ^17.0.2`
- `@fluentui/react-components ^9`

---

## Components

### UniversalGrid

Generic data grid with column resizing, multi-level grouping, sorting, per-column filtering, inline cell editing, and row selection. State is persisted per `gridId` in `localStorage` / `sessionStorage`.

```tsx
import { UniversalGrid } from '@petrher/sp-components';
import type { UniversalGridColumn, UniversalGridHandle } from '@petrher/sp-components';

interface Item { id: string; name: string; price: number; }

const columns: UniversalGridColumn<Item>[] = [
  { key: 'name',  header: 'Name',  getValue: r => r.name  },
  { key: 'price', header: 'Price', getValue: r => r.price, align: 'right' },
];

const ref = React.useRef<UniversalGridHandle>(null);

<UniversalGrid<Item>
  ref={ref}
  gridId="my-grid"
  items={items}
  columns={columns}
  getItemId={r => r.id}
  onRowClick={item => console.log(item)}
/>
```

Key props:

| Prop | Type | Description |
|---|---|---|
| `gridId` | `string` | Unique key used for localStorage persistence |
| `items` | `T[]` | Row data |
| `columns` | `UniversalGridColumn<T>[]` | Column definitions |
| `getItemId` | `(item: T) => string` | Row key |
| `selectedIds` | `Set<string>` | Controlled selection |
| `onSelectionChange` | `(ids: Set<string>) => void` | Selection callback |
| `onRowSave` | `(item, key, value) => Promise<void>` | Inline edit save |
| `groupBy` | `{ primary, secondary? }` | Two-level grouping |

Imperative handle (`ref`): `expandAllGroups()`, `collapseAllGroups()`, `clearAllFilters()`, `hasActiveFilters()`.

---

### FormLayout

Page shell for detail/edit views with a back button, save button, tab bar, optional header content, and optional footer slot.

```tsx
import { FormLayout } from '@petrher/sp-components';

<FormLayout
  onBack={() => navigate(-1)}
  onSave={handleSave}
  isSaveDisabled={!isDirty}
  tabs={[
    { value: 'general', label: 'General' },
    { value: 'notes',   label: 'Notes', icon: <NoteRegular /> },
  ]}
  activeTab={activeTab}
  onTabSelect={(_, data) => setActiveTab(String(data.value))}
  headerFormContent={<Text weight="semibold">{item.name}</Text>}
  saveText="Save"
  backText="Back"
>
  {activeTab === 'general' && <GeneralTab />}
  {activeTab === 'notes'   && <NotesTab />}
</FormLayout>
```

---

### ConfirmDialog

Lightweight confirmation dialog, optionally styled as destructive action.

```tsx
import { ConfirmDialog } from '@petrher/sp-components';

<ConfirmDialog
  isOpen={showConfirm}
  title="Delete item"
  content="This action cannot be undone."
  onConfirm={handleDelete}
  onCancel={() => setShowConfirm(false)}
  confirmText="Delete"
  cancelText="Cancel"
  isDestructive
/>
```

---

### ImportMapper

Dialog for mapping Excel/CSV source columns to target schema columns before import.

```tsx
import { ImportMapper } from '@petrher/sp-components';

<ImportMapper
  isOpen={showMapper}
  onClose={() => setShowMapper(false)}
  excelColumns={parsedHeaders}
  targetColumns={['Name', 'Price', 'Category']}
  columnTranslations={{ Name: 'Název', Price: 'Cena', Category: 'Kategorie' }}
  onConfirm={(mapping) => {
    // mapping: Record<targetColumn, excelColumn>
    runImport(mapping);
  }}
/>
```

---

## Development

```bash
npm install
npm run build      # production build → dist/
npm run dev        # watch mode
npm run typecheck  # type check only
```

## Publish

Bump version, then push and run the `Publish package` workflow from the Actions tab on GitHub.

```bash
npm version patch   # or minor / major
git push && git push --tags
```
