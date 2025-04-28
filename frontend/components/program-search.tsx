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
    const [programs, setPrograms] = useState<Program[]>([]);
    const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchPrograms = async () => {
            if (searchQuery.length < 2) {
                setPrograms([]);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const response = await programService.searchPrograms({
                    query: searchQuery,
                    paginate: false
                });
                setPrograms(response.data);
            } catch (error: unknown) {
                // @ts-expect-error - unknown error
                setError(error?.message);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(fetchPrograms, 300);
        return () => {
            controller.abort();
            clearTimeout(timer);
        };
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
                    {searchQuery || selectedProgram || "Search programs..."}
                    <SearchIcon className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder={selectedProgram || "Search programs by name..."}
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                    />
                    <CommandList>
                        {isLoading ? (
                            <div className="p-4 text-center text-sm">Searching...</div>
                        ) : error ? (
                            <div className="p-4 text-center text-sm text-red-500">{error}</div>
                        ) : (
                            <>
                                <CommandEmpty>No programs found</CommandEmpty>
                                <CommandGroup>
                                    {programs.map((program) => (
                                        <CommandItem
                                            key={program.id}
                                            value={program.id}
                                            onSelect={() => {
                                                onSelect(program.id);
                                                setOpen(false);
                                                setSearchQuery("");
                                                setSelectedProgram(program.name)
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