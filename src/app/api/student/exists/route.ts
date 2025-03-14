import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const prn = new URL(req.url).searchParams.get("prn");

  if (!prn) {
    return NextResponse.json({ error: "PRN not specified" }, { status: 400 });
  }

  const student = await db.student.findFirst({
    where: {
      prn,
    },
  });

  return NextResponse.json(
    {
      exists: !!student,
    },
    {
      status: 200,
    }
  );
}
