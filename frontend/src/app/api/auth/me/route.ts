import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const res = await axios.get(`${process.env.API_BASE_URL}/api/me/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const user = res.data;
    return NextResponse.json(user);
    
  } catch (error: any) {
    console.error("Token validation error:", error?.response?.data || error.message);
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}
