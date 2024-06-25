import { NextRequest, NextResponse } from "next/server";
import { db } from "@vercel/postgres";

export async function POST(request: NextRequest) {
	const { email, planType, planRate, planExpiry } = await request.json();

	if (!email || !planType || planRate === undefined || !planExpiry) {
		return NextResponse.json(
			{ error: "Email, plan type, plan rate, and plan expiry are required" },
			{ status: 400 }
		);
	}

	try {
		const client = await db.connect();
		await client.query(
			"UPDATE billing_info SET plan_type = $1, plan_rate = $2, plan_expiry = $3 WHERE email = $4",
			[planType, planRate, planExpiry, email]
		);

		client.release();

		return NextResponse.json({ message: "Plan updated successfully" });
	} catch (error) {
		console.error("Error updating plan:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
