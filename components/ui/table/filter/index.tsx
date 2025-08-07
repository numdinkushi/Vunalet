import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { TableFilterOption } from '../types';

interface TableFilterProps {
    options: TableFilterOption[];
    value?: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    label?: string;
}

export function TableFilter({
    options,
    value,
    onValueChange,
    placeholder = 'Select filter...',
    label,
}: TableFilterProps) {
    return (
        <div className="flex items-center space-x-2">
            {label && (
                <span className="text-sm text-muted-foreground">{label}:</span>
            )}
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                            {option.count !== undefined && (
                                <span className="ml-2 text-muted-foreground">
                                    ({option.count})
                                </span>
                            )}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
} 