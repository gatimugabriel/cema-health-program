"use client";

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Switch} from '@/components/ui/switch';
import {toast} from 'sonner';
import programService from '@/lib/services/program.service';

export default function NewProgramPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<CreateProgramDto>({
        name: '',
        description: '',
        active: true,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData((prev) => ({...prev, active: checked}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Validation Error", {
                description: "Program name is required",
            });
            return;
        }

        try {
            setIsSubmitting(true);
            await programService.createProgram(formData);
            toast("Success", {
                description: "Program created successfully",
            });
            router.push('/programs');
        } catch (error) {
            console.error("Failed to create program:", error);
            toast.error("Error", {
                description: "Failed to create program. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">New Program</h1>
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
                                className={`text-white`}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Program'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

