'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Button } from './button';
import { Label } from './label';
import { cn } from '../../lib/utils';

interface Option {
    id: string;
    name: string;
    description?: string;
}

interface MultiSelectProps {
    options: Option[];
    value: string[];
    onChange: (value: string[]) => void;
    label?: string;
    placeholder?: string;
    className?: string;
    maxSelections?: number;
}

export function MultiSelect({
    options,
    value,
    onChange,
    label,
    placeholder = "Select options...",
    className = "",
    maxSelections
}: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOptions = options.filter(option => value.includes(option.id));

    const handleSelect = (optionId: string) => {
        if (value.includes(optionId)) {
            // Remove if already selected
            onChange(value.filter(id => id !== optionId));
        } else {
            // Add if not selected and under max limit
            if (!maxSelections || value.length < maxSelections) {
                onChange([...value, optionId]);
            }
        }
    };

    const handleRemove = (optionId: string) => {
        onChange(value.filter(id => id !== optionId));
    };

    const isOptionSelected = (optionId: string) => value.includes(optionId);

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <Label className="text-sm font-medium text-gray-700">
                    {label}
                </Label>
            )}

            <div className="relative" ref={containerRef}>
                {/* Selected items display */}
                {selectedOptions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                        {selectedOptions.map((option) => (
                            <div
                                key={option.id}
                                className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm"
                            >
                                <span>{option.name}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemove(option.id)}
                                    className="text-green-600 hover:text-green-800"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Dropdown trigger */}
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "w-full justify-between h-11",
                        isOpen && "ring-2 ring-green-500 border-green-500"
                    )}
                >
                    <span className={selectedOptions.length === 0 ? "text-gray-500" : ""}>
                        {selectedOptions.length === 0
                            ? placeholder
                            : `${selectedOptions.length} selected`
                        }
                    </span>
                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </Button>

                {/* Dropdown content */}
                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-hidden">
                        {/* Search input */}
                        <div className="p-2 border-b border-gray-200">
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                autoFocus
                            />
                        </div>

                        {/* Options list */}
                        <div className="max-h-48 overflow-y-auto">
                            {filteredOptions.length === 0 ? (
                                <div className="px-3 py-2 text-sm text-gray-500">
                                    No categories found
                                </div>
                            ) : (
                                filteredOptions.map((option) => (
                                    <div
                                        key={option.id}
                                        className={cn(
                                            "flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-50",
                                            isOptionSelected(option.id) && "bg-green-50 text-green-700"
                                        )}
                                        onClick={() => handleSelect(option.id)}
                                    >
                                        <div className="flex items-center justify-center w-4 h-4 mr-3">
                                            {isOptionSelected(option.id) && (
                                                <Check className="h-4 w-4 text-green-600" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium">{option.name}</div>
                                            {option.description && (
                                                <div className="text-xs text-gray-500">
                                                    {option.description}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Max selections warning */}
                        {maxSelections && value.length >= maxSelections && (
                            <div className="px-3 py-2 text-xs text-amber-600 bg-amber-50 border-t border-gray-200">
                                Maximum {maxSelections} selections reached
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Help text */}
            <p className="text-xs text-gray-500">
                {maxSelections
                    ? `Select up to ${maxSelections} categories`
                    : "Select multiple categories for your farming specialties"
                }
            </p>
        </div>
    );
} 