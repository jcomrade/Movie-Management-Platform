import axios from 'axios';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    // Sign up user
    const signup = await axios.post(`${process.env.API_BASE_URL}/register`, body, {
      headers: { 'Content-Type': 'application/json' },
    });

    const user = signup.data;

    if (!user?.username || !user?.email) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Log in user
    const login = await axios.post(`${process.env.API_BASE_URL}/api/token/`, body, {
      headers: { 'Content-Type': 'application/json' },
    });

    const tokens = login.data;

    if (!tokens?.access || !tokens?.refresh) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const response = NextResponse.json({ access: tokens.access });

    response.cookies.set({
      name: 'refresh_token',
      value: tokens.refresh,
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    response.cookies.set({
      name: 'access_token',
      value: tokens.access,
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60, // 1 hour
    });

    return response;

  } catch (error: any) {
    console.error("Signup/Login failed:", error?.response?.data || error.message);
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
}
