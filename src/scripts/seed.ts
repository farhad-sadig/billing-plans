require("dotenv/config");
const { db } = require("@vercel/postgres");

async function main() {
	const client = await db.connect();

	try {
		// Drop existing tables
		await client.query(`DROP TABLE IF EXISTS billing_info`);
		await client.query(`DROP TABLE IF EXISTS subscriptions`);
		await client.query(`DROP TABLE IF EXISTS users`);

		// Create users table
		await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL
      );
    `);

		// Create subscriptions table
		await client.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        plan_type VARCHAR(50) NOT NULL CHECK (plan_type IN ('Starter', 'Basic', 'Professional')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

		// Create billing_info table
		await client.query(`
      CREATE TABLE IF NOT EXISTS billing_info (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        card_number VARCHAR(16) NOT NULL,
        cardholder_name VARCHAR(255) NOT NULL,
        expiry VARCHAR(5) NOT NULL,
        cvv VARCHAR(4) NOT NULL,
        country VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        state VARCHAR(255) NOT NULL,
        zip VARCHAR(10) NOT NULL
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
