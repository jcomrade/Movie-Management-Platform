export const runtime = 'nodejs';

import axios from 'axios';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

export async function GET() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const res = await axios.get(`${process.env.API_BASE_URL}/movie`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const movies = res.data;

    return NextResponse.json({ movieList: movies });
  } catch (error: any) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const formData = await req.formData();

  const original_file = formData.get('original_file');
  const title = formData.get('title');
  const description = formData.get('description');

  if (!original_file || !title || !description) {
    return NextResponse.json({ error: 'Missing Fields' }, { status: 400 });
  }

  if (!accessToken)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formRequestData = new FormData();
  formRequestData.append('original_file', original_file as Blob);
  formRequestData.append('video_file', original_file as Blob);
  formRequestData.append('title', title as string);
  formRequestData.append('date_added', "2002-02-02");
  formRequestData.append('description', description as string);

  try {
    const res = await axios.post(`${process.env.API_BASE_URL}/movie/`, formRequestData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const movies = res.data;

    return NextResponse.json({ movieList: movies });
  } catch (error: any) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }
}
