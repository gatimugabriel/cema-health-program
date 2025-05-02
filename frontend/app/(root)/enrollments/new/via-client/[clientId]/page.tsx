import { notFound } from "next/navigation";
import clientService from "@/lib/services/client.service";
import { EnrollmentForm } from "@/components/forms/enrollment-form";

interface ClientEnrollmentPageProps {
    params: Promise<{ clientId: string }>;
}

export default async function ClientEnrollmentPage({
                                                       params,
                                                   }: ClientEnrollmentPageProps) {
    const pageParams = await params
    const client = await clientService.getClientById(pageParams.clientId).catch(() => null);

    if (!client) return notFound();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                    Enroll {client.firstName} {client.lastName}
                </h1>
            </div>

            <div className="mb-4">
                <h2 className="text-lg font-medium">Client Information</h2>
                <p>
                    {client.firstName} {client.lastName} ({client.identificationNumber})
                </p>
            </div>

            <EnrollmentForm clientId={client.id} />
        </div>
    );
}