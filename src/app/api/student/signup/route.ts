import db from "@/lib/db";
import { Student } from "@prisma/client";
import { genSaltSync, hashSync } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { data } = (await req.json()) as { data: Student };

    if (!data.password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const hashedPassword = hashSync(data.password, genSaltSync(10));

    const student = await db.student.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: `Created student with PRN ${student.prn} successfully!` },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
