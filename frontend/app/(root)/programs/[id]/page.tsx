"use client";

import {use, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {toast} from "sonner";
import {ArrowLeft, Edit, Plus, Trash2} from "lucide-react";
import programService from "@/lib/services/program.service";
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
import {Enrollment} from "@/types/enrollment";
import enrollmentService from "@/lib/services/enrollment.service";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {formatDate} from "@/lib/utils";
import StatusBadge from "@/components/status-badge";

interface ProgramDetailPageProps {
    params: {
        id: string;
    };
}

export default function ProgramDetailPage({params}: ProgramDetailPageProps) {
    // @ts-ignore
    const pageParams: ProgramDetailPageProps['params'] = use(params)

    const router = useRouter();
    const [program, setProgram] = useState<Program | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const {getProgramEnrollments} = enrollmentService;

    useEffect(() => {
        fetchProgramDetails();
    }, [pageParams.id]);

    const fetchProgramDetails = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await programService.getProgramById(pageParams.id);
            setProgram(data);

            // Fetch enrollments
            const enrollmentsData = await getProgramEnrollments(pageParams.id);
            setEnrollments(enrollmentsData);
        } catch (error) {
            console.error("Failed to fetch program details:", error);
            setError("Failed to load program details. Please try again.");
            toast("Error", {
                description: "Failed to load program details",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await programService.deleteProgram(pageParams.id);
            toast("Success", {
                description: "Program deleted successfully",
            });
            router.push('/programs');
        } catch (error) {
            console.error("Failed to delete program:", error);
            toast.error("Error", {
                description: "Failed to delete program. Please try again.",
            });
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-6">
                <div className="flex justify-center items-center h-64">
                    <p>Loading program details...</p>
                </div>
            </div>
        );
    }

    if (error || !program) {
        return (
            <div className="container mx-auto py-6">
                <div className="flex flex-col items-center justify-center h-64">
                    <p className="text-red-500 mb-4">{error || "Program not found"}</p>
                    <Button onClick={() => router.push('/programs')}>
                        Back to Programs
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <Button variant="outline" size="icon" onClick={() => router.push('/programs')}>
                        <ArrowLeft className="h-4 w-4"/>
                    </Button>
                    <h1 className="text-3xl font-bold">{program.name}</h1>
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            program.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                        {program.active ? 'Active' : 'Inactive'}
                    </span>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => router.push(`/programs/${pageParams.id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4"/>
                        Edit
                    </Button>
                    <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                        <Trash2 className="mr-2 h-4 w-4"/>
                        Delete
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="details" className="w-full">
                <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="enrollments">
                        Program Enrollments
                        {enrollments.length > 0 && (
                            <Badge variant="secondary" className="ml-2 px-1.5">
                                {enrollments.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* Program Data*/}
                <TabsContent value="details">
                    <Card>
                        <CardHeader>
                            <CardTitle>Program Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-medium text-sm text-muted-foreground">Description</h3>
                                <p className="mt-1">{program.description || "No description provided"}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-medium text-sm text-muted-foreground">Created</h3>
                                    <p className="mt-1">{new Date(program.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm text-muted-foreground">Last Updated</h3>
                                    <p className="mt-1">{new Date(program.updatedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Program Enrollments */}
                <TabsContent value="enrollments">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Program Enrollments</CardTitle>
                                <CardDescription>Enrollments of this program</CardDescription>
                            </div>
                            <Button asChild>
                                <Link href={`/enrollments/new?programId=${program.id}`}>
                                    <Plus className="mr-2 h-4 w-4"/> New Enrollment
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {enrollments.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground mb-4">This progrma has no enrollments yet</p>
                                    <Button asChild>
                                        <Link href={`/enrollments/new?clientId=${program.id}`}>
                                            Create First Enrollment
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Client</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Enrolled</TableHead>
                                            <TableHead>Completed</TableHead>
                                            <TableHead className="w-24">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {enrollments.length > 0 && enrollments.map((enrollment) => (
                                            <TableRow key={enrollment.id}>
                                                <TableCell className="font-medium">
                                                    <Link
                                                        href={`/clients/${enrollment.clientID}`}
                                                        className="hover:underline"
                                                    >
                                                        {`${enrollment.client.firstName} ${enrollment.client.lastName}`}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge status={enrollment.status}/>
                                                </TableCell>
                                                <TableCell>{formatDate(enrollment.enrollmentDate)}</TableCell>
                                                <TableCell>{formatDate(enrollment.exitDate)}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link href={`/enrollments/${enrollment.id}`}>
                                                            View
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
                            onClick={handleDelete}
                            className="bg-destructive/95 hover:cursor-pointer hover:bg-destructive"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

