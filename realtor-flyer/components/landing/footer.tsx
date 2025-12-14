import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Twitter, Instagram, Linkedin } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-muted/30 py-12">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-brand-navy">RealtorFlyer</h3>
                        <p className="text-sm text-muted-foreground">
                            Professional real estate social media posts in seconds.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#features">Features</Link></li>
                            <li><Link href="#pricing">Pricing</Link></li>
                            <li><Link href="#examples">Examples</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#">About</Link></li>
                            <li><Link href="#">Blog</Link></li>
                            <li><Link href="#">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#">Privacy Policy</Link></li>
                            <li><Link href="#">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <Separator className="my-8" />
                <div className="text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} RealtorFlyer. Made with ❤️ for real estate professionals.
                </div>
            </div>
        </footer>
    )
}
