import { NextRequest, NextResponse } from "next/server";
import { db } from "@vercel/postgres";

export async function GET(request: NextRequest) {
	const planName = request.nextUrl.pathname.split("/").pop();

	if (!planName) {
		return NextResponse.json(
			{ error: "Plan name is required" },
			{ status: 400 }
		);
	}

	try {
		const client = await db.connect();

		const result = await client.query(
			`SELECT name, monthly_rate
       FROM plans
       WHERE LOWER(name) = LOWER($1)`,
			[planName]
		);

		client.release();

		if (result.rows.length > 0) {
			return NextResponse.json(result.rows[0]);
		} else {
			return NextResponse.json({ error: "Plan not found" }, { status: 404 });
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error fetching plan data:", error.message);
			console.error("Stack trace:", error.stack);
		} else {
			console.error("Unexpected error:", error);
		}
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
