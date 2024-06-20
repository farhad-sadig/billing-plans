import { NextRequest, NextResponse } from "next/server";
import { db } from "@vercel/postgres";

export async function POST(request: NextRequest) {
	const {
		userId,
		cardNumber,
		cardholderName,
		expiry,
		cvv,
		country,
		address,
		city,
		state,
		zip
	} = await request.json();

	if (
		!userId ||
		!cardNumber ||
		!cardholderName ||
		!expiry ||
		!cvv ||
		!country ||
		!address ||
		!city ||
		!state ||
		!zip
	) {
		return NextResponse.json(
			{ error: "All fields are required" },
			{ status: 400 }
		);
	}

	try {
		const client = await db.connect();

		await client.query(
			`
      INSERT INTO billing_info (user_id, card_number, cardholder_name, expiry, cvv, country, address, city, state, zip)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `,
			[
				userId,
				cardNumber,
				cardholderName,
				expiry,
				cvv,
				country,
				address,
				city,
				state,
				zip
			]
		);

		await client.query(
			`
      INSERT INTO subscriptions (user_id, plan_type)
      VALUES ($1, 'Basic')
    `,
			[userId]
		);

		client.release();

		return NextResponse.json({
			message: "Billing info and subscription saved successfully"
		});
	} catch (error) {
		console.error("Error saving billing info:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
