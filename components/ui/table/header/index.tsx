import { Button } from '@/components/ui/button';
import { TableHeaderButton } from '../types';
import { TableSearch } from '../search';

interface TableHeaderProps {
    title?: string;
    headerButtons?: TableHeaderButton[];
    showSearch?: boolean;
    searchTerm?: string;
    onSearchChange?: (term: string) => void;
    searchPlaceholder?: string;
}

export function TableHeader({
    title,
    headerButtons,
    showSearch = true,
    searchTerm = '',
    onSearchChange,
    searchPlaceholder = 'Search...',
}: TableHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                {title && (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    </div>
                )}
            </div>

            <div className="flex items-center space-x-3">
                {showSearch && onSearchChange && (
                    <TableSearch
                        searchTerm={searchTerm}
                        onSearchChange={onSearchChange}
                        placeholder={searchPlaceholder}
                    />
                )}

                {headerButtons && headerButtons.length > 0 && (
                    <div className="flex items-center space-x-2">
                        {headerButtons.map((button, index) => (
                            <Button
                                key={index}
                                variant={button.variant || 'default'}
                                onClick={button.onClick}
                                disabled={button.disabled}
                                size="sm"
                            >
                                {button.icon && <span className="mr-2">{button.icon}</span>}
                                {button.label}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 