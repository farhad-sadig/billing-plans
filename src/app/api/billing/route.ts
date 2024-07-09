import { NextRequest, NextResponse } from "next/server";
import { db } from "@vercel/postgres";
import { PLANS } from "@/constants/plans";

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

		if (!email) {
			return NextResponse.json({ error: "Email is required" }, { status: 400 });
		}

		const missingFields = [];

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

			const upsertQuery = `
        INSERT INTO billing_info (
          email, plan_name, next_billing_date, card_number, cardholder_name, 
          expiry, cvv, country, address_line1, address_line2, city, state, zip, 
          change_pending, pending_plan_name
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, COALESCE(NULLIF($10, ''), NULL), 
          $11, $12, $13, $14, $15
        )
        ON CONFLICT (email) DO UPDATE SET 
          plan_name = EXCLUDED.plan_name,
          next_billing_date = EXCLUDED.next_billing_date,
          card_number = EXCLUDED.card_number,
          cardholder_name = EXCLUDED.cardholder_name,
          expiry = EXCLUDED.expiry,
          cvv = EXCLUDED.cvv,
          country = EXCLUDED.country,
          address_line1 = EXCLUDED.address_line1,
          address_line2 = EXCLUDED.address_line2,
          city = EXCLUDED.city,
          state = EXCLUDED.state,
          zip = EXCLUDED.zip,
          change_pending = EXCLUDED.change_pending,
          pending_plan_name = EXCLUDED.pending_plan_name;
      `;

			await client.query(upsertQuery, [
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
			]);

			console.log("Billing info upserted successfully");

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
