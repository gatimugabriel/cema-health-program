"use client";

import {use, useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import clientService from "@/lib/services/client.service";
import { ClientFormSchema } from "@/lib/validation/client.validation";
import { toast } from "sonner";
import {ClientFormData} from "@/types/client";

type ClientFormValues = z.infer<typeof ClientFormSchema>;

interface EditClientPageProps {
  params: Promise<{ id: string }>
}

export default function EditClientPage({ params }: EditClientPageProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { updateClient, getClientById } = clientService;
    const {id} = use(params)

    const form = useForm<ClientFormValues>({
        resolver: zodResolver(ClientFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            gender: undefined,
            dateOfBirth: undefined,
            identificationNumber: "",
            phone: "",
            email: "",
            address: "",
        },
    });

    useEffect(() => {
        const fetchClient = async () => {
            setIsLoading(true);
            try {
                const client = await getClientById(id);


                form.reset({
                    firstName: client.firstName,
                    lastName: client.lastName,
                    // @ts-expect-error -gender error
                    gender: client.gender || undefined,
                    dateOfBirth: client.dateOfBirth ? new Date(client.dateOfBirth) : undefined,
                    identificationNumber: client.identificationNumber,
                    phone: client.phone || "",
                    email: client.email || "",
                    address: client.address || "",
                });
            } catch (err) {
                console.error("Error fetching client:", err);
                setError("Failed to load client data");
                toast.error("Error", {
                    description:  "Failed to load client"
                });
                router.push("/clients");
            } finally {
                setIsLoading(false);
            }
        };

        fetchClient();
    }, [form, getClientById, id, router]);

    const onSubmit = async (data: ClientFormValues) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const formattedData: ClientFormData = {
                ...data,
                dateOfBirth: data.dateOfBirth ? format(data.dateOfBirth, "yyyy-MM-dd") : undefined,
            };

            await updateClient(id, formattedData);
            toast.success("Success", {
                description: "Client updated successfully"
            });
            router.push(`/clients/${id}`);
        } catch (err: unknown) {
            setError("Failed to update client. Please try again.");
            toast.error("Error", {
                description: "Failed to update client"
            });
            console.error("Error updating client:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-6">
                <div className="flex justify-center items-center h-64">
                    <p>Loading client data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <div className="mb-6">
                <Button variant="outline" onClick={() => router.back()} className="mb-4">
                    Back
                </Button>
                <h1 className="text-3xl font-bold">Edit Client</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Client Information</CardTitle>
                    <CardDescription>
                        Update the client personal information below. Fields marked with * are required.
                    </CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* First Name */}
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Mary" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Last Name */}
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Jane" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Gender */}
                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gender</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select gender" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="male">Male</SelectItem>
                                                    <SelectItem value="female">Female</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Date of Birth */}
                                <FormField
                                    control={form.control}
                                    name="dateOfBirth"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Date of Birth</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* ID Number */}
                                <FormField
                                    control={form.control}
                                    name="identificationNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>ID Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123456789" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                National ID, passport, or other identification number
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Phone Number */}
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+254700111222" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="client@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Address */}
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="789 Street, Town/City, County/Region"
                                                className="resize-none min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter className="flex justify-between border-t p-6">
                            <Button
                                variant="outline"
                                onClick={() => router.push(`/clients/${id}`)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Saving Changes..." : "Save Changes"}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    );
}