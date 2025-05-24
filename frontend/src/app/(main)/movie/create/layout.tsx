export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex mt-20 h-full w-full items-center justify-center">
            {children}
        </div>
    );
}
