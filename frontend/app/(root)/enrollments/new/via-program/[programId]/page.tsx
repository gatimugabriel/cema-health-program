import { notFound } from "next/navigation";
import  programService  from "@/lib/services/program.service";
import { EnrollmentForm } from "@/components/enrollment-form";

interface ProgramEnrollmentPageProps {
    params: Promise<{ programId: string }>;
}

export default async function ProgramEnrollmentPage({
                                                        params,
                                                    }: ProgramEnrollmentPageProps) {

    const pageParams = await params.then().catch().finally();
    const program = await programService.getProgramById(pageParams.programId);
    if (!program) return notFound();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                    Enroll Clients in {program.name}
                </h1>
            </div>

            <div className="mb-4">
                <h2 className="text-lg font-medium">Program Information</h2>
                <p>{program.name}</p>
            </div>

            <EnrollmentForm programId={program.id} />
        </div>
    );
}