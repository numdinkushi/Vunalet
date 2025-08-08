import {
    Table,
    TableBody as TableBodyElement,
    TableCell,
    TableHead,
    TableHeader as TableHeaderElement,
    TableRow,
} from '@/components/ui/table';
import { TableColumn } from '../types';
import { Loader2 } from 'lucide-react';

interface TableBodyProps<T = any> {
    data: T[];
    columns: TableColumn<T>[];
    onRowClick?: (item: T) => void;
    canClickRow?: boolean | ((item: T) => boolean);
    loading?: boolean;
    emptyMessage?: string;
}

export function TableBody<T = any>({
    data,
    columns,
    onRowClick,
    canClickRow = true,
    loading = false,
    emptyMessage = 'No data found.',
}: TableBodyProps<T>) {
    const canClick = (item: T) => {
        if (typeof canClickRow === 'function') {
            return canClickRow(item);
        }
        return canClickRow;
    };

    const handleRowClick = (item: T) => {
        if (onRowClick && canClick(item)) {
            onRowClick(item);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading...</span>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center p-8 text-gray-500">
                {emptyMessage}
            </div>
        );
    }

    return (
        <Table>
            <TableHeaderElement>
                <TableRow>
                    {columns.map((column) => (
                        <TableHead
                            key={column.key}
                            className={column.align ? `text-${column.align}` : ''}
                            style={column.width ? { width: column.width } : undefined}
                        >
                            {column.header}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeaderElement>
            <TableBodyElement>
                {data.map((item, index) => (
                    <TableRow
                        key={index}
                        className={
                            onRowClick && canClick(item)
                                ? 'cursor-pointer hover:bg-muted/50 transition-colors'
                                : ''
                        }
                        onClick={() => handleRowClick(item)}
                    >
                        {columns.map((column) => (
                            <TableCell
                                key={column.key}
                                className={column.align ? `text-${column.align}` : ''}
                            >
                                {column.cell(item)}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBodyElement>
        </Table>
    );
} 