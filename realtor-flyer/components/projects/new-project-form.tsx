"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home, DollarSign, TrendingDown, Calendar, Clock, Key,
    ArrowLeft, ArrowRight, Loader2, Sparkles, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { PortraitUpload } from "@/components/PortraitUpload";
import { ProjectImageUpload } from "@/components/ProjectImageUpload";
import { uploadBase64Image } from "@/lib/client-storage";
import { createClient } from "@/lib/supabase/client";

const LISTING_TYPES = [
    { value: "FOR SALE", label: "For Sale", icon: Home, description: "Standard property listing" },
    { value: "FOR LEASE", label: "For Lease", icon: Key, description: "Rental property" },
    { value: "SOLD", label: "Sold", icon: Check, description: "Celebrate a closed deal" },
    { value: "OPEN HOUSE", label: "Open House", icon: Calendar, description: "Invite buyers to visit" },
    { value: "COMING SOON", label: "Coming Soon", icon: Clock, description: "Build anticipation" },
    { value: "PRICE REDUCTION", label: "Price Reduction", icon: TrendingDown, description: "Highlight a price drop" },
];

const COLOR_SCHEMES = [
    { value: "navy", label: "Navy Blue", color: "#1e3a5f", accent: "#f59e0b" },
    { value: "black", label: "Elegant Black", color: "#111827", accent: "#e5e7eb" },
    { value: "green", label: "Forest Green", color: "#166534", accent: "#fef3c7" },
    { value: "burgundy", label: "Burgundy", color: "#881337", accent: "#fef3c7" },
];

const STYLES = [
    { value: "modern", label: "Modern", description: "Clean lines, minimal design" },
    { value: "luxury", label: "Luxury", description: "Premium, elegant feel" },
    { value: "minimalist", label: "Minimalist", description: "Ultra-clean, simple" },
    { value: "classic", label: "Classic", description: "Traditional, timeless" },
];

const ASPECT_RATIOS = [
    { value: "1:1", label: "Square", description: "Instagram Feed", size: "1080×1080" },
    { value: "9:16", label: "Story / Full Screen", description: "IG/TikTok Stories", size: "1080×1920" },
    { value: "16:9", label: "Landscape", description: "Facebook/LinkedIn", size: "1920×1080" },
    { value: "4:5", label: "Vertical Post", description: "IG Feed Portrait", size: "1080×1350" },
];

interface NewProjectFormProps {
    initialAgentData?: {
        name: string | null;
        phone: string | null;
        companyName: string | null;
        profilePhoto: string | null;
    };
}

export function NewProjectForm({ initialAgentData }: NewProjectFormProps) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);

    const [formData, setFormData] = useState({
        // Step 1: Listing Type
        listingType: "FOR SALE",

        // Step 2: Agent Info - Pre-populated from user profile
        agentName: initialAgentData?.name || "",
        agentPhone: initialAgentData?.phone || "",
        agentCompany: initialAgentData?.companyName || "",
        agentPortrait: initialAgentData?.profilePhoto || undefined as string | undefined,

        // Step 3: Property Details
        propertyAddress: "",
        price: "",
        originalPrice: "",
        bedrooms: "3",
        bathrooms: "2",
        squareFeet: "",
        description: "",

        // Step 4: Property Images
        propertyImages: [] as string[],

        // Step 5: Design
        colorScheme: "navy",
        style: "modern",
        aspectRatio: "1:1",
    });

    const totalSteps = 5;

    const updateForm = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleGenerate = async () => {
        setIsGenerating(true);

        try {
            // 1. Get current user ID for uploads
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast.error("You must be logged in to generate a flyer");
                router.push("/sign-in");
                return;
            }

            // 2. Prepare data copy
            const updatedFormData = { ...formData };

            // 3. Upload Agent Portrait if Base64
            if (updatedFormData.agentPortrait && updatedFormData.agentPortrait.startsWith("data:")) {
                try {
                    toast.info("Uploading agent portrait...");
                    const publicUrl = await uploadBase64Image(updatedFormData.agentPortrait, user.id);
                    updatedFormData.agentPortrait = publicUrl;
                } catch (error) {
                    console.error("Portrait upload failed:", error);
                    toast.error("Failed to upload portrait. Please try a different image.");
                    setIsGenerating(false);
                    return;
                }
            }

            // 4. Upload Property Images if Base64
            if (updatedFormData.propertyImages && updatedFormData.propertyImages.length > 0) {
                const uploadedImages: string[] = [];

                // Track if we are uploading to show progress
                const hasBase64 = updatedFormData.propertyImages.some(img => img.startsWith("data:"));
                if (hasBase64) {
                    toast.info("Uploading property images...");
                }

                for (const img of updatedFormData.propertyImages) {
                    if (img.startsWith("data:")) {
                        try {
                            const publicUrl = await uploadBase64Image(img, user.id);
                            uploadedImages.push(publicUrl);
                        } catch (error) {
                            console.error("Image upload failed:", error);
                            toast.error("Failed to upload one or more property images.");
                            setIsGenerating(false);
                            return;
                        }
                    } else {
                        // Already a URL (e.g. from previous edit or fetch)
                        uploadedImages.push(img);
                    }
                }
                updatedFormData.propertyImages = uploadedImages;
            }

            // 5. Submit to API with URLs
            const response = await fetch("/api/projects/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedFormData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate flyer");
            }

            toast.success("Flyer generated successfully!");
            router.push(`/projects/${data.projectId}`);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
            setIsGenerating(false);
        }
    };

    const canProceed = () => {
        switch (step) {
            case 1:
                return !!formData.listingType;
            case 2:
                // Agent Info
                return !!formData.agentName && !!formData.agentPhone;
            case 3:
                // Property Details
                return !!formData.price && !!formData.bedrooms && !!formData.bathrooms;
            case 4:
                // Property Images (Optional, so always allowed)
                return true;
            case 5:
                return !!formData.colorScheme && !!formData.style && !!formData.aspectRatio;
            default:
                return true;
        }
    };

    return (
        <div className="container max-w-3xl mx-auto py-8 px-4">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Step {step} of {totalSteps}</span>
                    <span className="text-muted-foreground">{Math.round((step / totalSteps) * 100)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-brand-gold"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / totalSteps) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Step 1: Listing Type */}
                    {step === 1 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>What type of listing is this?</CardTitle>
                                <CardDescription>
                                    Choose the type of post you want to create
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {LISTING_TYPES.map((type) => {
                                        const Icon = type.icon;
                                        const isSelected = formData.listingType === type.value;
                                        return (
                                            <button
                                                key={type.value}
                                                onClick={() => updateForm("listingType", type.value)}
                                                className={`p-4 rounded-lg border-2 text-left transition-all ${isSelected
                                                    ? "border-brand-gold bg-brand-gold/10"
                                                    : "border-muted hover:border-brand-gold/50"
                                                    }`}
                                            >
                                                <Icon className={`h-6 w-6 mb-2 ${isSelected ? "text-brand-gold" : "text-muted-foreground"}`} />
                                                <div className="font-medium">{type.label}</div>
                                                <div className="text-xs text-muted-foreground">{type.description}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 2: Agent Info */}
                    {step === 2 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Agent Information</CardTitle>
                                <CardDescription>
                                    This will appear on your flyer (pre-filled from your profile)
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                    <div className="flex-shrink-0 mx-auto md:mx-0">
                                        <Label className="block mb-2 text-center md:text-left">Profile Photo</Label>
                                        <PortraitUpload
                                            value={formData.agentPortrait}
                                            onChange={(value) => updateForm("agentPortrait", value)}
                                        />
                                    </div>
                                    <div className="flex-1 space-y-4 w-full">
                                        <div>
                                            <Label htmlFor="agentName">Your Name *</Label>
                                            <Input
                                                id="agentName"
                                                placeholder="John Smith"
                                                value={formData.agentName}
                                                onChange={(e) => updateForm("agentName", e.target.value)}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="agentPhone">Phone Number *</Label>
                                            <Input
                                                id="agentPhone"
                                                placeholder="+1 (555) 123-4567"
                                                value={formData.agentPhone}
                                                onChange={(e) => updateForm("agentPhone", e.target.value)}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="agentCompany">Company/Brokerage (optional)</Label>
                                            <Input
                                                id="agentCompany"
                                                placeholder="Acme Realty"
                                                value={formData.agentCompany}
                                                onChange={(e) => updateForm("agentCompany", e.target.value)}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 3: Property Details */}
                    {step === 3 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Property Details</CardTitle>
                                <CardDescription>
                                    Tell us about the property
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <Label htmlFor="propertyAddress">Property Address (optional)</Label>
                                        <div className="relative mt-1">
                                            <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="propertyAddress"
                                                placeholder="123 Main St, City, ST"
                                                value={formData.propertyAddress}
                                                onChange={(e) => updateForm("propertyAddress", e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        <Label htmlFor="price">Listing Price *</Label>
                                        <div className="relative mt-1">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="price"
                                                placeholder="450,000"
                                                value={formData.price}
                                                onChange={(e) => updateForm("price", e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    {formData.listingType === "PRICE REDUCTION" && (
                                        <div className="col-span-2">
                                            <Label htmlFor="originalPrice">Original Price *</Label>
                                            <div className="relative mt-1">
                                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="originalPrice"
                                                    placeholder="495,000"
                                                    value={formData.originalPrice}
                                                    onChange={(e) => updateForm("originalPrice", e.target.value)}
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <Label htmlFor="bedrooms">Bedrooms *</Label>
                                        <Input
                                            id="bedrooms"
                                            type="number"
                                            min="0"
                                            max="20"
                                            value={formData.bedrooms}
                                            onChange={(e) => updateForm("bedrooms", e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="bathrooms">Bathrooms *</Label>
                                        <Input
                                            id="bathrooms"
                                            type="number"
                                            min="0"
                                            max="20"
                                            step="0.5"
                                            value={formData.bathrooms}
                                            onChange={(e) => updateForm("bathrooms", e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <Label htmlFor="squareFeet">Square Feet (optional)</Label>
                                        <Input
                                            id="squareFeet"
                                            placeholder="2,500"
                                            value={formData.squareFeet}
                                            onChange={(e) => updateForm("squareFeet", e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <Label htmlFor="description">Tagline (optional)</Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Charming home in a quiet neighborhood. Don't miss this opportunity!"
                                            value={formData.description}
                                            onChange={(e) => updateForm("description", e.target.value)}
                                            className="mt-1"
                                            maxLength={100}
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formData.description.length}/100 characters
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 4: Property Images (NEW) */}
                    {step === 4 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Property Images</CardTitle>
                                <CardDescription>
                                    Upload photos of the property (optional)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ProjectImageUpload
                                    images={formData.propertyImages}
                                    onImagesChange={(images) => updateForm("propertyImages", images)}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 5: Design Options */}
                    {step === 5 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Design Your Flyer</CardTitle>
                                <CardDescription>
                                    Choose colors, style, and format
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                {/* Color Scheme */}
                                <div>
                                    <Label className="text-base font-semibold">Color Scheme</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                                        {COLOR_SCHEMES.map((scheme) => {
                                            const isSelected = formData.colorScheme === scheme.value;
                                            return (
                                                <button
                                                    key={scheme.value}
                                                    onClick={() => updateForm("colorScheme", scheme.value)}
                                                    className={`p-3 rounded-lg border-2 transition-all ${isSelected
                                                        ? "border-brand-gold"
                                                        : "border-muted hover:border-brand-gold/50"
                                                        }`}
                                                >
                                                    <div
                                                        className="w-full h-8 rounded mb-2"
                                                        style={{ backgroundColor: scheme.color }}
                                                    />
                                                    <div className="text-sm font-medium">{scheme.label}</div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Style */}
                                <div>
                                    <Label className="text-base font-semibold">Style</Label>
                                    <RadioGroup
                                        value={formData.style}
                                        onValueChange={(value) => updateForm("style", value)}
                                        className="grid grid-cols-2 gap-3 mt-3"
                                    >
                                        {STYLES.map((style) => (
                                            <label
                                                key={style.value}
                                                className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${formData.style === style.value
                                                    ? "border-brand-gold bg-brand-gold/5"
                                                    : "border-muted hover:border-brand-gold/50"
                                                    }`}
                                            >
                                                <RadioGroupItem value={style.value} />
                                                <div>
                                                    <div className="font-medium">{style.label}</div>
                                                    <div className="text-xs text-muted-foreground">{style.description}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </RadioGroup>
                                </div>

                                {/* Aspect Ratio */}
                                <div>
                                    <Label className="text-base font-semibold">Size / Format</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                                        {ASPECT_RATIOS.map((ratio) => {
                                            const isSelected = formData.aspectRatio === ratio.value;
                                            return (
                                                <button
                                                    key={ratio.value}
                                                    onClick={() => updateForm("aspectRatio", ratio.value)}
                                                    className={`p-3 rounded-lg border-2 transition-all ${isSelected
                                                        ? "border-brand-gold bg-brand-gold/5"
                                                        : "border-muted hover:border-brand-gold/50"
                                                        }`}
                                                >
                                                    <div className="text-sm font-medium">{ratio.label}</div>
                                                    <div className="text-xs text-muted-foreground">{ratio.description}</div>
                                                    <div className="text-xs text-muted-foreground mt-1">{ratio.size}</div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
                <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={step === 1}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                {step < totalSteps ? (
                    <Button
                        onClick={handleNext}
                        disabled={!canProceed()}
                        className="bg-brand-navy hover:bg-brand-navy/90"
                    >
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <Button
                        onClick={handleGenerate}
                        disabled={!canProceed() || isGenerating}
                        className="bg-brand-gold hover:bg-brand-gold/90 text-black font-semibold"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate Flyer
                            </>
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}
