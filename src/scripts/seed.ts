require("dotenv/config");
const { db } = require("@vercel/postgres");

async function main() {
	const client = await db.connect();

	try {
		// Drop existing table
		await client.query(`DROP TABLE IF EXISTS billing_info`);

		// Create a single table with all the information
		await client.query(`
      CREATE TABLE IF NOT EXISTS billing_info (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        plan_type VARCHAR(50) NOT NULL CHECK (plan_type IN ('Starter', 'Basic', 'Professional')),
        plan_rate DECIMAL(10, 2) NOT NULL,
        plan_expiry TIMESTAMP,
        card_number VARCHAR(16) NOT NULL,
        cardholder_name VARCHAR(255) NOT NULL,
        expiry VARCHAR(5) NOT NULL,
        cvv VARCHAR(4) NOT NULL,
        country VARCHAR(255) NOT NULL,
        address_line1 VARCHAR(255) NOT NULL,
        address_line2 VARCHAR(255),
        city VARCHAR(255) NOT NULL,
        state VARCHAR(255) NOT NULL,
        zip VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

		console.log("Seed data created successfully.");
	} catch (error) {
		console.error("Error seeding data:", error);
	} finally {
		client.release();
	}
}

main().catch((err) => {
	console.error(
		"An error occurred while attempting to seed the database:",
		err
	);
});
