import { NextRequest, NextResponse } from "next/server";
import { PLANS } from "@/constants/plans";
import { db } from "@vercel/postgres";

export async function GET(request: NextRequest) {
	const email = request.nextUrl.searchParams.get("email");

	if (!email) {
		return NextResponse.json({ error: "Email is required" }, { status: 400 });
	}

	try {
		const client = await db.connect();

		const result = await client.query(
			`SELECT b.email, b.plan_name, b.next_billing_date, b.change_pending, b.pending_plan_name
       FROM billing_info b
       WHERE b.email = $1`,
			[email]
		);

		client.release();

		if (result.rows.length > 0) {
			const plan = PLANS[result.rows[0].plan_name];
			const subscription = {
				email: result.rows[0].email,
				plan: plan,
				nextBillingDate: result.rows[0].next_billing_date,
				changePending: result.rows[0].change_pending,
				pendingPlanName: result.rows[0].pending_plan_name
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
		const { plan, nextBillingDate, email, changePending, pendingPlanName } =
			await request.json();

		const client = await db.connect();

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
          SET plan_name = $1, next_billing_date = $2, change_pending = $3, pending_plan_name = $4
          WHERE email = $5
          `,
				[plan.name, nextBillingDate, changePending, pendingPlanName, email]
			);
			console.log("Billing info updated successfully");
		} else {
			console.log("Inserting new billing info...");
			await client.query(
				`
          INSERT INTO billing_info (email, plan_name, next_billing_date, change_pending, pending_plan_name)
          VALUES ($1, $2, $3, $4, $5)
          `,
				[email, plan.name, nextBillingDate, changePending, pendingPlanName]
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
