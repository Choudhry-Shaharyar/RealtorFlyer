"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfileAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Camera, Upload } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileSetupModalProps {
    user: {
        name: string | null;
        phone: string | null;
        profilePhoto: string | null;
        companyName: string | null;
    };
}

export function ProfileSetupModal({ user }: ProfileSetupModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState(user.name || "");
    const [phone, setPhone] = useState(user.phone || "");
    const [companyName, setCompanyName] = useState(user.companyName || "");
    const [profilePhoto, setProfilePhoto] = useState<string | null>(user.profilePhoto);

    const router = useRouter();

    useEffect(() => {
        // Open modal if essential details are missing
        // Specifically check for profile photo as requested, but also good to have name/phone
        if (!user.profilePhoto || !user.name || !user.phone) {
            setIsOpen(true);
        }
    }, [user]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await updateProfileAction({
                name,
                phone,
                profilePhoto: profilePhoto || undefined,
                companyName: companyName || undefined,
            });
            toast.success("Profile updated successfully!");
            setIsOpen(false);
            router.refresh();
        } catch (error) {
            toast.error("Failed to update profile. Please try again.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => {
                // Prevent closing if data is still missing, forcing the user to complete it
                // You can make this optional, but user "tell them to upload ... right now" implies urgency
                if (!profilePhoto || !name) {
                    e.preventDefault();
                }
            }}>
                <DialogHeader>
                    <DialogTitle>Complete Your Profile</DialogTitle>
                    <DialogDescription>
                        Please update your profile with a professional photo and your contact details. This will be used on your flyers.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 py-4">
                        {/* Profile Photo Upload */}
                        <div className="flex flex-col items-center gap-4">
                            <Label htmlFor="photo" className="cursor-pointer group relative">
                                <Avatar className="w-24 h-24 border-2 border-dashed border-muted-foreground/50 group-hover:border-brand-navy transition-colors">
                                    <AvatarImage src={profilePhoto || ""} />
                                    <AvatarFallback className="bg-muted">
                                        <Camera className="w-8 h-8 text-muted-foreground" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-0 right-0 bg-brand-navy text-white p-1.5 rounded-full shadow-md">
                                    <Upload className="w-3 h-3" />
                                </div>
                                <Input
                                    id="photo"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                            </Label>
                            <p className="text-xs text-muted-foreground">Click to upload a portrait</p>
                        </div>

                        {/* Name Input */}
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Jane Doe"
                                required
                            />
                        </div>

                        {/* Phone Input */}
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="e.g. (555) 123-4567"
                                required
                            />
                        </div>

                        {/* Company/Brokerage Input */}
                        <div className="grid gap-2">
                            <Label htmlFor="companyName">Company / Brokerage</Label>
                            <Input
                                id="companyName"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="e.g. RE/MAX, Century 21"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        {/* Allow skipping ONLY if they have at least a name? Or simplify enforcement */}
                        {/* User said "tell them... (optional...)" but also "right now". 
                            I'll verify inputs but strictly require name/photo. */}
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                            Remind Me Later
                        </Button>
                        <Button type="submit" disabled={isLoading || !name || !profilePhoto} className="bg-brand-navy hover:bg-brand-navy-light text-white">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Profile
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
