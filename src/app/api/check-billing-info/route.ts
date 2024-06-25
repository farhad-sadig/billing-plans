import { NextRequest, NextResponse } from "next/server";
import { db } from "@vercel/postgres";

export async function GET(request: NextRequest) {
	const email = request.nextUrl.searchParams.get("email");

	console.log("Received request with email:", email);

	if (!email) {
		console.log("Email is required but not provided.");
		return NextResponse.json({ error: "Email is required" }, { status: 400 });
	}

	try {
		const client = await db.connect();
		console.log("Connected to database");

		const result = await client.query(
			"SELECT * FROM billing_info WHERE email = $1",
			[email]
		);

		console.log("Database query executed. Result:", result.rows);

		client.release();
		console.log("Database connection released");

		if (result.rows.length > 0) {
			console.log("Billing info found for email:", email);
			return NextResponse.json({ exists: true, billingInfo: result.rows[0] });
		} else {
			console.log("No billing info found for email:", email);
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
