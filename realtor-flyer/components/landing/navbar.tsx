import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function Navbar() {
    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-brand-navy">
                    <span>RealtorFlyer</span>
                </Link>
                <div className="hidden md:flex gap-6 items-center">
                    <Link href="#features" className="text-sm font-medium hover:text-primary">
                        Features
                    </Link>
                    <Link href="#pricing" className="text-sm font-medium hover:text-primary">
                        Pricing
                    </Link>
                    <Link href="#examples" className="text-sm font-medium hover:text-primary">
                        Examples
                    </Link>
                    <Link href="/login">
                        <Button variant="ghost">Log in</Button>
                    </Link>
                    <Link href="/login">
                        <Button className="bg-brand-gold hover:bg-brand-gold-light text-brand-navy font-semibold">Start Free</Button>
                    </Link>
                </div>
                <Sheet>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <div className="flex flex-col gap-4 mt-8">
                            <Link href="#features" className="text-lg font-medium">Features</Link>
                            <Link href="#pricing" className="text-lg font-medium">Pricing</Link>
                            <Link href="#examples" className="text-lg font-medium">Examples</Link>
                            <Link href="/login" className="text-lg font-medium">Log in</Link>
                            <Link href="/login">
                                <Button className="w-full bg-brand-gold hover:bg-brand-gold-light text-brand-navy font-semibold">Start Free</Button>
                            </Link>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    )
}
