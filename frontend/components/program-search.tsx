"use client";

import {useEffect, useState} from "react";
import {SearchIcon} from "lucide-react";
import programService from "@/lib/services/program.service";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";

interface ProgramSearchProps {
    onSelect: (id: string) => void;
}

export function ProgramSearch({onSelect}: ProgramSearchProps) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [isLoading, setIsLoading] = useState(false)
    const [programs, setPrograms] = useState<Program[]>([])
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)
    const [error, setError] = useState<string | null>(null)
    const handleSearch = async (query: string) => {
        if (query.length === 0) {
            setPrograms([])
            return
        }
        setIsLoading(true)
        setError(null)
        try {
            const response = await programService.searchProgram(query)
            setPrograms(response.data)
        } catch (error: any) {
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDebouncedSearch = (query: string) => {
        if (debounceTimer) {
            clearTimeout(debounceTimer)
        }
        setDebounceTimer(
            setTimeout(() => {
                handleSearch(query)
            }, 500)
        )
    }

    useEffect(() => {
        if (searchQuery.length > 0) {
            handleDebouncedSearch(searchQuery)
        } else {
            setPrograms([])
        }
    }, [searchQuery]);


    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {searchQuery || "Search programs..."}
                    <SearchIcon className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search programs by name..."
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                    />
                    <CommandList>
                        {isLoading ? (
                            <div className="p-4 text-center text-sm">Searching...</div>
                        ) : (
                            <>
                                <CommandEmpty>No programs found.</CommandEmpty>
                                <CommandGroup>
                                    {programs?.map((program) => (
                                        <CommandItem
                                            key={program.id}
                                            value={program.id}
                                            onSelect={() => {
                                                onSelect(program.id);
                                                setOpen(false);
                                            }}
                                        >
                                            {program.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}