"use client"

import {Suspense, useCallback, useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {Client} from "@/types/client";
import clientService from "@/lib/services/client.service";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Edit, MoreHorizontal, Search, Trash2, UserPlus, X} from "lucide-react";
import Link from "next/link";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

 function ClientsPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // URL pageParams
    const initialPage = parseInt(searchParams.get("page") || "1");
    const initialQuery = searchParams.get("query") || "";

    const [clients, setClients] = useState<Client[]>([]);
    const [pagination, setPagination] = useState({
        page: initialPage,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0
    });
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedClient, setSelectedClient] = useState<string | null>(null);
    // const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

    const fetchClients = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const params = {
                page: pagination.page,
                pageSize: pagination.pageSize,
                query: searchQuery,
                paginate: true
            };

            const response = await clientService.searchClients(params);

            setClients(response.data);
            setPagination(response.pagination);
            setIsSearching(!!searchQuery);
        } catch (err) {
            setError("Failed to load clients. Please try again later.");
            console.error("Error fetching clients:", err);
        } finally {
            setIsLoading(false);
        }
    }, [pagination.page, pagination.pageSize, searchQuery]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchClients();
        }, 300);

        return () => clearTimeout(timer);
    }, [fetchClients, pagination.page, searchQuery]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (pagination.page > 1) params.set("page", pagination.page.toString());
        if (searchQuery) params.set("query", searchQuery);

        router.push(`/clients?${params.toString()}`, {scroll: false});
    }, [pagination.page, searchQuery, router]);

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setPagination(prev => ({...prev, page: 1}));
    };

    const clearSearch = () => {
        setSearchQuery("");
        setPagination(prev => ({...prev, page: 1}));
    };

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({...prev, page: newPage}));
    };

    const handleDelete = async (id: string) => {
        try {
            await clientService.deleteClient(id);
            fetchClients();
        } catch (err) {
            console.error("Failed to delete client:", err);
            alert("Failed to delete client. Please try again.");
        }
    };

    // Generate pagination items
    const getPaginationItems = () => {
        const {page, totalPages} = pagination;
        const items = [];

        // Always show first page
        items.push(
            <PaginationItem key="first">
                <PaginationLink
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(1);
                    }}
                    isActive={page === 1}
                >
                    1
                </PaginationLink>
            </PaginationItem>
        );

        // shows ellipsis if needed
        if (page > 3) {
            items.push(
                <PaginationItem key="ellipsis1">
                    <PaginationEllipsis/>
                </PaginationItem>
            );
        }

        // current page and neighbours
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(i);
                        }}
                        isActive={page === i}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        // ellipsis
        if (page < totalPages - 2) {
            items.push(
                <PaginationItem key="ellipsis2">
                    <PaginationEllipsis/>
                </PaginationItem>
            );
        }

        // --- Always show last page if there is more than one page ---//
        if (totalPages > 1) {
            items.push(
                <PaginationItem key="last">
                    <PaginationLink
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(totalPages);
                        }}
                        isActive={page === totalPages}
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Clients</h1>
                <Button asChild>
                    <Link href="/clients/new">
                        <UserPlus className="mr-2 h-4 w-4"/>
                        New Client
                    </Link>
                </Button>
            </div>

            {/* Search Input */}
            <Card className="mb-6">
                <CardHeader className="pb-3">
                    <CardTitle>Search Clients</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* @ts-expect-error  - unknown error*/}
                    <form onSubmit={handleSearchChange} className="flex gap-2">
                        <div className="relative flex-1">
                            <Input
                                placeholder="Search by name, ID number, or phone number..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground"/>
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-5 w-5"/>
                                </button>
                            )}
                        </div>
                        <Button type="submit">Search</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {isSearching
                            ? `Search Results ${searchQuery ? `for "${searchQuery}"` : ""}`
                            : "All Clients"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center p-8">Loading clients...</div>
                    ) : error ? (
                        <div className="text-center p-8 text-red-500">
                            <p>{error}</p>
                            <Button
                                variant="outline"
                                onClick={fetchClients}
                                className="mt-4"
                            >
                                Try Again
                            </Button>
                        </div>
                    ) : clients.length === 0 ? (
                        <div className="text-center p-8">
                            {isSearching ? (
                                <>
                                    <p className="text-muted-foreground mb-4">No clients found matching your search
                                        criteria</p>
                                    <Button variant="outline" onClick={clearSearch}>Clear Search</Button>
                                </>
                            ) : (
                                <>
                                    <p className="text-muted-foreground mb-4">No clients found</p>
                                    <Button asChild>
                                        <Link href="/clients/new">Register your first client</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID Number</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Gender</TableHead>
                                        <TableHead className="w-24">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {clients.map((client) => (
                                        <TableRow key={client.id}>
                                            <TableCell className="font-mono">
                                                {client.identificationNumber || "—"}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={`/clients/${client.id}`}
                                                    className="hover:underline"
                                                >
                                                    {client.lastName}, {client.firstName}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{client.phone || "—"}</TableCell>
                                            <TableCell className="capitalize">{client.gender || "—"}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4"/>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() => router.push(`/clients/${client.id}`)}>
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className={`bg-green-500/10`}
                                                                          onClick={() => router.push(`/enrollments/new/via-client/${client.id}`)}>
                                                            Enroll to program
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => router.push(`/clients/${client.id}/edit`)}>
                                                            <Edit className="mr-2 h-4 w-4"/> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => setSelectedClient(client.id)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4"/> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {pagination.totalPages > 1 && (
                                <div className="mt-6">
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if (pagination.page > 1) {
                                                            handlePageChange(pagination.page - 1);
                                                        }
                                                    }}
                                                    className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
                                                />
                                            </PaginationItem>

                                            {getPaginationItems()}

                                            <PaginationItem>
                                                <PaginationNext
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if (pagination.page < pagination.totalPages) {
                                                            handlePageChange(pagination.page + 1);
                                                        }
                                                    }}
                                                    className={pagination.page >= pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}

                            <div className="text-sm text-muted-foreground mt-4 text-center">
                                Showing {clients.length} of {pagination.totalCount} clients
                                {isSearching && (
                                    <>
                                        {" "}• <Button variant="link" className="p-0" onClick={clearSearch}>Clear
                                        Search</Button>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <AlertDialog
                open={!!selectedClient}
                onOpenChange={(open) => !open && setSelectedClient(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the client and all associated data.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (selectedClient) {
                                    handleDelete(selectedClient);
                                    setSelectedClient(null);
                                }
                            }}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default function ClientsPage() {
    return (
        <Suspense fallback={<div className="container mx-auto py-6">Loading clients...</div>}>
            <ClientsPageContent />
        </Suspense>
    );
}