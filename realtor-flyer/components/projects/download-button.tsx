"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
    imageData: string;
    mimeType: string;
    filename: string;
}

export function DownloadButton({ imageData, mimeType, filename }: DownloadButtonProps) {
    const handleDownload = () => {
        const extension = mimeType.split("/")[1] || "png";
        const link = document.createElement("a");
        link.href = `data:${mimeType};base64,${imageData}`;
        link.download = `${filename}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Button onClick={handleDownload} className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Download
        </Button>
    );
}
