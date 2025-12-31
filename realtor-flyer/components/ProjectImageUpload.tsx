"use client";

import { useState, useCallback } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import Image from "next/image";

interface ProjectImageUploadProps {
    images: string[];
    onImagesChange: (images: string[]) => void;
    maxImages?: number;
}

export function ProjectImageUpload({
    images,
    onImagesChange,
    maxImages = 5
}: ProjectImageUploadProps) {
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
            toast.error(`You can only upload a maximum of ${maxImages} images.`);
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
    };

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`
                    border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                    ${isDragActive ? "border-brand-gold bg-brand-gold/5" : "border-muted hover:border-brand-gold/50"}
                `}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-2">
                    <div className="p-3 bg-muted rounded-full">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="text-lg font-medium">
                        {isDragActive ? "Drop images here" : "Upload Property Images"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Drag & drop or click to select
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                        JPG, PNG, WebP up to 5MB each
                    </div>
                </div>
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((img, index) => (
                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border">
                            <Image
                                src={img}
                                alt={`Uploaded image ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                            {/* Overlay and actions */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeImage(index);
                                    }}
                                    className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            {/* Badges */}
                            {index === 0 && (
                                <div className="absolute top-2 left-2 bg-brand-gold text-black text-xs font-bold px-2 py-1 rounded">
                                    Hero Image
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
