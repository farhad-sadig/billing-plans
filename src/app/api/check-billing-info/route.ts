import { NextRequest, NextResponse } from "next/server";
import { db } from "@vercel/postgres";

export async function GET(request: NextRequest) {
	const email = request.nextUrl.searchParams.get("email");

	if (!email) {
		return NextResponse.json({ error: "Email is required" }, { status: 400 });
	}

	try {
		const client = await db.connect();

		const result = await client.query(
			`SELECT b.email, b.cardholder_name, p.name AS plan_name, p.monthly_rate, b.next_billing_date
			 FROM billing_info b
			 LEFT JOIN plans p ON b.plan_id = p.id
			 WHERE b.email = $1`,
			[email]
		);

		client.release();

		if (result.rows.length > 0) {
			return NextResponse.json({ exists: true, billingInfo: result.rows[0] });
		} else {
			return NextResponse.json({ exists: false });
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error checking billing info:", error.message);
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
