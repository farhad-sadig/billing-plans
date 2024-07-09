import React, { useState } from "react";
import ErrorMessage from "./ErrorMessage";
import { styleInputErrorAndFocus } from "@/utils/utils";

interface CVVInputProps {
	cvv: string;
	setCvv: (value: string) => void;
}

const CVVInput: React.FC<CVVInputProps> = ({ cvv, setCvv }) => {
	const [error, setError] = useState<string | null>(null);
	const [isTouched, setIsTouched] = useState<boolean>(false);
	const [isFocused, setIsFocused] = useState<boolean>(false);

	const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\D/g, "");
		setCvv(value);
	};

	const handleBlur = () => {
		setIsTouched(true);
		setIsFocused(false);
		if (!isValidCvv(cvv)) {
			setError("Invalid CVV. Must be 3 or 4 digits.");
		} else {
			setError(null);
		}
	};

	const handleFocus = () => {
		setIsFocused(true);
	};

	const isValidCvv = (cvv: string) => {
		return /^\d{3,4}$/.test(cvv); // Valid if 3 or 4 digits
	};

	return (
		<div className="flex flex-col gap-1.5 text-sm w-1/2 ml-4">
			<label htmlFor="cvv" className="font-medium text-neutral-700">
				CVV
			</label>
			<input
				type="text"
				id="cvv"
				name="cvv"
				placeholder="123"
				value={cvv}
				onChange={handleCvvChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
				maxLength={4}
				required
				className={styleInputErrorAndFocus(Boolean(error), isFocused)}
				pattern="\d{3,4}"
				title="Enter 3 or 4 digit CVV"
			/>
			{isTouched && error && <ErrorMessage message={error} />}
		</div>
	);
};

export default CVVInput;
