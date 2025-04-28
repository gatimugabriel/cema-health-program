"use client";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {CalendarIcon} from "lucide-react";
import {format} from "date-fns";
import {Textarea} from "@/components/ui/textarea";
import {enrollmentFormSchema} from "@/lib/validation/enrollment.validation";
import { z} from "zod";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import enrollmentService from "@/lib/services/enrollment.service";
import {ClientSearch} from "@/components/client-search";
import {ProgramSearch} from "@/components/program-search";

interface EnrollmentFormProps {
    defaultValues?: Partial<z.infer<typeof enrollmentFormSchema>>;
    onSuccess?: () => void;
    clientId?: string;
    programId?: string;
}

export function EnrollmentForm({
                                   defaultValues,
                                   onSuccess,
                                   clientId,
                                   programId,
                               }: EnrollmentFormProps) {
    const router = useRouter();
    const form = useForm<z.infer<typeof enrollmentFormSchema>>({
        resolver: zodResolver(enrollmentFormSchema),
        defaultValues: {
            clientID: clientId || "",
            programID: programId || "",
            enrollmentDate: new Date(),
            exitDate: null,
            status: "active",
            notes: "",
            ...defaultValues,
        },
    });

    const onSubmit = async (values: z.infer<typeof enrollmentFormSchema>) => {
        try {
            await enrollmentService.createEnrollment({
                clientID: values.clientID,
                programID: values.programID,
                enrollmentDate: values.enrollmentDate  ,
                exitDate: values.exitDate as Date,
                status: values.status || "active",
                notes: values.notes
            });

            toast("Success", {
                description: "Enrollment created successfully",
            });

            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            onSuccess?.() || router.push("/enrollments");
        } catch (error) {
            console.log(error)
            toast("Error", {
                description: "Failed to create enrollment",
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Client Field - only show if not prefilled */}
                    {!clientId && (
                        <FormField
                            control={form.control}
                            name="clientID"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Client</FormLabel>
                                    <ClientSearch onSelect={(id) => form.setValue("clientID", id)}/>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    )}

                    {/* Program Field - only show if not prefilled */}
                    {!programId && (
                        <FormField
                            control={form.control}
                            name="programID"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Program</FormLabel>
                                    <ProgramSearch onSelect={(id) => form.setValue("programID", id)}/>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    )}

                    {/* Enrollment Date */}
                    <FormField
                        control={form.control}
                        name="enrollmentDate"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Enrollment Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className="pl-3 text-left font-normal"
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    {/* Status */}
                    <FormField
                        control={form.control}
                        name="status"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="withdrawn">Withdrawn</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    {/* Notes */}
                    <FormField
                        control={form.control}
                        name="notes"
                        render={({field}) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Notes</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Additional notes about this enrollment"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/enrollments")}
                    >
                        Cancel
                    </Button>
                    <Button type="submit">Enroll Client</Button>
                </div>
            </form>
        </Form>
    );
}