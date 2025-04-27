"use client";

import {use, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {format} from "date-fns";
import enrollmentService from "@/lib/services/enrollment.service";
import {toast} from "sonner";
import {Enrollment} from "@/types/enrollment";

interface EnrollmentDetailPageProps {
    params: {
        id: string;
    };
}

export default function EnrollmentDetailPage({params}: EnrollmentDetailPageProps) {
    // @ts-expect-error
    const pageParams: EnrollmentDetailPageProps['params'] = use(params)
    const router = useRouter();
    const [enrollment, setEnrollment] = useState<Enrollment>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnrollment = async () => {
            try {
                const data = await enrollmentService.getEnrollmentById(pageParams.id);
                setEnrollment(data);
            } catch (error) {
                console.error("Failed to fetch enrollment:", error);
                router.push("/enrollments");
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollment();
    }, [pageParams.id]);

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this enrollment?")) {
            try {
                await enrollmentService.deleteEnrollment(pageParams.id);
                toast.success("Success", {
                    description: "Enrollment deleted successfully",
                });
                router.push("/enrollments");
            } catch (error: any) {
                toast.error("Error", {
                    description: "Failed to delete enrollment",
                });
            }
        }
    };

    if (loading) {
        return <div>Loading enrollment details...</div>;
    }

    if (!enrollment) {
        return <div>Enrollment not found</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Enrollment Details</h1>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => router.push(`/enrollments/${pageParams.id}/edit`)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Client Information */}
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Client Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p>
                                {enrollment.client.firstName} {enrollment.client.lastName}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">ID Number</p>
                            <p>{enrollment.client.identificationNumber}</p>
                        </div>
                    </div>
                </div>

                {/* Program Information */}
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Program Information</h2>
                    <div>
                        <p className="text-sm text-muted-foreground">Program Name</p>
                        <p>{enrollment.program.name}</p>
                    </div>
                </div>

                {/* Enrollment Details */}
                <div className="space-y-2 md:col-span-2">
                    <h2 className="text-lg font-semibold">Enrollment Details</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Enrollment Date</p>
                            <p>{format(new Date(enrollment.enrollmentDate), "PPP")}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <p className="capitalize">{enrollment.status}</p>
                        </div>
                        {enrollment.exitDate && (
                            <div>
                                <p className="text-sm text-muted-foreground">Exit Date</p>
                                <p>{format(new Date(enrollment.exitDate), "PPP")}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Notes */}
                {enrollment.notes && (
                    <div className="space-y-2 md:col-span-2">
                        <h2 className="text-lg font-semibold">Notes</h2>
                        <p className="text-sm whitespace-pre-line">{enrollment.notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
}