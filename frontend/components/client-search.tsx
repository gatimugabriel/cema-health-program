"use client";

import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import clientService from "@/lib/services/client.service";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Client } from "@/types/client";

interface ClientSearchProps {
    onSelect: (id: string) => void;
}

export function ClientSearch({ onSelect }: ClientSearchProps) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchClients = async () => {
            if (searchQuery.length < 2) {
                setClients([]);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const response = await clientService.searchClients({
                    query: searchQuery,
                    paginate: false
                });
                setClients(response.data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(fetchClients, 300);
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
                    {searchQuery || "Search clients..."}
                    <SearchIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Search clients by name or ID..."
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
                                <CommandEmpty>No clients found</CommandEmpty>
                                <CommandGroup>
                                    {clients.map((client) => (
                                        <CommandItem
                                            key={client.id}
                                            value={client.id}
                                            onSelect={() => {
                                                onSelect(client.id);
                                                setOpen(false);
                                                setSearchQuery("");
                                            }}
                                        >
                                            {client.firstName} {client.lastName} ({client.identificationNumber})
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