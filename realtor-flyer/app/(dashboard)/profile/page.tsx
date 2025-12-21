"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PortraitUpload } from "@/components/PortraitUpload";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // We would typically fetch this from an API
    // For now, we'll just mock local state as a placeholder for the UI
    const [formData, setFormData] = useState({
        name: "",
        email: "", // Read only usually
        phone: "",
        companyName: "",
        profilePhoto: undefined as string | undefined,
    });

    useEffect(() => {
        // Simulate fetching user data
        // In a real app, this would be a fetch to /api/user
        const loadProfile = async () => {
            try {
                // Mock delay
                await new Promise(resolve => setTimeout(resolve, 500));

                // Mock data - in reality this comes from DB
                setFormData({
                    name: "John Smith",
                    email: "john@example.com",
                    phone: "+1 (555) 123-4567",
                    companyName: "RE/MAX Elite",
                    profilePhoto: undefined
                });
            } catch (error) {
                console.error(error);
                toast.error("Failed to load profile");
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, []);

    const updateForm = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Here we would send a PUT/PATCH request to update the user
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save profile");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="container max-w-2xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Professional Information</CardTitle>
                    <CardDescription>
                        Manage your details and default branding
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-shrink-0 mx-auto md:mx-0">
                            <Label className="block mb-2 text-center md:text-left">Profile Photo</Label>
                            <PortraitUpload
                                value={formData.profilePhoto}
                                onChange={(value) => updateForm("profilePhoto", value)}
                            />
                            <p className="text-xs text-muted-foreground mt-2 text-center max-w-[160px]">
                                This will be used as your default photo for new flyers.
                            </p>
                        </div>

                        <div className="flex-1 space-y-4 w-full">
                            <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => updateForm("name", e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    value={formData.email}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>

                            <div>
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => updateForm("phone", e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="companyName">Company / Brokerage</Label>
                                <Input
                                    id="companyName"
                                    value={formData.companyName}
                                    onChange={(e) => updateForm("companyName", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-brand-navy hover:bg-brand-navy/90"
                        >
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
