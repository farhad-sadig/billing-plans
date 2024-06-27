require("dotenv/config");
const { db } = require("@vercel/postgres");

async function main() {
	const client = await db.connect();

	try {
		await client.query(`DROP TABLE IF EXISTS billing_info`);
		await client.query(`DROP TABLE IF EXISTS plans`);

		await client.query(`
      CREATE TABLE IF NOT EXISTS plans (
        name VARCHAR(50) PRIMARY KEY CHECK (name IN ('Starter', 'Basic', 'Professional')),
        monthly_rate DECIMAL(10, 2) NOT NULL
      );
    `);

		await client.query(`
      CREATE TABLE IF NOT EXISTS billing_info (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        plan_name VARCHAR(50) NOT NULL,
        next_billing_date TIMESTAMP DEFAULT NULL,
        plan_expiry TIMESTAMP DEFAULT NULL,
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (plan_name) REFERENCES plans(name)
      );
    `);

		// Insert sample plans
		await client.query(`
      INSERT INTO plans (name, monthly_rate) VALUES 
      ('Starter', 0.00),
      ('Basic', 6.00),
      ('Professional', 12.00);
    `);

		// Insert sample billing info
		await client.query(`
      INSERT INTO billing_info (email, plan_name, next_billing_date, card_number, cardholder_name, expiry, cvv, country, address_line1, address_line2, city, state, zip)
      VALUES
      ('john@example.com', 'Basic', '${new Date(
				new Date().setMonth(new Date().getMonth() + 1)
			).toISOString()}', '1234567890123456', 'John Doe', '12/23', '123', 'US', '123 Main St', '', 'Anytown', 'Anystate', '12345'),
      ('jane@example.com', 'Professional', '${new Date(
				new Date().setMonth(new Date().getMonth() + 1)
			).toISOString()}', '6543210987654321', 'Jane Smith', '01/24', '321', 'US', '456 Elm St', '', 'Othertown', 'Otherstate', '67890');
    `);

		console.log("Tables created and sample data inserted successfully.");
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error creating tables or inserting data:", error.message);
			console.error("Stack trace:", error.stack);
		} else {
			console.error("Unexpected error:", error);
		}
	} finally {
		client.release();
	}
}

main().catch((err) => {
	if (err instanceof Error) {
		console.error(
			"An error occurred while attempting to seed the database:",
			err.message
		);
		console.error("Stack trace:", err.stack);
	} else {
		console.error("Unexpected error:", err);
	}
});
