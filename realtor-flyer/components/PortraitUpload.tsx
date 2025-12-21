"use client";

import { useState, useCallback } from "react";
import { X, Upload, User } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import Image from "next/image";

interface PortraitUploadProps {
    value?: string;
    onChange: (value: string | undefined) => void;
}

export function PortraitUpload({ value, onChange }: PortraitUploadProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === 'string') {
                onChange(reader.result);
            }
        };
        reader.readAsDataURL(file);
    }, [onChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/webp': []
        },
        maxFiles: 1,
        maxSize: 5 * 1024 * 1024, // 5MB
    });

    const removePortrait = () => {
        onChange(undefined);
    };

    if (value) {
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
