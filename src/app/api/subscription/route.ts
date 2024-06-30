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
			`SELECT b.email, b.plan_name, b.next_billing_date, p.monthly_rate
       FROM billing_info b
       LEFT JOIN plans p ON b.plan_name = p.name
       WHERE b.email = $1`,
			[email]
		);

		client.release();

		if (result.rows.length > 0) {
			const subscription = {
				email: result.rows[0].email,
				plan: {
					name: result.rows[0].plan_name,
					monthlyRate: parseFloat(result.rows[0].monthly_rate)
				},
				nextBillingDate: result.rows[0].next_billing_date
			};
			console.log("Fetched subscription data:", subscription);
			return NextResponse.json(subscription);
		} else {
			return NextResponse.json(
				{ error: "Subscription not found" },
				{ status: 404 }
			);
		}
	} catch (error) {
		console.error("Error fetching subscription data:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const { plan, nextBillingDate, email } = await request.json();

		const client = await db.connect();

		// Start transaction
		await client.query("BEGIN");

		const existingBillingInfo = await client.query(
			"SELECT id FROM billing_info WHERE email = $1 FOR UPDATE",
			[email]
		);

		if (existingBillingInfo.rows.length > 0) {
			console.log("Updating existing billing info...");
			await client.query(
				`
          UPDATE billing_info
          SET plan_name = $1, next_billing_date = $2
          WHERE email = $3
          `,
				[plan.name, nextBillingDate, email]
			);
			console.log("Billing info updated successfully");
		} else {
			console.log("Inserting new billing info...");
			await client.query(
				`
          INSERT INTO billing_info (email, plan_name, next_billing_date)
          VALUES ($1, $2, $3)
          `,
				[email, plan.name, nextBillingDate]
			);
			console.log("Billing info saved successfully");
		}

		await client.query("COMMIT");

		client.release();

		return NextResponse.json({
			message: "Billing info saved successfully"
		});
	} catch (error) {
		console.error("Error saving billing info:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
