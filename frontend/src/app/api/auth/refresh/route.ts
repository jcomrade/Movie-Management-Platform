import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from 'next/server';

export async function POST() {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
        return NextResponse.json({ error: "Missing refresh token" }, { status: 401 });
    }

    try {
        const res = await axios.post(`${process.env.API_BASE_URL}/api/token/refresh/`, 
            { refresh: refreshToken },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const token = res.data;

        const response = NextResponse.json({ access: token.access });

        response.cookies.set({
            name: 'access_token',
            value: token.access,
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60,
        });

        return response;

    } catch (error: any) {
        console.error("Token refresh failed:", error?.response?.data || error.message);
        return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
    }
}
