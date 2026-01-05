"use client";

import { useState, useCallback } from "react";
import { X, Upload, Image as ImageIcon, Star, Info } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface ProjectImageUploadProps {
    images: string[];
    onImagesChange: (images: string[]) => void;
    maxImages?: number;
}

export function ProjectImageUpload({
    images,
    onImagesChange,
    maxImages = 3
}: ProjectImageUploadProps) {
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; index: number } | null>(null);
    const [showHeroInfo, setShowHeroInfo] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
        // Handle rejections first
        if (fileRejections.length > 0) {
            fileRejections.forEach(({ file, errors }) => {
                errors.forEach((err: any) => {
                    if (err.code === "file-too-large") {
                        toast.error(`File ${file.name} is too large. Max size is 5MB.`);
                    } else if (err.code === "file-invalid-type") {
                        toast.error(`File ${file.name} has an invalid type. Only JPG, PNG, and WebP are allowed.`);
                    } else {
                        toast.error(`Could not upload ${file.name}: ${err.message}`);
                    }
                });
            });
        }

        if (images.length + acceptedFiles.length > maxImages) {
            toast.error(`Maximum ${maxImages} images allowed. You already have ${images.length} image${images.length === 1 ? '' : 's'}.`);
            return;
        }

        const newImages: string[] = [];

        acceptedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    newImages.push(reader.result);
                    // If we processed all files, update state
                    if (newImages.length === acceptedFiles.length) {
                        onImagesChange([...images, ...newImages]);
                    }
                }
            };
            reader.readAsDataURL(file);
        });
    }, [images, maxImages, onImagesChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/webp': []
        },
        maxSize: 5 * 1024 * 1024, // 5MB Limit per user request
    });

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        onImagesChange(newImages);
        setContextMenu(null);
    };

    const setAsHero = (index: number) => {
        if (index === 0) return; // Already hero
        const newImages = [...images];
        const [heroImage] = newImages.splice(index, 1);
        newImages.unshift(heroImage);
        onImagesChange(newImages);
        toast.success("Hero image updated!");
        setContextMenu(null);
    };

    const handleContextMenu = (e: React.MouseEvent, index: number) => {
        e.preventDefault();
        if (index !== 0) {
            setContextMenu({ x: e.clientX, y: e.clientY, index });
        }
    };

    // Close context menu when clicking anywhere
    const handleClickOutside = () => {
        setContextMenu(null);
    };

    return (
        <div className="space-y-4" onClick={handleClickOutside}>
            <div
                {...getRootProps()}
                className={`
                    border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                    ${isDragActive ? "border-brand-gold bg-brand-gold/5" : "border-muted hover:border-brand-gold/50"}
                    ${images.length >= maxImages ? "opacity-50 cursor-not-allowed" : ""}
                `}
            >
                <input {...getInputProps()} disabled={images.length >= maxImages} />
                <div className="flex flex-col items-center justify-center gap-2">
                    <div className="p-3 bg-muted rounded-full">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="text-lg font-medium">
                        {isDragActive ? "Drop images here" : images.length >= maxImages ? `Maximum ${maxImages} images reached` : "Upload Property Images"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {images.length >= maxImages ? "Remove an image to upload more" : "Drag & drop or click to select"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                        JPG, PNG, WebP up to 5MB each • Max {maxImages} images
                    </div>
                </div>
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((img, index) => (
                        <div
                            key={index}
                            className="relative group aspect-square rounded-lg overflow-hidden border"
                            onContextMenu={(e) => handleContextMenu(e, index)}
                        >
                            <img
                                src={img}
                                alt={`Uploaded image ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay and actions */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                {index !== 0 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setAsHero(index);
                                        }}
                                        className="p-2 bg-brand-gold rounded-full text-black hover:bg-brand-gold/90 transition-colors"
                                        title="Set as Hero Image"
                                    >
                                        <Star className="h-4 w-4" />
                                    </button>
                                )}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeImage(index);
                                    }}
                                    className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                                    title="Remove Image"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            {/* Hero Badge */}
                            {index === 0 && (
                                <div
                                    className="absolute top-2 left-2 bg-brand-gold text-black text-xs font-bold px-2 py-1 rounded flex items-center gap-1 cursor-help"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowHeroInfo(true);
                                        setTimeout(() => setShowHeroInfo(false), 3000);
                                    }}
                                    title="Click for info"
                                >
                                    <Star className="h-3 w-3 fill-current" />
                                    Hero Image
                                    <Info className="h-3 w-3" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Context Menu */}
            {contextMenu && (
                <div
                    className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 min-w-[160px]"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        onClick={() => setAsHero(contextMenu.index)}
                    >
                        <Star className="h-4 w-4 text-brand-gold" />
                        Make Hero Image
                    </button>
                    <button
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600"
                        onClick={() => removeImage(contextMenu.index)}
                    >
                        <X className="h-4 w-4" />
                        Remove Image
                    </button>
                </div>
            )}

            {/* Hero Image Info Popup */}
            {showHeroInfo && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50" onClick={() => setShowHeroInfo(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-brand-gold/10 rounded-full">
                                <Star className="h-6 w-6 text-brand-gold fill-current" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">What is a Hero Image?</h3>
                                <p className="text-sm text-muted-foreground">
                                    The hero image is the main, featured image that appears prominently on your flyer.
                                    It's typically the first and largest image viewers see, making it the most important
                                    visual element of your listing.
                                </p>
                                <button
                                    onClick={() => setShowHeroInfo(false)}
                                    className="mt-4 px-4 py-2 bg-brand-gold text-black rounded-lg hover:bg-brand-gold/90 transition-colors text-sm font-medium"
                                >
                                    Got it!
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
