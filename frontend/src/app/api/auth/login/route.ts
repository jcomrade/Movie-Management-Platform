import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await axios.post(`${process.env.API_BASE_URL}/api/token/`, body, {
    headers: { 'Content-Type': 'application/json' },
  });
  
  const tokens = res.data;

  if (!tokens?.access || !tokens?.refresh) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const response = NextResponse.json({ access: tokens.access });

  // Set the refresh token in an HttpOnly cookie
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
    maxAge: 60 * 60, // 7 days
  });


  return response;
}