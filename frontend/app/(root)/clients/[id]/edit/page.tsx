// "use client";
//
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/components/ui/button";
// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import clientService from "@/lib/services/client.service";
// import { z } from "zod";
//
// const formSchema = z.object({
//     firstName: z.string().min(1, "First name is required"),
//     lastName: z.string().min(1, "Last name is required"),
//     email: z.string().email("Invalid email address"),
//     phone: z.string().min(1, "Phone number is required"),
//     identificationNumber: z.string().min(1, "ID number is required"),
// });
//
// interface EditClientPageProps {
//     pageParams: {
//         id: string;
//     };
// }
//
// export default function EditClientPage({ pageParams }: EditClientPageProps) {
//     const router = useRouter();
//     const [loading, setLoading] = useState(true);
//     const form = useForm({
//         resolver: zodResolver(formSchema),
//     });
//
//     useEffect(() => {
//         const fetchClient = async () => {
//             try {
//                 const client = await clientService.getClientById(pageParams.id);
//                 form.reset({
//                     firstName: client.firstName,
//                     lastName: client.lastName,
//                     email: client.email as string,
//                     phone: client.phone as string,
//                     identificationNumber: client.identificationNumber,
//                 });
//             } catch (error) {
//                 console.error("Failed to fetch client:", error);
//                 router.push("/clients");
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchClient();
//     }, [pageParams.id]);
//
//     const onSubmit = async (values: z.infer<typeof formSchema>) => {
//         try {
//             await clientService.updateClient(pageParams.id, values);
//             router.push(`/clients/${pageParams.id}`);
//         } catch (error) {
//             console.error("Failed to update client:", error);
//         }
//     };
//
//     if (loading) {
//         return <div>Loading...</div>;
//     }
//
//     return (
//         <div className="space-y-6">
//             <div className="flex items-center justify-between">
//                 <h1 className="text-2xl font-bold">Edit Client</h1>
//             </div>
//
//             <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                     <div className="grid gap-4 md:grid-cols-2">
//                         <FormField
//                             control={form.control}
//                             name="firstName"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>First Name</FormLabel>
//                                     <FormControl>
//                                         <Input placeholder="John" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//
//                         <FormField
//                             control={form.control}
//                             name="lastName"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Last Name</FormLabel>
//                                     <FormControl>
//                                         <Input placeholder="Doe" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//
//                         <FormField
//                             control={form.control}
//                             name="email"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Email</FormLabel>
//                                     <FormControl>
//                                         <Input placeholder="john@example.com" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//
//                         <FormField
//                             control={form.control}
//                             name="phone"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Phone</FormLabel>
//                                     <FormControl>
//                                         <Input placeholder="+1234567890" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//
//                         <FormField
//                             control={form.control}
//                             name="identificationNumber"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>ID Number</FormLabel>
//                                     <FormControl>
//                                         <Input placeholder="123456789" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>
//
//                     <div className="flex justify-end gap-2">
//                         <Button
//                             type="button"
//                             variant="outline"
//                             onClick={() => router.push(`/clients/${pageParams.id}`)}
//                         >
//                             Cancel
//                         </Button>
//                         <Button type="submit">Save Changes</Button>
//                     </div>
//                 </form>
//             </Form>
//         </div>
//     );
// }

import React from 'react'

export default function Page() {
    return (
        <div>Page</div>
    )
}
