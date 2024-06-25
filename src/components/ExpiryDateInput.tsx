import React, { useState } from "react";
import ErrorMessage from "./ErrorMessage"; // Assuming the ErrorMessage component exists
import { styleInputErrorAndFocus } from "@/utils/style";

interface ExpiryDateInputProps {
	expiryDate: string;
	setExpiryDate: (value: string) => void;
}

const ExpiryDateInput: React.FC<ExpiryDateInputProps> = ({
	expiryDate,
	setExpiryDate
}) => {
	const [error, setError] = useState<string | null>(null);
	const [isTouched, setIsTouched] = useState<boolean>(false);
	const [isFocused, setIsFocused] = useState<boolean>(false);

	const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;

		// Format the input to MM/YY and handle deletion
		const formattedValue = value
			.replace(/\D/g, "") // Remove all non-digit characters
			.replace(/^(\d{2})(\d)/, "$1/$2") // Add a slash after the first 2 digits
			.slice(0, 5); // Limit input to 5 characters

		setExpiryDate(formattedValue);
	};

	const handleBlur = () => {
		setIsTouched(true);
		setIsFocused(false);
		if (!isValidExpiryDate(expiryDate)) {
			setError("Invalid expiry date.");
		} else {
			setError(null);
		}
	};

	const handleFocus = () => {
		setIsFocused(true);
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
		<div className="flex flex-col gap-1.5 text-sm w-1/2 mr-4">
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
				onFocus={handleFocus}
				onBlur={handleBlur}
				maxLength={5}
				required
				className={styleInputErrorAndFocus(Boolean(error), isFocused)}
				pattern="\d{2}/\d{2}"
				title="Enter expiry date in MM/YY format"
			/>
			{isTouched && error && <ErrorMessage message={error} />}
		</div>
	);
};

export default ExpiryDateInput;
