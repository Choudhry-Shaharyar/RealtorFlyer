"use client";

import { useState, useCallback } from "react";
import { X, Upload, User, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import Image from "next/image";

interface PortraitUploadProps {
    value?: string;
    onChange: (value: string | undefined) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function PortraitUpload({ value, onChange }: PortraitUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const uploadFile = useCallback(async (file: File) => {
        setIsUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append("file", file);

            // Use XMLHttpRequest for progress tracking
            const xhr = new XMLHttpRequest();

            const uploadPromise = new Promise<string>((resolve, reject) => {
                xhr.upload.addEventListener("progress", (event) => {
                    if (event.lengthComputable) {
                        const progress = Math.round((event.loaded / event.total) * 100);
                        setUploadProgress(progress);
                    }
                });

                xhr.addEventListener("load", () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            if (response.url) {
                                resolve(response.url);
                            } else {
                                reject(new Error(response.error || "Upload failed"));
                            }
                        } catch {
                            reject(new Error("Invalid server response"));
                        }
                    } else {
                        try {
                            const errorResponse = JSON.parse(xhr.responseText);
                            reject(new Error(errorResponse.error || "Upload failed"));
                        } catch {
                            reject(new Error("Upload failed"));
                        }
                    }
                });

                xhr.addEventListener("error", () => {
                    reject(new Error("Network error during upload"));
                });

                xhr.open("POST", "/api/upload/profile-photo");
                xhr.send(formData);
            });

            const url = await uploadPromise;
            onChange(url);
            toast.success("Photo uploaded successfully!");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error(error instanceof Error ? error.message : "Failed to upload photo");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    }, [onChange]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];

        // Client-side size validation
        if (file.size > MAX_FILE_SIZE) {
            toast.error("File is too large. Maximum size is 5MB.");
            return;
        }

        uploadFile(file);
    }, [uploadFile]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/webp': []
        },
        maxFiles: 1,
        maxSize: MAX_FILE_SIZE,
        disabled: isUploading,
        onDropRejected: (fileRejections) => {
            fileRejections.forEach(({ errors }) => {
                if (errors[0]?.code === "file-too-large") {
                    toast.error("File is too large. Maximum size is 5MB.");
                } else if (errors[0]?.code === "file-invalid-type") {
                    toast.error("Invalid file type. Use JPG, PNG, or WebP.");
                }
            });
        }
    });

    const removePortrait = () => {
        onChange(undefined);
    };

    // Show current image with remove option
    if (value && !isUploading) {
        return (
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-muted group mx-auto md:mx-0">
                <Image
                    src={value}
                    alt="Agent Portrait"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                        onClick={removePortrait}
                        className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        );
    }

    // Show upload progress
    if (isUploading) {
        return (
            <div className="w-40 h-40 rounded-full border-2 border-brand-gold flex flex-col items-center justify-center mx-auto md:mx-0 bg-brand-gold/5">
                <Loader2 className="h-8 w-8 text-brand-gold animate-spin mb-2" />
                <span className="text-sm font-medium text-brand-gold">{uploadProgress}%</span>
                <span className="text-xs text-muted-foreground">Uploading...</span>
            </div>
        );
    }

    // Show dropzone
    return (
        <div
            {...getRootProps()}
            className={`
                w-40 h-40 rounded-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors mx-auto md:mx-0
                ${isDragActive ? "border-brand-gold bg-brand-gold/5" : "border-muted hover:border-brand-gold/50"}
            `}
        >
            <input {...getInputProps()} />
            <User className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-xs text-muted-foreground text-center px-4">
                Upload Photo
            </span>
        </div>
    );
}

