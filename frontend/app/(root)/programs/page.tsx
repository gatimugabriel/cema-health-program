"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Edit, Trash2, MoreHorizontal, Plus } from "lucide-react";
import programService from "@/lib/services/program.service";
import {toast} from "sonner";

export default function ProgramsPage() {
    const router = useRouter();
    const [programs, setPrograms] = useState<Program[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
    const {getPrograms, deleteProgram} = programService

    useEffect(() => {
        fetchPrograms().then(() => console.log(''));
    }, []);

    const fetchPrograms = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await getPrograms();
            setPrograms(data);
        } catch (err: any) {
            setError("Failed to load programs. Please try again later.");
            console.error("Error fetching programs:", err);
            toast.error("Error", {
                description: err?.message || "Failed to load programs. Please try again later.",
                position: "top-center"
            })
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteProgram(id);
            setPrograms(programs.filter(program => program.id !== id));
        } catch (err: any) {
            console.error("Failed to delete program:", err);
            // alert("Failed to delete program. Please try again.");
            toast.error("Error", {
                description: err?.message || "Failed to delete program. Please try again."
            })
        }
    };

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Programs</h1>
                <Button asChild className={`text-white`}>
                    <Link href="/programs/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Program
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Health Programs</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center p-8">Loading programs...</div>
                    ) : error ? (
                        <div className="text-center p-8 text-red-500">
                            <p>{error}</p>
                            <Button
                                variant="outline"
                                onClick={fetchPrograms}
                                className="mt-4"
                            >
                                Try Again
                            </Button>
                        </div>
                    ) : programs.length === 0 ? (
                        <div className="text-center p-8">
                            <p className="text-muted-foreground mb-4">No programs found</p>
                            <Button asChild className={`text-white`}>
                                <Link href="/programs/new">Create your first program</Link>
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="w-24">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {programs.map((program) => (
                                    <TableRow key={program.id}>
                                        <TableCell className="font-medium">
                                            <Link
                                                href={`/programs/${program.id}`}
                                                className="hover:underline"
                                            >
                                                {program.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                      <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              program.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}
                      >
                        {program.active ? 'Active' : 'Inactive'}
                      </span>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(program.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => router.push(`/programs/${program.id}`)}>
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => router.push(`/programs/${program.id}/edit`)}>
                                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => setSelectedProgram(program.id)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <AlertDialog
                open={!!selectedProgram}
                onOpenChange={(open) => !open && setSelectedProgram(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the program and all associated data.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (selectedProgram) {
                                    handleDelete(selectedProgram).then(() => console.log(''));
                                    setSelectedProgram(null);
                                }
                            }}
                            className="bg-destructive/90 hover:bg-destructive"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}