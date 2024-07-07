import { NextRequest, NextResponse } from "next/server";
import { db } from "@vercel/postgres";
import { PLANS } from "@/constants/plans";

export async function GET(request: NextRequest) {
	const email = request.nextUrl.searchParams.get("email");

	if (!email) {
		return NextResponse.json({ error: "Email is required" }, { status: 400 });
	}

	try {
		const client = await db.connect();

		const result = await client.query(
			`SELECT b.email, b.cardholder_name, b.plan_name, b.next_billing_date, b.change_pending, b.pending_plan_name
			 FROM billing_info b
			 WHERE b.email = $1`,
			[email]
		);

		client.release();

		if (result.rows.length > 0) {
			const plan = PLANS[result.rows[0].plan_name];
			const billingInfo = {
				email: result.rows[0].email,
				cardholderName: result.rows[0].cardholder_name,
				plan: plan,
				nextBillingDate: result.rows[0].next_billing_date,
				changePending: result.rows[0].change_pending,
				pendingPlanName: result.rows[0].pending_plan_name
			};
			return NextResponse.json({ exists: true, billingInfo: billingInfo });
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

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		console.log("Request body:", body);

		const {
			email,
			planType,
			cardNumber,
			cardholderName,
			expiry,
			cvv,
			address: { country, state, addressLine1, addressLine2 = "", city, zip }
		} = body;

		const missingFields = [];

		if (!email) missingFields.push("email");
		if (!planType) missingFields.push("planType");
		if (!cardNumber) missingFields.push("cardNumber");
		if (!cardholderName) missingFields.push("cardholderName");
		if (!expiry) missingFields.push("expiry");
		if (!cvv) missingFields.push("cvv");
		if (!country) missingFields.push("country");
		if (!state) missingFields.push("state");
		if (!addressLine1) missingFields.push("addressLine1");
		if (!city) missingFields.push("city");
		if (!zip) missingFields.push("zip");

		if (missingFields.length > 0) {
			console.log("Missing required fields:", missingFields.join(", "));
			return NextResponse.json(
				{ error: `Missing required fields: ${missingFields.join(", ")}` },
				{ status: 400 }
			);
		}

		const client = await db.connect();

		try {
			await client.query("BEGIN");

			const nextBillingDate =
				planType !== "Starter"
					? new Date(
							new Date().setMonth(new Date().getMonth() + 1)
					  ).toISOString()
					: null;

			const existingBillingInfo = await client.query(
				"SELECT id FROM billing_info WHERE email = $1 FOR UPDATE",
				[email]
			);

			if (existingBillingInfo.rows.length > 0) {
				console.log("Updating existing billing info...");
				await client.query(
					`
            UPDATE billing_info
            SET plan_name = $1, next_billing_date = $2, card_number = $3, cardholder_name = $4, expiry = $5, cvv = $6, country = $7, address_line1 = $8, address_line2 = $9, city = $10, state = $11, zip = $12, change_pending = $13, pending_plan_name = $14
            WHERE email = $15
            `,
					[
						planType,
						nextBillingDate,
						cardNumber,
						cardholderName,
						expiry,
						cvv,
						country,
						addressLine1,
						addressLine2,
						city,
						state,
						zip,
						false,
						null,
						email
					]
				);
				console.log("Billing info updated successfully");
			} else {
				console.log("Inserting new billing info...");
				await client.query(
					`
            INSERT INTO billing_info (email, plan_name, next_billing_date, card_number, cardholder_name, expiry, cvv, country, address_line1, address_line2, city, state, zip, change_pending, pending_plan_name)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE(NULLIF($9, ''), NULL), $10, $11, $12, $13, $14, $15)
            `,
					[
						email,
						planType,
						nextBillingDate,
						cardNumber,
						cardholderName,
						expiry,
						cvv,
						country,
						addressLine1,
						addressLine2,
						city,
						state,
						zip,
						false,
						null
					]
				);
				console.log("Billing info saved successfully");
			}

			await client.query("COMMIT");

			return NextResponse.json({
				message: "Billing info saved successfully"
			});
		} catch (error) {
			await client.query("ROLLBACK");
			throw error;
		} finally {
			client.release();
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error saving billing info:", error.message);
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
