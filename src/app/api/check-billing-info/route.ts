import { NextRequest, NextResponse } from "next/server";
import { db } from "@vercel/postgres";

export async function GET(request: NextRequest) {
	const userId = request.nextUrl.searchParams.get("userId");

	if (!userId) {
		return NextResponse.json({ error: "User ID is required" }, { status: 400 });
	}

	try {
		const client = await db.connect();
		const result = await client.query(
			"SELECT * FROM billing_info WHERE user_id = $1",
			[userId]
		);

		client.release();

		if (result.rows.length > 0) {
			return NextResponse.json({ exists: true });
		} else {
			return NextResponse.json({ exists: false });
		}
	} catch (error) {
		console.error("Error checking billing info:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
