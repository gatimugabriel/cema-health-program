"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon, UsersIcon, ClipboardListIcon, StethoscopeIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();

    // Temporary data (API yet to be implemented)
    const metrics = {
        totalClients: 245,
        activePrograms: 12,
        totalEnrollments: 1894,
        recentActivities: [
            { id: 1, name: "John Doe", type: "client", date: "2024-05-20" },
            { id: 2, name: "Malaria Program", type: "program", date: "2024-05-19" },
        ]
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">CEMA Health Information System</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.totalClients}</div>
                        <Button
                            variant="link"
                            className="px-0 text-primary"
                            onClick={() => router.push('/clients')}
                        >
                            View all clients
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
                        <ClipboardListIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.activePrograms}</div>
                        <Button
                            variant="link"
                            className="px-0 text-primary"
                            onClick={() => router.push('/programs')}
                        >
                            Manage programs
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
                        <StethoscopeIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.totalEnrollments}</div>
                        <Button
                            variant="link"
                            className="px-0 text-primary"
                            onClick={() => router.push('/enrollments')}
                        >
                            View enrollments
                        </Button>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Button asChild>
                            <Link href="/clients/new">
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Add New Client
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/programs/new">
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Create Program
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/enrollments/new">
                                <PlusIcon className="mr-2 h-4 w-4" />
                                New Enrollment
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Activities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {metrics.recentActivities.map((activity) => (
                                <div key={activity.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                                    <div>
                                        <div className="font-medium">{activity.name}</div>
                                        <div className="text-sm text-muted-foreground capitalize">
                                            {activity.type} added
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {new Date(activity.date).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}