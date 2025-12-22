"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DownloadButtonProps {
    imageUrl?: string | null;
    imageData?: string | null;
    mimeType: string;
    filename: string;
}

export function DownloadButton({ imageUrl, imageData, mimeType, filename }: DownloadButtonProps) {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        const extension = mimeType.split("/")[1] || "png";
        const fullFilename = `${filename}.${extension}`;

        if (imageUrl) {
            // Download from URL
            setIsDownloading(true);
            try {
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = url;
                link.download = fullFilename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                URL.revokeObjectURL(url);
            } catch (error) {
                console.error("Download error:", error);
                toast.error("Failed to download image");
            } finally {
                setIsDownloading(false);
            }
        } else if (imageData) {
            // Download from Base64
            const link = document.createElement("a");
            link.href = `data:${mimeType};base64,${imageData}`;
            link.download = fullFilename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            toast.error("No image available to download");
        }
    };

    return (
        <Button onClick={handleDownload} className="flex-1" disabled={isDownloading}>
            {isDownloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Download className="mr-2 h-4 w-4" />
            )}
            {isDownloading ? "Downloading..." : "Download"}
        </Button>
    );
}

