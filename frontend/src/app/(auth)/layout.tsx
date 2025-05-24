import NavBar from "@/components/group/navBar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen flex flex-col justify-start">
            <NavBar />
            {children}
        </div>
    );
}
