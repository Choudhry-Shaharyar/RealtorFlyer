"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { signOutAction } from "@/app/actions";
import { useTransition } from "react";

export function SignOutButton() {
    const [isPending, startTransition] = useTransition();

    return (
        <DropdownMenuItem
            className={`cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isPending}
            onSelect={(event) => {
                event.preventDefault();
                startTransition(async () => {
                    await signOutAction();
                });
            }}
        >
            <LogOut className="mr-2 h-4 w-4" />
            {isPending ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
    );
}
