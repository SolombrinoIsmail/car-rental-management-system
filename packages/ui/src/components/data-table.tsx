import * as React from 'react';

import { cn } from '../lib/utils';

/**
 * Column definition for DataTable
 */
export interface TableColumn<T = unknown> {
  /** Unique key for the column */
  key: string;
  /** Header text to display */
  header: string;
  /** Custom accessor function to extract cell value */
  accessor?: (row: T) => React.ReactNode;
  /** Additional CSS classes for the column */
  className?: string;
  /** Text alignment for the column */
  align?: 'left' | 'center' | 'right';
  /** Sort function for the column */
  sortable?: boolean;
  /** Width of the column */
  width?: string | number;
}

/**
 * DataTable component properties
 */
export interface DataTableProps<T = unknown> extends React.HTMLAttributes<HTMLTableElement> {
  /** Column definitions */
  columns: TableColumn<T>[];
  /** Data rows to display */
  data: T[];
  /** Callback when a row is clicked */
  onRowClick?: (row: T, index: number) => void;
  /** Function to generate unique key for each row */
  getRowKey?: (row: T, index: number) => string | number;
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Enable row selection */
  selectable?: boolean;
  /** Selected row keys */
  selectedKeys?: Set<string | number>;
  /** Callback when selection changes */
  onSelectionChange?: (keys: Set<string | number>) => void;
  /** Enable striped rows */
  striped?: boolean;
  /** Enable hover effect on rows */
  hoverable?: boolean;
  /** Table caption for accessibility */
  caption?: string;
}

/**
 * Accessible data table component with support for sorting, selection, and keyboard navigation.
 * Uses semantic HTML and ARIA attributes for screen reader compatibility.
 *
 * @example
 * ```tsx
 * <DataTable
 *   columns={columns}
 *   data={data}
 *   getRowKey={(row) => row.id}
 *   onRowClick={handleRowClick}
 *   caption="Vehicle inventory list"
 * />
 * ```
 */
function DataTableComponent<T extends Record<string, unknown>>({
  className,
  columns,
  data,
  onRowClick,
  getRowKey,
  loading = false,
  emptyMessage = 'No data available',
  selectable = false,
  selectedKeys = new Set(),
  onSelectionChange,
  striped = false,
  hoverable = true,
  caption,
  ...props
}: DataTableProps<T>) {
  const tableId = React.useId();

  // Generate stable row keys
  const getStableRowKey = React.useCallback(
    (row: T, index: number): string | number => {
      if (getRowKey) {
        return getRowKey(row, index);
      }
      // Try to find an id field
      if ('id' in row && (typeof row.id === 'string' || typeof row.id === 'number')) {
        return row.id;
      }
      // Fallback to stringified row + index (stable across renders)
      return `${JSON.stringify(row)}-${index}`;
    },
    [getRowKey],
  );

  const handleRowClick = React.useCallback(
    (row: T, index: number, event: React.MouseEvent<HTMLTableRowElement>) => {
      // Don't trigger row click if clicking on interactive elements
      const target = event.target as HTMLElement;
      if (target.closest('button, a, input, select, textarea')) {
        return;
      }
      onRowClick?.(row, index);
    },
    [onRowClick],
  );

  const handleKeyDown = React.useCallback(
    (row: T, index: number, event: React.KeyboardEvent<HTMLTableRowElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onRowClick?.(row, index);
      }
    },
    [onRowClick],
  );

  const handleSelectAll = React.useCallback(
    (checked: boolean) => {
      if (!onSelectionChange) return;

      if (checked) {
        const allKeys = new Set(data.map((row, index) => getStableRowKey(row, index)));
        onSelectionChange(allKeys);
      } else {
        onSelectionChange(new Set());
      }
    },
    [data, getStableRowKey, onSelectionChange],
  );

  const handleSelectRow = React.useCallback(
    (rowKey: string | number, checked: boolean) => {
      if (!onSelectionChange) return;

      const newSelection = new Set(selectedKeys);
      if (checked) {
        newSelection.add(rowKey);
      } else {
        newSelection.delete(rowKey);
      }
      onSelectionChange(newSelection);
    },
    [selectedKeys, onSelectionChange],
  );

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-muted-foreground">{emptyMessage}</div>
      </div>
    );
  }

  const allSelected =
    data.length > 0 && data.every((row, index) => selectedKeys.has(getStableRowKey(row, index)));
  const someSelected = data.some((row, index) => selectedKeys.has(getStableRowKey(row, index)));

  return (
    <div className="w-full overflow-auto" role="region" aria-label="Data table">
      <table
        id={tableId}
        className={cn('w-full caption-bottom text-sm', className)}
        role="table"
        aria-label={caption || 'Data table'}
        {...props}
      >
        {caption && <caption className="mt-4 text-sm text-muted-foreground">{caption}</caption>}
        <thead className="border-b" role="rowgroup">
          <tr className="border-b transition-colors hover:bg-muted/50" role="row">
            {selectable && (
              <th className="h-12 w-12 px-4" role="columnheader" scope="col">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) {
                      el.indeterminate = !allSelected && someSelected;
                    }
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  aria-label="Select all rows"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'h-12 px-4 font-medium text-muted-foreground',
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right',
                  column.align !== 'center' && column.align !== 'right' && 'text-left',
                  column.className,
                )}
                style={{ width: column.width }}
                role="columnheader"
                scope="col"
                aria-sort={column.sortable ? 'none' : undefined}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0" role="rowgroup">
          {data.map((row, index) => {
            const rowKey = getStableRowKey(row, index);
            const isSelected = selectedKeys.has(rowKey);
            const isClickable = Boolean(onRowClick);

            return (
              <tr
                key={rowKey}
                className={cn(
                  'border-b transition-colors',
                  hoverable && 'hover:bg-muted/50',
                  isClickable && 'cursor-pointer',
                  striped && index % 2 === 1 && 'bg-muted/20',
                  isSelected && 'bg-muted/40',
                )}
                onClick={(e) => handleRowClick(row, index, e)}
                onKeyDown={isClickable ? (e) => handleKeyDown(row, index, e) : undefined}
                tabIndex={isClickable ? 0 : undefined}
                role="row"
                aria-selected={selectable ? isSelected : undefined}
                aria-rowindex={index + 2} // +2 because header is row 1
              >
                {selectable && (
                  <td className="w-12 px-4" role="cell">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectRow(rowKey, e.target.checked);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Select row ${index + 1}`}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      'p-4',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      column.className,
                    )}
                    role="cell"
                  >
                    {column.accessor ? column.accessor(row) : (row[column.key] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Memoize the component for performance
const DataTable = React.memo(DataTableComponent) as typeof DataTableComponent;

export { DataTable };
