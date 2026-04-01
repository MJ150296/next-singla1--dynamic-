import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/utils/dbConnect";
import User from "@/model/User.model";
import { rateLimit } from "@/app/api/_utils/rateLimit";

const superAdminRegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limit check (by IP)
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    const { success } = await rateLimit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Zod validation
    const parsed = superAdminRegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    await dbConnect();

    // Check if a SuperAdmin already exists
    const existingSuperAdmin = await User.findOne({ role: "SuperAdmin" });
    if (existingSuperAdmin) {
      return NextResponse.json(
        { error: "SuperAdmin already exists. Only one SuperAdmin is allowed." },
        { status: 403 }
      );
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Create SuperAdmin user
    const user = await User.create({
      email,
      password,
      role: "SuperAdmin",
    });

    return NextResponse.json(
      {
        message: "SuperAdmin registered successfully",
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("SuperAdmin registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}