"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface RegenerateButtonProps {
    projectId: string;
}

export function RegenerateButton({ projectId }: RegenerateButtonProps) {
    const router = useRouter();
    const [isRegenerating, setIsRegenerating] = useState(false);

    const handleRegenerate = async () => {
        setIsRegenerating(true);

        try {
            const response = await fetch(`/api/projects/${projectId}/regenerate`, {
                method: "POST",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to regenerate");
            }

            toast.success("Flyer regenerated!");
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setIsRegenerating(false);
        }
    };

    return (
        <Button variant="outline" onClick={handleRegenerate} disabled={isRegenerating} className="flex-1">
            {isRegenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Regenerate
        </Button>
    );
}
