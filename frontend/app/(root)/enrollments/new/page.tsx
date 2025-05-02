// "use client";
//
// import {useRouter} from "next/navigation";
// import {useForm} from "react-hook-form";
// import {zodResolver} from "@hookform/resolvers/zod";
// import {Button} from "@/components/ui/button";
// import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
// import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
// import {Calendar} from "@/components/ui/calendar";
// import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
// import {CalendarIcon} from "lucide-react";
// import {format} from "date-fns";
// import {Textarea} from "@/components/ui/textarea";
// import {toast} from "sonner";
// import {z} from "zod";
// import enrollmentService from "@/lib/services/enrollment.service";
// import clientService from "@/lib/services/client.service";
// import programService from "@/lib/services/program.service";
// import {Client} from "@/types/client";
// import {useEffect, useState} from "react";
// import {enrollmentFormSchema} from "@/lib/validation/enrollment.validation";
//
//
// export default function NewEnrollmentPage() {
//     const router = useRouter();
//     const [clients, setClients] = useState<Client[]>([])
//     const [programs, setPrograms] = useState<Program[]>([])
//     const [isLoading, setIsLoading] = useState(true)
//     const [error, setError] = useState(null)
//
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const clientsResponse = await clientService.getClients({page: 1, pageSize: 100});
//                 const programsResponse = await programService.getPrograms();
//
//                 setClients(clientsResponse.data);
//                 setPrograms(programsResponse);
//             } catch (err: any) {
//                 setError(err);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//
//         fetchData();
//     }, []);
//
//     const form = useForm({
//         resolver: zodResolver(enrollmentFormSchema),
//         defaultValues: {
//             clientID: "",
//             programID: "",
//             enrollmentDate: new Date(),
//             exitDate: null,
//             status: "active",
//             notes: "",
//         },
//     });
//
//     const onSubmit = async (values: z.infer<typeof enrollmentFormSchema>) => {
//         try {
//             await enrollmentService.createEnrollment({
//                 clientID: values.clientID,
//                 programID: values.programID,
//                 enrollmentDate: values.enrollmentDate,
//                 exitDate: values.exitDate,
//                 status: values.status,
//                 notes: values.notes,
//             });
//
//             toast.success("Success", {
//                 description: "Client enrolled successfully",
//             });
//             router.push("/enrollments");
//         } catch (error: any) {
//             console.error("error:", error)
//             toast.error("Error", {
//                 description: "Failed to enroll client",
//             });
//         }
//     };
//
//     return (
//         <div className="space-y-6">
//             <div className="flex items-center justify-between">
//                 <h1 className="text-2xl font-bold">New Enrollment</h1>
//             </div>
//
//             <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                     <div className="grid gap-4 md:grid-cols-2">
//                         {/* Client Selection */}
//                         <FormField
//                             control={form.control}
//                             name="clientID"
//                             render={({field}) => (
//                                 <FormItem>
//                                     <FormLabel>Client</FormLabel>
//                                     <Select onValueChange={field.onChange} value={field.value}>
//                                         <FormControl>
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder="Select a client"/>
//                                             </SelectTrigger>
//                                         </FormControl>
//                                         <SelectContent>
//                                             {clients?.map((client: Client) => (
//                                                 <SelectItem key={client.id} value={client.id}>
//                                                     {client.firstName} {client.lastName} ({client.identificationNumber})
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                     <FormMessage/>
//                                 </FormItem>
//                             )}
//                         />
//
//                         {/* Program Selection */}
//                         <FormField
//                             control={form.control}
//                             name="programID"
//                             render={({field}) => (
//                                 <FormItem>
//                                     <FormLabel>Program</FormLabel>
//                                     <Select onValueChange={field.onChange} value={field.value}>
//                                         <FormControl>
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder="Select a program"/>
//                                             </SelectTrigger>
//                                         </FormControl>
//                                         <SelectContent>
//                                             {programs?.map((program: Program) => (
//                                                 <SelectItem key={program.id} value={program.id}>
//                                                     {program.name}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                     <FormMessage/>
//                                 </FormItem>
//                             )}
//                         />
//
//                         {/* Enrollment Date */}
//                         <FormField
//                             control={form.control}
//                             name="enrollmentDate"
//                             render={({field}) => (
//                                 <FormItem className="flex flex-col">
//                                     <FormLabel>Enrollment Date</FormLabel>
//                                     <Popover>
//                                         <PopoverTrigger asChild>
//                                             <FormControl>
//                                                 <Button
//                                                     variant="outline"
//                                                     className="pl-3 text-left font-normal"
//                                                 >
//                                                     {field.value ? (
//                                                         format(field.value, "PPP")
//                                                     ) : (
//                                                         <span>Pick a date</span>
//                                                     )}
//                                                     <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
//                                                 </Button>
//                                             </FormControl>
//                                         </PopoverTrigger>
//                                         <PopoverContent className="w-auto p-0" align="start">
//                                             <Calendar
//                                                 mode="single"
//                                                 selected={field.value}
//                                                 onSelect={field.onChange}
//                                                 initialFocus
//                                             />
//                                         </PopoverContent>
//                                     </Popover>
//                                     <FormMessage/>
//                                 </FormItem>
//                             )}
//                         />
//
//                         {/* Status */}
//                         <FormField
//                             control={form.control}
//                             name="status"
//                             render={({field}) => (
//                                 <FormItem>
//                                     <FormLabel>Status</FormLabel>
//                                     <Select onValueChange={field.onChange} value={field.value}>
//                                         <FormControl>
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder="Select status"/>
//                                             </SelectTrigger>
//                                         </FormControl>
//                                         <SelectContent>
//                                             <SelectItem value="active">Active</SelectItem>
//                                             <SelectItem value="completed">Completed</SelectItem>
//                                             <SelectItem value="withdrawn">Withdrawn</SelectItem>
//                                         </SelectContent>
//                                     </Select>
//                                     <FormMessage/>
//                                 </FormItem>
//                             )}
//                         />
//
//                         {/* Notes */}
//                         <FormField
//                             control={form.control}
//                             name="notes"
//                             render={({field}) => (
//                                 <FormItem className="md:col-span-2">
//                                     <FormLabel>Notes</FormLabel>
//                                     <FormControl>
//                                         <Textarea
//                                             placeholder="Additional notes about this enrollment"
//                                             className="resize-none"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                     <FormMessage/>
//                                 </FormItem>
//                             )}
//                         />
//                     </div>
//
//                     <div className="flex justify-end gap-2">
//                         <Button
//                             type="button"
//                             variant="outline"
//                             onClick={() => router.push("/enrollments")}
//                         >
//                             Cancel
//                         </Button>
//                         <Button type="submit">Enroll Client</Button>
//                     </div>
//                 </form>
//             </Form>
//         </div>
//     );
// }


import { EnrollmentForm } from "@/components/forms/enrollment-form";

export default function NewEnrollmentPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">New Enrollment</h1>
            </div>
            <EnrollmentForm />
        </div>
    );
}