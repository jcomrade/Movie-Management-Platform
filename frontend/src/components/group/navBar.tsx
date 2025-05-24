'use client';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
type User = {
    id: number
    username: string
    email: string
}

export default function NavBar() {
    const { logout, user } = useAuth()
    const [loggedInUser, setLoggedInUser] = useState<User | null>();
    const pathname = usePathname();
    console.log("pathname", pathname)
    const router = useRouter()

    useEffect(() => {
        async function checkuser() {
            const checkUser = await user()
            setLoggedInUser(checkUser)
            if (checkUser && (pathname === "/login" || pathname === "/signup")) router.push('/movie')
        }
        checkuser()
    }, [])

    async function handleLogout() {
        try {
            await logout()
            router.push('/login')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="w-full p-3 text-white grid grid-cols-3">
            <div className="flex justify-start items-center">
                {!(pathname === "/login" || pathname === "/signup" || pathname === "/movie") && <button onClick={()=>router.push("/movie")} className="font-semibold text-xl">Back</button>}
            </div>
            <div className="flex justify-center items-center">
                <img src="/TVstartupLogo.png" alt="app logo" className="h-12" />
            </div>
            <div className="flex flex-row justify-end gap-3 items-center">
                {
                    loggedInUser && <>
                        <p className="font-semibold text-xl">{loggedInUser?.username}</p>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <img src="https://picsum.photos/200" alt="Profile Image" className="rounded-full w-10" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuItem onSelect={handleLogout}>
                                    Log out
                                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                }
            </div>
        </div>
    );
}
