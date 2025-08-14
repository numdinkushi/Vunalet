import { ReactNode } from 'react';

export interface TableColumn<T = Record<string, unknown>> {
    key: string;
    header: string;
    cell: (item: T) => ReactNode;
    sortable?: boolean;
    width?: string;
    align?: 'left' | 'center' | 'right';
}

export interface TableHeaderButton {
    label: string;
    icon?: ReactNode;
    onClick?: () => void;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    disabled?: boolean;
}

export interface TableProps<T = Record<string, unknown>> {
    data: T[];
    columns: TableColumn<T>[];
    title?: string;
    headerButtons?: TableHeaderButton[];
    searchTerm?: string;
    onSearchChange?: (term: string) => void;
    onRowClick?: (item: T) => void;
    canClickRow?: boolean | ((item: T) => boolean);
    pagination?: {
        currentPage: number;
        pageSize: number;
        totalPages: number;
        onPageChange: (page: number) => void;
        onPageSizeChange: (size: number) => void;
    };
    loading?: boolean;
    emptyMessage?: string;
    searchPlaceholder?: string;
    showSearch?: boolean;
    showPagination?: boolean;
    showHeader?: boolean;
    className?: string;
}

export interface PaginationState {
    pageIndex: number;
    pageSize: number;
}

export interface TableFilterOption {
    label: string;
    value: string;
    count?: number;
} 