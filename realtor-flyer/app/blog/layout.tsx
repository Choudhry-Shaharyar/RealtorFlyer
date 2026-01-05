import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col font-sans">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
