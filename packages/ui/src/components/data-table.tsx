import * as React from 'react';

import { cn } from '../lib/utils';

export interface TableColumn<T = unknown> {
  key: string;
  header: string;
  accessor?: (row: T) => React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T = unknown> extends React.HTMLAttributes<HTMLTableElement> {
  columns: TableColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}

function DataTable<T extends Record<string, unknown>>({
  className,
  columns,
  data,
  onRowClick,
  ...props
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-auto">
      <table className={cn('w-full caption-bottom text-sm', className)} {...props}>
        <thead className="border-b">
          <tr className="border-b transition-colors hover:bg-muted/50">
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
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {data.map((row, index) => (
            <tr
              key={index}
              className={cn(
                'border-b transition-colors hover:bg-muted/50',
                onRowClick && 'cursor-pointer',
              )}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    'p-4',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.className,
                  )}
                >
                  {column.accessor ? column.accessor(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { DataTable };
