import { notFound } from "next/navigation";
import  clientService  from "@/lib/services/client.service";
import { EnrollmentForm } from "@/components/enrollment-form";

interface ClientEnrollmentPageProps {
    params: {
        clientId: string;
    };
}

export default async function ClientEnrollmentPage({
                                                       params,
                                                   }: ClientEnrollmentPageProps) {
    const client = await clientService.getClientById(params.clientId);
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