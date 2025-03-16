import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");

  if (id) {
    const club = await db.club.findFirst({
      where: {
        username: id,
      },
    });

    if (club) {
      const { password, ...other } = club;
      return NextResponse.json(
        {
          club: other,
        },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        {
          error: "Club not found",
        },
        {
          status: 404,
        }
      );
    }
  } else {
    const clubs = (await db.club.findMany()).map((x) => {
      const { password, ...other } = x;
      return other;
    });

    return NextResponse.json(
      {
        clubs: clubs,
      },
      {
        status: 200,
      }
    );
  }
}
