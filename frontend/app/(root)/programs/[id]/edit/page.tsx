"use client";

import {use, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Switch} from '@/components/ui/switch';
import {toast} from 'sonner';
import programService from '@/lib/services/program.service';

interface EditProgramPageProps {
    params: Promise<{ id: string }>;
}

export default function EditProgramPage({params}: EditProgramPageProps) {
    const {id} = use(params)
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<UpdateProgramDto>({
        name: '',
        description: '',
        active: true,
    });

    useEffect(() => {
        const fetchProgramDetails = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const program = await programService.getProgramById(id);
                setFormData({
                    name: program.name,
                    description: program.description || '',
                    active: program.active,
                });
            } catch (error) {
                console.error("Failed to fetch program details:", error);
                setError("Failed to load program details. Please try again.");
                toast("Error", {
                    description: "Failed to load program details",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchProgramDetails();
    }, [id]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData((prev) => ({...prev, active: checked}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name?.trim()) {
            toast.error("Validation Error", {
                description: "Program name is required",
            });
            return;
        }

        try {
            setIsSubmitting(true);
            await programService.updateProgram(id, formData);
            toast.success("Success", {
                description: "Program updated successfully",
            });
            router.push(`/programs/${id}`);
        } catch (error) {
            console.error("Failed to update program:", error);
            toast.error("Error", {
                description: "Failed to update program. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-6">
                <div className="flex justify-center items-center h-64">
                    <p>Loading program details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-6">
                <div className="flex flex-col items-center justify-center h-64">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={() => router.push('/programs')}>
                        Back to Programs
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Edit Program</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Program Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Program Name *</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter program name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description || ''}
                                onChange={handleChange}
                                placeholder="Enter program description"
                                rows={4}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="active"
                                checked={formData.active}
                                onCheckedChange={handleSwitchChange}
                            />
                            <Label htmlFor="active">Active</Label>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}