import { NextRequest, NextResponse } from "next/server";
import { db } from "@vercel/postgres";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		console.log("Request body:", body);

		const {
			name,
			email,
			planType,
			cardNumber,
			cardholderName,
			expiryDate,
			cvv,
			address: { country, state, addressLine1, addressLine2 = "", city, zip }
		} = body;

		if (
			!name ||
			!email ||
			!planType ||
			!cardNumber ||
			!cardholderName ||
			!expiryDate ||
			!cvv ||
			!country ||
			!state ||
			!addressLine1 ||
			!city ||
			!zip
		) {
			console.log("Missing required fields");
			return NextResponse.json(
				{ error: "All fields except addressLine2 are required" },
				{ status: 400 }
			);
		}

		const client = await db.connect();

		console.log("Inserting billing info...");
		await client.query(
			`
      INSERT INTO billing_info (name, email, plan_type, card_number, cardholder_name, expiry, cvv, country, address_line1, address_line2, city, state, zip)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, COALESCE(NULLIF($10, ''), NULL), $11, $12, $13)
    `,
			[
				name,
				email,
				planType,
				cardNumber,
				cardholderName,
				expiryDate,
				cvv,
				country,
				addressLine1,
				addressLine2,
				city,
				state,
				zip
			]
		);

		client.release();
		console.log("Billing info saved successfully");

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
