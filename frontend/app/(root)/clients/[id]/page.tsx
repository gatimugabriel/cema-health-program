"use client";

import {use, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Badge} from "@/components/ui/badge";
import {ArrowLeft, CalendarRange, Edit, FileText, Mail, MapPin, Phone, Plus, User} from "lucide-react";

import {Client, Enrollment} from "@/types/client";
import clientService from "@/lib/services/client.service";
import {formatDate} from "@/lib/utils";

type ClientDetailPageProps = {
    params: {
        id: string;
    };
};

export default function ClientDetailPage({params}: { params: { id: string } }) {
    // @ts-ignore
    const pageParams: ClientDetailPageProps['params'] = use(params)
    const router = useRouter();
    const [client, setClient] = useState<Client | null>(null);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const {getClientById, getClientEnrollments} = clientService;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Fetch client details
                const clientData = await getClientById(pageParams.id);
                setClient(clientData);

                // Fetch client enrollments
                const enrollmentsData = await getClientEnrollments(pageParams.id);
                setEnrollments(enrollmentsData);
            } catch (err: any) {
                setError(err.message || "Failed to load client data");
                console.error("Error fetching client data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [pageParams.id]);

    if (isLoading) {
        return (
            <div className="container mx-auto py-6 flex justify-center items-center min-h-[60vh]">
                <div className="text-center">
                    <p className="text-lg">Loading client information...</p>
                </div>
            </div>
        );
    }

    if (error || !client) {
        return (
            <div className="container mx-auto py-6">
                <div className="mb-6">
                    <Button variant="outline" onClick={() => router.push("/clients")} className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4"/> Back to Clients
                    </Button>
                </div>

                <Card className="text-center p-8">
                    <CardTitle className="mb-4 text-red-600">Error</CardTitle>
                    <CardDescription className="text-lg mb-4">
                        {error || "Failed to load client information"}
                    </CardDescription>
                    <Button onClick={() => router.push("/clients")}>
                        Return to Clients List
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <Button variant="outline" onClick={() => router.push("/clients")} className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4"/> Back to Clients
                    </Button>
                    <h1 className="text-3xl font-bold">{client.firstName} {client.lastName}</h1>
                    {client.identificationNumber && (
                        <p className="text-muted-foreground mt-1">ID: {client.identificationNumber}</p>
                    )}
                </div>
                <Button asChild>
                    <Link href={`/clients/${client.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4"/> Edit Client
                    </Link>
                </Button>
            </div>

            <Tabs defaultValue="details" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="details">Client Details</TabsTrigger>
                    <TabsTrigger value="enrollments">
                        Program Enrollments
                        {enrollments.length > 0 && (
                            <Badge variant="secondary" className="ml-2 px-1.5">
                                {enrollments.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* Client Profile */}
                <TabsContent value="details">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Client details and contact information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                                            <User className="mr-2 h-4 w-4"/> Full Name
                                        </h3>
                                        <p className="text-lg">{client.firstName} {client.lastName}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                                            <CalendarRange className="mr-2 h-4 w-4"/> Date of Birth
                                        </h3>
                                        <p>{client.dateOfBirth ? formatDate(client.dateOfBirth) : "—"}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                                            <FileText className="mr-2 h-4 w-4"/> Gender
                                        </h3>
                                        <p className="capitalize">{client.gender || "—"}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                                            <FileText className="mr-2 h-4 w-4"/> Identification Number
                                        </h3>
                                        <p className="font-mono">{client.identificationNumber || "—"}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                                            <Phone className="mr-2 h-4 w-4"/> Phone Number
                                        </h3>
                                        <p>{client.phone || "—"}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                                            <Mail className="mr-2 h-4 w-4"/> Email
                                        </h3>
                                        <p>{client.email || "—"}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                                            <MapPin className="mr-2 h-4 w-4"/> Address
                                        </h3>
                                        <p className="whitespace-pre-line">{client.address || "—"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-border">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Record
                                            Information</h3>
                                        <p className="text-sm mt-1">
                                            Created on {formatDate(client.createdAt)} •
                                            Last updated on {formatDate(client.updatedAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/*Client Enrollments*/}
                <TabsContent value="enrollments">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Program Enrollments</CardTitle>
                                <CardDescription>Programs the client is enrolled in</CardDescription>
                            </div>
                            <Button asChild>
                                <Link href={`/enrollments/new?clientId=${client.id}`}>
                                    <Plus className="mr-2 h-4 w-4"/> New Enrollment
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {enrollments.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground mb-4">This client is not enrolled in any
                                        programs yet</p>
                                    <Button asChild>
                                        <Link href={`/enrollments/new?clientId=${client.id}`}>
                                            Create First Enrollment
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Program</TableHead>
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
                                                        href={`/programs/${enrollment.programID}`}
                                                        className="hover:underline"
                                                    >
                                                        {enrollment.program.name}
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
        </div>
    );
}

// Status badge component
function StatusBadge({status}: { status: string }) {
    let variant: "default" | "outline" | "secondary" | "destructive" = "outline";

    switch (status) {
        case "active":
            variant = "default";
            break;
        case "completed":
            variant = "secondary";
            break;
        case "withdrawn":
            variant = "destructive";
            break;
    }

    return (
        <Badge variant={variant} className="capitalize">
            {status}
        </Badge>
    );
}