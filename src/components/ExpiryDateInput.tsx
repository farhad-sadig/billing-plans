import React from "react";

interface ExpiryDateInputProps {
	expiryDate: string;
	setExpiryDate: React.Dispatch<React.SetStateAction<string>>;
}

const ExpiryDateInput: React.FC<ExpiryDateInputProps> = ({
	expiryDate,
	setExpiryDate
}) => {
	const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;

		// Format the input to MM/YY and handle deletion
		const formattedValue = value
			.replace(/\D/g, "") // Remove all non-digit characters
			.replace(/^(\d{2})(\d)/, "$1/$2") // Add a slash after the first 2 digits
			.slice(0, 5); // Limit input to 5 characters

		setExpiryDate(formattedValue);
	};

	const isValidExpiryDate = (date: string) => {
		// Basic validation for MM/YY format
		if (!/^\d{2}\/\d{2}$/.test(date)) return false;

		const [month, year] = date.split("/").map(Number);
		if (month < 1 || month > 12) return false;

		const currentYear = new Date().getFullYear() % 100; // Get last 2 digits of current year
		return year >= currentYear;
	};

	return (
		<div className="flex flex-col gap-1.5 text-sm w-1/2">
			<label className="font-medium text-neutral-700" htmlFor="expiryDate">
				Expiry
			</label>

			<input
				type="text"
				id="expiryDate"
				name="expiryDate"
				placeholder="MM/YY"
				value={expiryDate}
				onChange={handleExpiryDateChange}
				maxLength={5}
				required
				className="flex mr-4 bg-neutral-50 px-3.5 py-2.5 rounded border border-solid border-neutral-200 font-normal text-neutral-500"
				pattern="\d{2}/\d{2}"
				title="Enter expiry date in MM/YY format"
			/>
			{!isValidExpiryDate(expiryDate) && expiryDate.length === 5 && (
				<span className="text-red-500 text-sm">Invalid expiry date</span>
			)}
		</div>
	);
};

export default ExpiryDateInput;
