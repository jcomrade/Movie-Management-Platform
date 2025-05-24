import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
export async function GET() {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;
  const accessToken = cookieStore.get("access_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "Missing refresh token" }, { status: 401 });
  }

  const res = await axios.post(`${process.env.API_BASE_URL}/api/logout/`, 
    { refresh: refreshToken },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );
  
  if (res.status !== 205) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const response = NextResponse.json({ message: "User Logged Out" });

  response.cookies.set({
    name: 'access_token',
    value: "",
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 1,
  });

  response.cookies.set({
    name: 'refresh_token',
    value: "",
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 1,
  });

  return response;
}