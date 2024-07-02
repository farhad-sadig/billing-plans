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
			 LEFT JOIN plans p ON b.plan_name = p.name
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

		// Start transaction
		await client.query("BEGIN");

		// Check if plan exists
		const plan = await client.query(
			"SELECT name FROM plans WHERE name = $1 FOR UPDATE",
			[planType]
		);

		if (plan.rows.length === 0) {
			await client.query("ROLLBACK");
			return NextResponse.json({ error: "Invalid plan type" }, { status: 400 });
		}

		const nextBillingDate =
			planType !== "Starter"
				? new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
				: null;

		// Check if billing info exists and lock the row
		const existingBillingInfo = await client.query(
			"SELECT id FROM billing_info WHERE email = $1 FOR UPDATE",
			[email]
		);

		if (existingBillingInfo.rows.length > 0) {
			console.log("Updating existing billing info...");
			await client.query(
				`
                    UPDATE billing_info
                    SET plan_name = $1, next_billing_date = $2, card_number = $3, cardholder_name = $4, expiry = $5, cvv = $6, country = $7, address_line1 = $8, address_line2 = $9, city = $10, state = $11, zip = $12
                    WHERE email = $13
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
					email
				]
			);
			console.log("Billing info updated successfully");
		} else {
			console.log("Inserting new billing info...");
			await client.query(
				`
                    INSERT INTO billing_info (email, plan_name, next_billing_date, card_number, cardholder_name, expiry, cvv, country, address_line1, address_line2, city, state, zip)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE(NULLIF($9, ''), NULL), $10, $11, $12, $13)
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
					zip
				]
			);
			console.log("Billing info saved successfully");
		}

		// Commit transaction
		await client.query("COMMIT");

		client.release();

		return NextResponse.json({
			message: "Billing info saved successfully"
		});
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
