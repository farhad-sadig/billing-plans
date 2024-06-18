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
        card_number VARCHAR(16),
        cardholder_name VARCHAR(255),
        expiry VARCHAR(5),
        cvv VARCHAR(4),
        country VARCHAR(255),
        address VARCHAR(255),
        city VARCHAR(255),
        state VARCHAR(255),
        zip VARCHAR(10)
      );
    `);

		// Seed Users
		await client.query(`
      INSERT INTO users (name, email) VALUES 
        ('Alice Johnson', 'alice@example.com'),
        ('Bob Smith', 'bob@example.com'),
        ('Charlie Brown', 'charlie@example.com'),
        ('David Williams', 'david@example.com'),
        ('Eve Davis', 'eve@example.com'),
        ('Frank Miller', 'frank@example.com'),
        ('Grace Wilson', 'grace@example.com'),
        ('Heidi Moore', 'heidi@example.com'),
        ('Ivan Taylor', 'ivan@example.com'),
        ('Judy Anderson', 'judy@example.com');
    `);

		// Seed Subscriptions
		await client.query(`
      INSERT INTO subscriptions (user_id, plan_type) VALUES 
        (1, 'Starter'),
        (2, 'Basic'),
        (3, 'Professional'),
        (4, 'Starter'),
        (5, 'Basic'),
        (6, 'Professional'),
        (7, 'Starter'),
        (8, 'Basic'),
        (9, 'Professional'),
        (10, 'Starter');
    `);

		// Seed Billing Information for 5 users
		await client.query(`
      INSERT INTO billing_info (user_id, card_number, cardholder_name, expiry, cvv, country, address, city, state, zip) VALUES 
        (1, '4111111111111111', 'Alice Johnson', '12/25', '123', 'USA', '123 Main St', 'Anytown', 'CA', '12345'),
        (2, '4222222222222222', 'Bob Smith', '11/24', '456', 'USA', '456 Elm St', 'Othertown', 'NY', '67890'),
        (3, '4333333333333333', 'Charlie Brown', '10/23', '789', 'USA', '789 Oak St', 'Sometown', 'TX', '54321'),
        (4, '4444444444444444', 'David Williams', '09/22', '012', 'USA', '321 Pine St', 'Yourtown', 'FL', '98765'),
        (5, '4555555555555555', 'Eve Davis', '08/21', '345', 'USA', '654 Maple St', 'Thistown', 'WA', '67890');
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
