import { NextRequest, NextResponse } from "next/server";
import { db } from "@vercel/postgres";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		console.log("Request body:", body);

		const { email, planType, planRate, planExpiry } = body;

		if (!email || !planType || !planRate || !planExpiry) {
			console.log("Missing required fields");
			return NextResponse.json(
				{ error: "All fields are required" },
				{ status: 400 }
			);
		}

		const client = await db.connect();

		console.log("Updating plan...");
		const result = await client.query(
			`
      UPDATE billing_info
      SET plan_type = $1, plan_rate = $2, plan_expiry = $3
      WHERE email = $4
      RETURNING *
    `,
			[planType, planRate, planExpiry, email]
		);

		client.release();
		console.log("Plan updated successfully");

		return NextResponse.json(result.rows[0]);
	} catch (error) {
		console.error("Error updating plan:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
