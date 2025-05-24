import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  req: NextRequest,
  { params }: { params: { movieID: string } }
) {
  const { movieID } = params;
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await axios.get(
      `${process.env.API_BASE_URL}/movie/secure-video/${movieID}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { movieID: string } }
) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const formData = await req.formData();
  const { movieID } = params;

  if (
    !formData.get("original_file") ||
    !formData.get("title") ||
    !formData.get("description")
  ) {
    return NextResponse.json({ error: "Missing Fields" }, { status: 400 });
  }

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formRequestData = new FormData();
  formRequestData.append("original_file", formData.get("original_file") as Blob);
  formRequestData.append("video_file", formData.get("original_file") as Blob);
  formRequestData.append("title", formData.get("title") as string);
  formRequestData.append("date_added", "2002-02-02");
  formRequestData.append("description", formData.get("description") as string);

  try {
    const res = await axios.put(
      `${process.env.API_BASE_URL}/movie/${movieID}/`,
      formRequestData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json({ movieList: res.data });
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { movieID: string } }
) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const { movieID } = params;

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await axios.delete(`${process.env.API_BASE_URL}/movie/${movieID}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json({ message: "Movie Deleted" }, { status: 200 });
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
}
