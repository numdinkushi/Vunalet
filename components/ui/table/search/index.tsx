import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface TableSearchProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    placeholder?: string;
}

export function TableSearch({
    searchTerm,
    onSearchChange,
    placeholder = 'Search...',
}: TableSearchProps) {
    return (
        <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8 w-[300px]"
            />
        </div>
    );
} 